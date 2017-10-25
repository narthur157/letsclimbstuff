const express = require ('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const session = require('express-session')
const fs = require('fs')
const validator = require('validator')

import {addClimberReq, getClimbersReq, updateClimberReq} from './climberController'
import {addSubscriptionReq, deleteSubscriptionReq} from './subscriptionController'
import {getUserReq} from './userController'
let app = express()

let port = process.env.PORT || 8001

process.on('disconnect', function() {
  console.log('parent exited')
  process.exit();
});

process.on('exit', function () {
  console.log('About to exit.');
});

let sess = {
  secret: 'keyboard cat',
  cookie: {
    secure: false
  },
  resave: true,
  saveUninitialized: true
}

if (app.get('env') === 'production') {
  app.set('trust proxy', 1)
  sess.cookie.secure = true
  port = 8000
}

app.use(cors({
  origin: /http:\/\/localhost:8080*/,
  credentials: true
}))
app.use(session(sess))
app.use(bodyParser.json({ extended: true }))

app.put('/climber', updateClimberReq)
app.post('/climber', addClimberReq)
app.get('/climbers/:latitude/:longitude', getClimbersReq)
app.post('/subscriptions/:latitude/:longitude', addSubscriptionReq)
app.delete('/subscriptions', deleteSubscriptionReq)

app.get('/user', getUserReq)


app.listen(port, () => {
	console.log('http listening on port', port)
})
