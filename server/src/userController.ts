import {getSubscription, Subscription} from './subscriptionController'
import {getClimber, UClimber} from './climberController'
import 'express-session'
import {Request, Response} from 'express'

export interface User {
  climber: UClimber;
  subscription: Subscription;
}

export const getUserReq = (req: Request, res: Response): void => {
  let user = {
    climber: getClimber(req.session.id),
    subscription: getSubscription(req.session.id)
  }

  res.json(user)
}