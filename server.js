const express = require ('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const haversine = require('haversine')

const app = express()
app.use(cors())


const port = 8000

app.use(bodyParser())

let climbers = []

app.post('/addClimber', (req, res) => {
	const climber = { name: req.body.name,
					  desc: req.body.desc,
					  latitude: req.body.latitude,
					  longitude: req.body.longitude 
					}

	climbers.push(climber)
	console.log(climbers)
	res.sendStatus(200)
})

app.get('/climbers/:latitude/:longitude', (req, res) => {
	const loc = { latitude: req.params.latitude, longitude: req.params.longitude }
	const nearbyClimbers = climbers.filter(climber => haversine(climber, loc) < 5)

	res.json(nearbyClimbers)
})

app.listen(port, () => {
	console.log('sending')
})