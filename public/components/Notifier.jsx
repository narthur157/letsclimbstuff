import React from 'react'
import URLSafeBase64 from 'urlsafe-base64'


export default class Notifier extends React.Component {
	constructor(props) {
		super(props);
		this.toggleSubscribe = this.toggleSubscribe.bind(this)
	}

	static swRegistration
	static featureDetect() {
		if (!('serviceWorker' in navigator)) { return false }

		if (!('PushManager' in window)) { return false }

		return true
	}

	static register() {
		if (!Notifier.featureDetect()) {
			throw new Error ('Check for features before using notifier')
		}

		return navigator.serviceWorker.register('service-worker.js')
			.then(registration => {
				console.log('sw registered')
				console.log(registration)
				return registration
			})
			.catch(err => {
				console.log('sw err', err)
			})
	}

	static subscribeUserToPush(registration) {
    const subscribeOptions = {
      userVisibleOnly: true,
      applicationServerKey: URLSafeBase64.decode('BMf5nsjgSgXO2Mka-RRrQRQb96UhTot8ld6TVP4u2eY26tYziiJuJadcGwTmIdOFl7tny6ciFQLwsEoxCyXhzPs')
    }

	  return registration.pushManager.subscribe(subscribeOptions)
		  .then(function(pushSubscription) {

		    console.log('Received PushSubscription: ', JSON.stringify(pushSubscription))
		    return pushSubscription
		  })
	}

	static sendSubscriptionToBackEnd(subscription, location) {
	  return fetch(`http:\/\/${document.domain}:8001/save-subscription/${location.latitude}/${location.longitude}`, {
	    method: 'POST',
	    credentials: 'include',
	    headers: {
	      'Content-Type': 'application/json'
	    },
	    body: JSON.stringify(subscription)
	  })
	  .then(function(response) {
	    if (!response.ok) {
	      throw new Error('Bad status code from server.')
	    }

	    return response.json()
	  })
	  .then(function(responseData) {
	    console.log(responseData)
	    if (!(responseData.data && responseData.data.success)) {
	      throw new Error('Bad response from server.')
	    }
	    return responseData
	  })
	}

	// This will open a prompt for the user
	static askPermission() {
	  return new Promise(function(resolve, reject) {
	    const permissionResult = Notification.requestPermission(function(result) {
	      resolve(result)
	    })

	    if (permissionResult) {
	      permissionResult.then(resolve, reject)
	    }
	  })
	  .then(function(permissionResult) {
	    if (permissionResult !== 'granted') {
	      throw new Error('We weren\'t granted permission.')
	    }
	  })
	}

	static unsubscribeUser() {
		if (!Notifier.subscription) {
			throw new Error('Tried to unsubscribe from null subscription')
		}

		return navigator.serviceWorker.ready.then(function(reg) {
		  reg.pushManager.getSubscription().then(function(subscription) {
		    subscription.unsubscribe().then(function(successful) {
		      console.log('unsubscribe successful')
		      Notifier.subscribed = false
		    }).catch(function(e) {
		    	console.err(e)
		    })
		  })        
		})

	}

	static subscribeUser(location) {
		if (!location || !location.latitude || !location.longitude) {
			throw new Error('Cannot subscribe without location')
		}

		return Notifier.askPermission()
			.then(() => {
				return Notifier.register()
			})
			.then(registration => {
				Notifier.registration = registration
				return Notifier.subscribeUserToPush(registration)
			})
			.then(subscriptionInfo => {
				Notifier.subscription = subscriptionInfo
				console.log('sending to backend')
				return Notifier.sendSubscriptionToBackEnd(subscriptionInfo, location)
			})
			.catch(err => {
				console.warn(err)
			})
			.then(result => {
				console.log(result)
				Notifier.subscribed = true
				return result
			})
	}

	toggleSubscribe() {
		let location = {
 			latitude: this.props.latitude,
      longitude: this.props.longitude
		}

		return Notifier.subscribed ? Notifier.unsubscribeUser() : Notifier.subscribeUser(location)
	}

	render () {
		return Notifier.featureDetect() ? (
			<div>
				<label>Receive notifications when climbers post here</label>
				<input type='checkbox' onClick={this.toggleSubscribe} />
			</div>
		) : (
			<div>Notifications not available on this platform</div>
		)
	}
}
