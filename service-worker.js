'use strict'

self.addEventListener('push', function(event) {
  if (event.data) {
  	let data = event.data.json()
  	console.log(data)
		const promiseChain = self.registration.showNotification(`${data.name} wants to climb`,
		{
			icon: data.avatar,
			body: data.desc,
			tag: 'posting'
		})

		event.waitUntil(promiseChain)
  }
  else {
  	console.log('Push has no data')
  }
})