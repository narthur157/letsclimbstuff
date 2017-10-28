// import {getClimbers} from './climberController'
const {MSG_EXP_MIN} = require('../dist/main')
const test = require('tape')
const proxyquire = require('proxyquire')
const mpData = require('../fixtures/mpData.json')


// Stub out mp to prevent spamming mp api with requests
const mpStub = {
    reqMp: () => {
        return new Promise((resolve, reject) => {
            resolve(mpData)
        })
    }
}
const climberController = proxyquire('../dist/climberController', { './mp': mpStub })
const {getClimbers, addClimber, addMPClimber, updateClimber, getClimber} = climberController

const testLoc = { latitude: 31, longitude: 30 }
const testClimber = { username: 'a', location: testLoc, time: new Date() }
const testMPClimber = { username: 'fakeemail@gkale.com', location: testLoc, time: new Date() }
test('climberController', function(t) {  
    t.test('addClimber', function(t) {
        t.plan(1)
        addClimber(testClimber, 'a')
        t.equal(getClimbers(testLoc).length, 1)
    })

    t.test('getClimbers', function(t) {
        t.plan(2)
        let result = getClimbers(testLoc)
        t.equal(result.length, 1)
        t.deepEqual(result[0], testClimber)
    })  

    t.test('getClimbers doesnt include climbers too far away', function(t) {
        t.plan(1)
        t.equal(getClimbers({ latitude: 0, longitude: 0}).length, 0)
    })

    t.test('getClimber', function(t) {
        t.plan(1)
        t.deepEqual(getClimber('a'), testClimber)
    })

    t.test('updateClimber', function(t) {
        t.plan(5)

        t.equal(updateClimber({}, 'b'), false)
        t.equal(updateClimber({}, 'a'), true)
        t.deepEqual(getClimbers(testLoc)[0], testClimber)
        let time = new Date()

        let saveTest = Object.assign({}, testClimber)
        
        t.equal(updateClimber({ time }, 'a'), true)
        let updatedClimber = getClimbers(testLoc)[0]

        t.notDeepEqual(updatedClimber, saveTest)
    })


    t.test('getClimbers discards expired climbers', function(t) {
        t.plan(1)
        let climber = getClimber('a')

        // time is in ms
        let time = new Date(climber.time.valueOf() - ((MSG_EXP_MIN+1)*1000*60))
        updateClimber({time}, 'a')

        let climbers = getClimbers(testLoc)

        t.equal(climbers.length, 0)
    })

    t.test('add MP climber', function(t) {
        t.plan(2)

        addMPClimber(testMPClimber, 'mp').then(result => {
            t.equal(result.name, 'Nick Arthur')
            t.equal(getClimbers(testLoc).length, 1)
        })
    })
})
