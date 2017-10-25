const request = require('request')
import {MPClimber} from './climberController'

const fs = require('fs')

let mpKey
const mpApi = 'https://www.mountainproject.com/data/'


fs.readFile('ssl/mp.key', 'utf8', (err, data) => {
  mpKey = data
  if (err) {
    throw new Error('mp.key not located')
  }
})

const getMpUser = (email: string): string => {
  return mpApi + 'get-user?email=' + email  + '&key=' + mpKey 
}

export const reqMp = (email: string): Promise<MPClimber> => {
  let reqUrl = getMpUser(email)
  return new Promise((resolve, reject) => {
    request(reqUrl, (err, resp, body) => {
      if (body) {
        let parsed = JSON.parse(body)

        let filtered: MPClimber = <MPClimber>{
          username: parsed.name,
          name: parsed.name,
          url: parsed.url,
          styles: parsed.styles,
          avatar: parsed.avatar,
        }

        resolve(filtered)
      }
      else {
        reject('Bad mp email')
      }
    })    
  })
}