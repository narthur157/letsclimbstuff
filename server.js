const express = require ('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const haversine = require('haversine')
const session = require('express-session')
const fs = require('fs')
const request = require('request')

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

app.post('/setClimber', (req, res) => {
	let climber = { username: req.body.username,
					  desc: req.body.desc,
					  latitude: req.body.latitude,
					  longitude: req.body.longitude,
					  time: req.body.time || new Date(),
					  sId: req.body.sId
					}

	let id
	
	if (climber.username.includes('@')) {
		id = climber.username
	}
	else {
		id = climber.sId ? JSON.parse(climber.sId) : Math.floor(Math.random() * 99999)
	}

	climber.sId = id

	if (climber.username.includes('@') && !climberMap[climber.username]) {
		console.log('Making MP request')

		reqMp(climber.username, mpData => {
			if (mpData) {
					Object.assign(climber, mpData)
			}

			climberMap[climber.sId] = climber
			climbers = Object.values(climberMap)
		})
	}
	else {
		if (!climber.name) { climber.name = climber.username }
		console.log(climber.sId, climber, climberMap[climber.sId])
		
		if (climberMap[climber.sId]) {
			climberMap[climber.sId].time = climber.time
			climberMap[climber.sId].desc = climber.desc
		}
		else {
			climberMap[climber.sId] = climber
		}

		climbers = Object.values(climberMap)
	}

	res.json(id)
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
