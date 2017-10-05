const express = require ('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const haversine = require('haversine')
const session = require('express-session')
const fs = require('fs')
const request = require('request')
const validator = require('validator')

let app = express()
app.use(cors())
let port = process.env.PORT || 8001

fs.readFile('ssl/mp.key', 'utf8', (err, data) => {
	mpKey = data
	if (err) {
		throw new Error('mp.key not located')
	}
})

if (process.env.NODE_ENV === 'production') {
	port = 8000
}

let mpKey
const mpApi = 'https://www.mountainproject.com/data/'

const getMpUser = email => {
	return mpApi + 'get-user?email=' + email  + '&key=' + mpKey 
}

app.use(bodyParser())

let climbers = []
let climberMap = {}
let updateClimberData = climber => {
	climberMap[climber.sId] = climber
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

let updateClimber = (climber, res) => {
	let clientClimber = {
		sId: climber.sId,
		desc: climber.desc,
		latitude : climber.latitude,
		longitude: climber.longitude,
		time: new Date()
	}

	let serverClimber = climberMap[climber.sId]

	if (!serverClimber) {
		console.log('Tried to update null climber')
		res.status(500).send('Tried to update null climber')
	}
	else {
		Object.assign(serverClimber, clientClimber)
		res.json(climber.sId)
	}
}

app.put('/climber', (req, res) => updateClimber(req.body, res))

app.post('/climber', (req, res) => {
	let climber = { 
		username: req.body.username,
	  desc: req.body.desc,
	  latitude: req.body.latitude,
	  longitude: req.body.longitude,
	  time: new Date(),
	}

	if (validator.isEmail(climber.username)) {
		// Use the username to prevent extra requests to MP API
		climber.sId = climber.username
		if (climberMap[climber.sId]) {
			// This is actually an update call, little hacky just client might not know
			return updateClimber(climber, res)
		}

		reqMp(climber.username, mpData => {
			if (mpData) {
				Object.assign(climber, mpData)
				updateClimberData(climber)
				res.json(climber.sId)
			}
			else {
				console.log('Bad mp email')
				res.status(500).send('Bad MP email')
			}
		})
	}
	else {
		climber.sId = Math.floor(Math.random() * 99999)
		climber.name = climber.username
		updateClimberData(climber)

		res.json(climber.sId)
	}

	console.log(climbers)
})

app.get('/climbers/:latitude/:longitude', (req, res) => {
	const loc = { latitude: req.params.latitude, longitude: req.params.longitude }
	let nearbyClimbers = climbers.filter(climber => haversine(climber, loc) < 5)

	const climberDuration = 45
	// Remove any climber that hasn't been updated in climberDuration minutes
	nearbyClimbers = nearbyClimbers.filter(climber => {
		let age = (new Date() - new Date(climber.time))/1000/60

		if (age >= climberDuration) {
			delete climberMap[climber.sId]
		}

		climbers = Object.values(climberMap)

		return age < climberDuration
	})

	res.json(nearbyClimbers)
})

app.listen(port, () => {
	console.log('http listening on port', port)
})
