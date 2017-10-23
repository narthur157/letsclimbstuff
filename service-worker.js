'use strict'

self.addEventListener('push', function(event) {
  if (event.data) {
  	let data = event.data.json()

		const promiseChain = self.registration.showNotification(`${data.name} wants to climb`,
		{
			icon: data.avatar,
			body: data.desc,
			tag: 'posting',
      data: {
        clientLoc: data.clientLoc
      }
		})

		event.waitUntil(promiseChain)
  }
  else {
  	console.log('Push has no data')
  }
})

self.addEventListener('notificationclick', event => {
  const notification = event.notification
  let location

  if (!notification.clientLoc || !notification.latitude || !notification.longitude) {
    notification.close()
    location = notification.data.clientLoc
  }
  console.log(location)
  const urlToOpen = new URL(`list/${location.latitude}/${location.longitude}`, self.location.origin).href

  const promiseChain = clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  })
  .then((windowClients) => {
    let matchingClient = null

    for (let i = 0; i < windowClients.length; i++) {
      const windowClient = windowClients[i];
      if (windowClient.url === urlToOpen) {
        matchingClient = windowClient
        break
      }
    } 

    if (matchingClient) {
      return matchingClient.focus()
    } else {
      return clients.openWindow(urlToOpen)
    }
  })

  event.waitUntil(promiseChain)
})