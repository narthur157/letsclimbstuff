import React from 'react'
import URLSafeBase64 from 'urlsafe-base64'
import API from 'Lib/api'

// TODO: Split this into a static lib class and a component class
export default class Notifier extends React.Component {
	constructor(props) {
		super(props)
		this.state = { subscribed: false }
		this.toggleSubscribe = this.toggleSubscribe.bind(this)
		Notifier.subscribeUser = Notifier.subscribeUser.bind(this)
		Notifier.unsubscribeUser = Notifier.unsubscribeUser.bind(this)
	}

	componentDidMount() {
		API.user.GET().then(resp => {
			if (resp.ok) {
				return resp.text()
			}
		}).then(val => {
			let user = JSON.parse(val)
			console.log(user)
			if (user.subscription) {
				console.log('user has sub on server, trying to sub..')
				Notifier.subscribeUser(this.getLocation())
			}
		}).catch(err => {
			console.log(err)
		})
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
				console.log('sw registered', registration)

				return registration
			})
			.catch(err => {
				console.warn('sw err', err)
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
		  .catch(err => {
		  	console.warn(err)
		  })
	}

	static sendSubscriptionToBackEnd(subscription, location) {
	  return API.subscriptions.POST(subscription, location.latitude, location.longitude)
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
	  }
)	}

	static unsubscribeUser() {
		if (!Notifier.subscription) {
			throw new Error('Tried to unsubscribe from null subscription')
		}

		return navigator.serviceWorker.ready.then(reg => {
		  reg.pushManager.getSubscription().then(subscription => {
		  	// Even if server fails to unsubscribe, this will still prevent notifications
		    subscription.unsubscribe().then(successful => {
		    	this.setState({ subscribed: false })
		      Notifier.subscribed = false
		    }).catch((e) => {
		    	console.err(e)
		    })
		    .then(() => API.subscriptions.DELETE())
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
				console.log('sub successs', result)
				this.setState({ subscribed: true })
				Notifier.subscribed = true
				return result
			})
	}

	getLocation() {
		return {
 			latitude: this.props.latitude,
      longitude: this.props.longitude
		}
	}

	toggleSubscribe() {
		let location = this.getLocation()

		return Notifier.subscribed ? Notifier.unsubscribeUser() : Notifier.subscribeUser(location)
	}
	render () {
		return Notifier.featureDetect() ? (
			<div>
				<label className='pr1'>Receive notifications when climbers post here</label>
				<input type='checkbox' onClick={this.toggleSubscribe} checked={this.state.subscribed} />
			</div>
		) : (
			<div>Notifications not available on this platform</div>
		)
	}
}
