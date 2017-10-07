import React from 'react'
import {render} from 'react-dom'
import Climbers from 'Components/Climbers'
import SetClimberForm from 'Components/SetClimberForm'
import Notifier from 'Components/Notifier'

let server
if (document.domain.includes('letsclimbstuff')) {
  server = 'https:\/\/' + document.domain + ':8001/'
}
else {
  server = 'http:\/\/' + document.domain + ':8001/'
}
const getClimbers = (lat, lon) => server + 'climbers/' + lat + '/' + lon
const addClimber = server + 'climber'

export default class ClimberList extends React.Component {
  constructor (props) {
    super(props)

    this.state = { 
      climbers: [],
      latitude: this.props.match.params.latitude,
      longitude: this.props.match.params.longitude,
      climberAdded: false
    }

    this.handleAddClimber = this.handleAddClimber.bind(this)
    
  }

  componentDidMount() {
    this._mounted = true

    let updateClimbers = () => {
      let numClimbersOld = this.state.climbers.length
      fetch(getClimbers(this.state.latitude, this.state.longitude), {
        method: 'GET',
        credentials: 'include'
      }).then(resp => {
        return resp.text()
      }).then(val => {
        let climbers = JSON.parse(val)
        console.log('fetching', climbers)
        for (let climber of climbers) {
          if (climber.isRequester) {
            console.log('found our climber')
            this.setState({
              sId: climber.id,
              climberAdded: true
            })
          }
        }

        this.setState({
          climbers
        })
      })
    }

    // TODO: reconsider this
    let foreverUpdateClimbers = () => {
      // Stop updating when this component is gone
      if (this._mounted) {
          updateClimbers()
        setTimeout(() => {
          foreverUpdateClimbers()
        }, 3000)
      }
    }

    foreverUpdateClimbers()
  }

  componentWillUnmount() {
    this._mounted = false
  }
  
  handleAddClimber (climber) {
    let method = this.state.sId ? 'PUT' : 'POST'

    climber.latitude = this.state.latitude
    climber.longitude = this.state.longitude

    // Significant hack used here to get state without CORS
    // Server just saves the session id and sends it back, client keeps track of it
    // TODO: Session correctly
    return new Promise((resolve, reject) => {
      fetch(addClimber, {
        method,
        credentials: 'include',
        headers: {
          'Content-Type':  'application/json'
        },
        body: JSON.stringify(climber)
      }).then(resp => {
        if (resp.ok) {
          return resp.text()
        }
        
        throw new Error(this.state.sId ? 'Bad climber update' : 'Bad email')
      }).then(sId => {
        sId = JSON.parse(sId)
        this.setState({ sId })
        resolve(sId)
      }).catch(err => {
        reject(err.message)
      })
    })
  }
  
  render() {
    return (
      <div>
        <Climbers climbers={this.state.climbers} />
        <SetClimberForm climberAdded={this.state.climberAdded}  onSubmitClimber={this.handleAddClimber}/>
        <Notifier latitude={this.state.latitude} longitude={this.state.longitude} />
      </div>
    )
  }
}
