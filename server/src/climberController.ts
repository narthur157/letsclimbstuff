import {Location} from './main'
import {notifyLoc} from './subscriptionController'
import 'express-session'
import {Response, Request} from 'express'
import {DISTANCE_THRESHOLD_KM, MSG_EXP_MIN} from './main'
const validator = require('validator')
const haversine = require('haversine')
import {getSubscription} from './subscriptionController'
import {reqMp} from './mp'

export type UClimber = Climber | MPClimber

export interface Climber {
  name?: string;
  username: string;
  location: Location;
  desc?: string;
  time: Date;
}

export interface MPClimber extends Climber {
  avatar: string;
  name: string;
  url: string;
  styles: object;
}

let climbers : (UClimber)[] = []
let climberMap : Map<string, UClimber> = new Map()

const pruneClimbers = () => {
  for (let [id, climber] of climberMap) {
    let age : number = (new Date().valueOf() - new Date(climber.time).valueOf())/1000/60

    if (age >= MSG_EXP_MIN) {
      console.log('deleting overage climber')
      
      climberMap.delete(id)
    }
  }

  climbers = Array.from(climberMap.values())
}

export const parseClimberFromReq = (req: Request): Climber => {
  return {
    username: req.body.username,
    desc: req.body.desc,
    location: new Location(req.body.latitude, req.body.longitude),
    time: req.body.time
  }
}

export const addClimberReq = (req : Request, res: Response): void => {
  let climber = parseClimberFromReq(req)
  console.log(req.body, climber)
  if (climberMap.get(req.session.id)) {
    return updateClimberReq(req, res)
  }

  if (validator.isEmail(climber.username)) {
    addMPClimber(climber, req.session.id)
    .then(() => {
      res.json({
        data: {
          success: true
        }
      })
    })
    .catch(err => {
      res.status(404).send('MP email doesnt exist')
    })
  }
  else {
    addClimber(climber, req.session.id)
  }
}

export const addClimber = (climber: Climber, id: string) => {
  climber.name = climber.username
  updateClimberData(climber, id)
  notifyLoc(climber, id)

  return id  
}

export const addMPClimber = (climber: Climber, id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    reqMp(climber.username)
    .then(mpData => {
      Object.assign(climber, mpData)
      updateClimberData(climber, id)
      notifyLoc(climber, id)
      resolve()
    })
  })
}

export const getClimbersReq = (req: Request, res: Response): void => {
  let location = new Location(req.params.latitude, req.params.longitude)
  let result: (UClimber)[] = getClimbers(location)

  res.json(result)
}

export const getClimber = (id: string): UClimber => {
  return climberMap.get(id)
}

export const getClimbers = (loc: Location): (UClimber)[] => {
  pruneClimbers()
  let nearbyClimbers = climbers.filter(climber => haversine(climber.location, loc) < DISTANCE_THRESHOLD_KM)
  return nearbyClimbers
}

let updateClimberData = (climber: UClimber, id: string) => {
  climberMap.set(id, climber)
  climbers = Array.from(climberMap.values())
}

export const updateClimber = (climber: Climber, id: string): boolean => {
  let serverClimber = climberMap.get(id)

  if (!serverClimber) {
    return false
  }
  else {
    Object.assign(serverClimber, climber)
    notifyLoc(serverClimber, id)
    return true
  }
}

export const updateClimberReq = (req: Request, res: Response) => {
  let clientClimber = parseClimberFromReq(req)
  clientClimber.time = new Date()

  let updateClimberSuccess = updateClimber(clientClimber, req.session.id)
  if (!updateClimberSuccess) {
    console.log('Tried to update null climber')
    res.status(500).send('Tried to update null climber')
  }
  else {
    res.json({
      data: {
        success: true
      }
    })
  }
}