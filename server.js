const express = require ('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const haversine = require('haversine')
const session = require('express-session')
const fs = require('fs')

let app = express()

let port = process.env.PORT || 8001

if (process.env.NODE_ENV !== 'production') {
	app.use(cors())
	port = 8001
}

app.use(bodyParser())

let climbers = []
let climberMap = {}

app.post('/setClimber', (req, res) => {
	const climber = { name: req.body.name,
					  desc: req.body.desc,
					  latitude: req.body.latitude,
					  longitude: req.body.longitude,
					  time: req.body.time,
					  sId: req.body.sId
					}

	let id = climber.sId ? JSON.parse(climber.sId) : Math.floor(Math.random() * 99999)
	climber.sId = id

	climberMap[climber.sId] = climber
	climbers = Object.values(climberMap)

	console.log(climbers)
	res.json(id)
})

app.get('/climbers/:latitude/:longitude', (req, res) => {
	const loc = { latitude: req.params.latitude, longitude: req.params.longitude }
	let nearbyClimbers = climbers.filter(climber => haversine(climber, loc) < 5)

	const climberDuration = 10
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
