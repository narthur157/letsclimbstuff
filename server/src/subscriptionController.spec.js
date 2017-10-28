const {notifyLoc, addSubscription} = require('../dist/subscriptionController')
const test = require('tape')

test('subscriptionController', function(t) {
    let testSubA = {
        location: { latitude: 30, longitude: 30 },
        subscription: {},
        time: new Date()
    }
    let testSubB = {
        location: { latitude: 30, longitude: 30 },
        subscription: {},
        time: new Date()
    }

    t.test('notifyLoc', function(t) {
        t.plan(2)
        
        addSubscription
    })
})
