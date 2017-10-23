let server
if (document.domain.includes('letsclimbstuff')) {
  server = 'https:\/\/' + document.domain + ':8001'
}
else {
  server = 'http:\/\/' + document.domain + ':8001'
}

let addClimber = (climber, method) => fetch(`${server}/climber`, {
  method,
  credentials: 'include',
  headers: {
    'Content-Type':  'application/json'
  },
  body: JSON.stringify(climber)
})

export default {
  climbers: {
    GET: (lat, lon) => {
      let url = `${server}/climbers/${lat}/${lon}`

      return fetch(url, {
        method: 'GET',
        credentials: 'include'
      })
    },
  },
  climber: {
    POST: climber => addClimber(climber, 'POST'),
    PUT: climber => addClimber(climber, 'PUT')
  },
  user: {
    GET: () => fetch(`${server}/user`, {
      method: 'GET',
      credentials: 'include'
    })
  },
  subscriptions: {
    POST: (subscription, latitude, longitude) => fetch(`${server}/subscriptions/${latitude}/${longitude}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(subscription)
    }),
    DELETE: () => fetch(`${server}/subscriptions`, {
      method: 'DELETE',
      credentials: 'include'
    })
  }
} 