const express = require ('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
app.use(cors())


const port = 8000

app.use(bodyParser())

let climbers = []

app.post('/addClimber', (req, res) => {
	const climber = { name: req.body.name, desc: req.body.desc }
	console.log(req.body)
	climbers.push(climber)
	console.log(climbers)
	res.sendStatus(200)
})

app.get('/climbers', (req, res) => {
	res.json(climbers)
})

app.listen(port, () => {
	console.log('sending')
})