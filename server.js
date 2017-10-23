const express = require ('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const haversine = require('haversine')
const session = require('express-session')
const fs = require('fs')
const request = require('request')
const validator = require('validator')
const webpush = require('web-push')

const DISTANCE_THRESHOLD_KM = 5
const MSG_EXP_MIN = 45

let app = express()

let port = process.env.PORT || 8001
if (app.get('env') === 'production') {
	app.set('trust proxy', 1)
	sess.cookie.secure = true
	port = 8000
}

let sess = {
  secret: 'keyboard cat',
  cookie: {}
}

app.use(cors({
	origin: /http:\/\/localhost:8080*/,
	credentials: true
}))

app.use(session(sess))


fs.readFile('ssl/mp.key', 'utf8', (err, data) => {
	mpKey = data
	if (err) {
		throw new Error('mp.key not located')
	}
})

let vapidKeys
fs.readFile('ssl/vapid.keys', 'utf8', (err, data) => {
	vapidKeys = JSON.parse(data)
	webpush.setVapidDetails(
	  'mailto:narthur157@gmail.com',
	  vapidKeys.public,
	  vapidKeys.private
	)
})

const triggerPushMsg = function(subscription, dataToSend) {
  return webpush.sendNotification(subscription, JSON.stringify(dataToSend))
  .catch((err) => {
    if (err.statusCode === 410) {
    	// delete subscription
      return Promise.resolve()
    } else {
      console.log('Subscription is no longer valid: ', err)
    }
  })
}


let mpKey
const mpApi = 'https://www.mountainproject.com/data/'

const getMpUser = email => {
	return mpApi + 'get-user?email=' + email  + '&key=' + mpKey 
}

app.use(bodyParser())

// TODO: Use some sort of data store
let climbers = []
let climberMap = {}
let subscriptions = {}

let updateClimberData = climber => {
	console.log(climber.id)
	climberMap[climber.id] = climber
	climbers = Object.values(climberMap)
}

let reqMp = (email, cb) => {
	let reqUrl = getMpUser(email)
	request(reqUrl, (err, resp, body) => {
		if (body) {
			let parsed = JSON.parse(body)

			let filtered = {
				name: parsed.name,
				url: parsed.url,
				styles: parsed.styles,
				avatar: parsed.avatar,
			}

			cb(filtered)
		}
		else {
			cb(false)
		}
	})

}

let updateClimber = (req, res) => {
	let clientClimber = {
		id: req.session.id,
		desc: req.body.desc,
		latitude : req.body.latitude,
		longitude: req.body.longitude,
		time: new Date()
	}

	const loc = { latitude: clientClimber.latitude, longitude: clientClimber.longitude }

	let serverClimber = climberMap[clientClimber.id]

	let sub = subscriptions[clientClimber.id]

	if (sub) {
		sub.location = loc
	}


	if (!serverClimber) {
		console.log('Tried to update null climber')
		res.status(500).send('Tried to update null climber')
	}
	else {
		Object.assign(serverClimber, clientClimber)
		notifyLoc(serverClimber)
		res.json(clientClimber.id)
	}
}

app.put('/climber', (req, res) => {
	return updateClimber(req, res)
})

const cleanExpiredSubscriptions = subs => {
	for (id in subs) {
		let {time} = subs[id]
		let age = (new Date() - new Date(time))/1000/60

		if (age >= MSG_EXP_MIN) {
			delete subs[id]
		}
	}

	return subs
}

const notifyLoc = climber => {
	console.log(climber)
	climber = climberMap[climber.id]
	console.log(climber)

	let loc = {
		latitude: climber.latitude,
		longitude: climber.longitude
	}

	let senderId = climber.id
	subscriptions = cleanExpiredSubscriptions(subscriptions)
	let subsToNotify = []

	for (id in subscriptions) {
		if (senderId !== id) {
			let {location} = subscriptions[id] 

			if (haversine(location, loc) < DISTANCE_THRESHOLD_KM) {
				subsToNotify.push(subscriptions[id])
			}
			else {
				console.log('filtered out distance')
			}
		}
		else {
			console.log('filtered out sender')
		}
	}

	console.log(subsToNotify)

	return subsToNotify
		.reduce((promiseChain, {subscription, location}) => {
			let notifData = Object.assign({ clientLoc: location}, climber)
			return promiseChain.then(() => triggerPushMsg(subscription, notifData))
		}, Promise.resolve())
	  .then(() => {
	    console.log('Notifications sent successfully')
	  })
	  .catch(function(err) {
	    console.warn('Notifications not sent successfully', err)
	  })
}

app.post('/climber', (req, res) => {
	let climber = { 
		username: req.body.username,
	  desc: req.body.desc,
	  latitude: req.body.latitude,
	  longitude: req.body.longitude,
	  time: new Date(),
	  id: req.session.id
	}

	if (climberMap[req.session.id]) {
		return updateClimber(req, res)
	}

	let loc = { latitude: climber.latitude, longitude: climber.longitude }

	if (validator.isEmail(climber.username)) {
		reqMp(climber.username, mpData => {
			if (mpData) {
				Object.assign(climber, mpData)
				updateClimberData(climber)
				notifyLoc(climber)
				res.json(climber.id)
			}
			else {
				console.log('Bad mp email')
				res.status(404).send('Bad MP email')
			}
		})
	}
	else {
		climber.name = climber.username
		updateClimberData(climber)
		notifyLoc(climber)

		res.json(climber.id)
	}

	console.log(climbers)
})

app.get('/user', (req, res) => {
	let user = {
		climber: climberMap[req.session.id],
		subscription: subscriptions[req.session.id]
	}

	res.json(user)
})

app.get('/climbers/:latitude/:longitude', (req, res) => {
	const loc = { latitude: req.params.latitude, longitude: req.params.longitude }
	let nearbyClimbers = climbers.filter(climber => haversine(climber, loc) < DISTANCE_THRESHOLD_KM)

	// Remove any climber that hasn't been updated in MSG_EXP_MIN minutes
	nearbyClimbers = nearbyClimbers.filter(climber => {
		let age = (new Date() - new Date(climber.time))/1000/60

		if (age >= MSG_EXP_MIN) {
			delete climberMap[climber.id]
		}

		climbers = Object.values(climberMap)

		return age < MSG_EXP_MIN
	})

	res.json(nearbyClimbers)
})

const isValidSaveRequest = (req, res) => {
  // Check the request body has at least an endpoint.
  if (!req.body || !req.body.endpoint) {
    // Not a valid subscription.
    res.status(400)
    res.setHeader('Content-Type', 'application/json')
    res.send(JSON.stringify({
      error: {
        id: 'no-endpoint',
        message: 'Subscription must have an endpoint.'
      }
    }))
    return false
  }
  return true
}


app.post('/subscriptions/:latitude/:longitude', function (req, res) {
	const loc = { latitude: req.params.latitude, longitude: req.params.longitude }

	if (isValidSaveRequest(req, res)) {
		subscriptions[req.session.id] = {
			location: loc,
			subscription: req.body,
			time: Date.now()
		}
		console.log('active subs: ', Object.keys(subscriptions).length)
	}


  res.json({
  	data: {
  		success: true
  	}
  })
})

app.delete('/subscriptions', (req, res) => {
	if (subscriptions[req.session.id]) {
		console.log('subs before', Object.keys(subscriptions).length)
		delete subscriptions[req.session.id]
		console.log('subs after', Object.keys(subscriptions).length)
		res.json({
			data: {
				success: true
			}
		})
	}
	else {
		res.status(400)
		res.json({
			error : {
				id: 'no-sub',
				message: 'Subscription must exist to delete'
			}
		})
	}
})

app.listen(port, () => {
	console.log('http listening on port', port)
})
