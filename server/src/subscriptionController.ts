import {Location} from './main'
import {Climber, MPClimber} from './climberController'
const haversine = require('haversine')
import 'express-session'
import {Request, Response} from 'express'

const fs = require('fs')

import {MSG_EXP_MIN, DISTANCE_THRESHOLD_KM} from './main'

const webpush = require('web-push')

export interface Subscription {
  time: Date;
  subscription: any
  location: Location
}

type Subscriptions = Map<string, Subscription>

let vapidKeys
fs.readFile('ssl/vapid.keys', 'utf8', (err, data) => {
  vapidKeys = JSON.parse(data)
  webpush.setVapidDetails(
    'mailto:narthur157@gmail.com',
    vapidKeys.public,
    vapidKeys.private
  )
})

let subscriptions:Subscriptions = new Map()

const isValidSaveRequest = (req:Request, res:Response) => {
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

const cleanExpiredSubscriptions = (subs:Subscriptions) : Subscriptions => {
  for (let [id, sub] of subs) {
    let time = sub.time
    let age: Number = (new Date().valueOf() - new Date(time).valueOf())/1000/60

    if (age >= MSG_EXP_MIN) {
      subs.delete(id)
    }
  }

  return subs
}

const triggerPushMsg = (subscription: Subscription, dataToSend: object) : void => {
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

export const getSubscription = id => subscriptions.get(id)

export const notifyLoc = (climber: Climber | MPClimber, senderId: string) => {
  let loc = climber.location
  subscriptions = cleanExpiredSubscriptions(subscriptions)
  let subsToNotify = []

  for (let [id, sub] of subscriptions) {
    // dont notify the sender
    console.log('test TEST')
    if (senderId !== id) {
      let location = sub.location 
      console.log('comparing locs', location, loc)
      if (haversine(location, loc) < DISTANCE_THRESHOLD_KM) {
        subsToNotify.push(subscriptions.get(id))
      }
    }
  }
  //
  console.log(`notifying ${subsToNotify.length} out of ${subscriptions.size} subs`)

  return subsToNotify
  .reduce((promiseChain: Promise<any>, {subscription, location}) => {
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

export let updateSubscription 

export let addSubscriptionReq = (req: Request, res: Response): void => {
  const loc = { latitude: req.params.latitude, longitude: req.params.longitude }

  if (isValidSaveRequest(req, res)) {
    subscriptions.set(req.session.id, {
      location: loc,
      subscription: req.body,
      time: new Date()
    })
    console.log('active subs: ', subscriptions.size)
  }


  res.json({
    data: {
      success: true
    }
  })
}

export let deleteSubscriptionReq = (req: Request, res: Response): void => {
  if (subscriptions.get(req.session.id)) {
    console.log('subs before', Object.keys(subscriptions).length)
    subscriptions.delete(req.session.id)
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
}