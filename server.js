const express = require ('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const haversine = require('haversine')
const session = require('express-session')

const app = express()
app.use(cors())
app.use(session({
	secret: 'super super secret',
	resave: false,
	saveUnitialized: true
}))

const port = process.env.PORT || 8000

app.use(bodyParser())

let climbers = []
let climberMap = {}

app.post('/setClimber', (req, res) => {

	const climber = { name: req.body.name,
					  desc: req.body.desc,
					  latitude: req.body.latitude,
					  longitude: req.body.longitude,
					  sId: req.body.sId
					}

	let id = climber.sId ? JSON.parse(climber.sId) : req.session.id
	climber.sId = id

	climberMap[id] = climber
	climbers = Object.values(climberMap)

	console.log(climbers)
	res.json(id)
})

app.get('/climbers/:latitude/:longitude', (req, res) => {
	const loc = { latitude: req.params.latitude, longitude: req.params.longitude }
	const nearbyClimbers = climbers.filter(climber => haversine(climber, loc) < 5)

	res.json(nearbyClimbers)
})

app.listen(port, () => {
	console.log('sending')
})