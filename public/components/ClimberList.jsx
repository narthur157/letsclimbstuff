import React from 'react'
import {render} from 'react-dom'
import Climbers from 'Components/Climbers'
import SetClimberForm from 'Components/SetClimberForm'

const server = 'https://' + document.domain + ':8001/'
const getClimbers = (lat, lon) => server + 'climbers/' + lat + '/' + lon
const addClimber = server + 'setClimber'

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

    Notification.requestPermission()
    
    let updateClimbers = () => {
      let numClimbersOld = this.state.climbers.length
      fetch(getClimbers(this.state.latitude, this.state.longitude), {
        method: 'GET'
      }).then(resp => {
        return resp.text()
      }).then(val => {
        console.log('fetched', val)
        this.setState({
          climbers: JSON.parse(val)
        })

        if (this.state.climbers.length > numClimbersOld) {
          new Notification('There are new climbers near you')
        }
      })
    }

    updateClimbers()

    // TODO: reconsider this
    let foreverUpdateClimbers = () => {
      setTimeout(() => {
        updateClimbers()
        foreverUpdateClimbers()
      }, 3000)
    }

    foreverUpdateClimbers()
  }
  
  handleAddClimber (climber) {
    if (this.state.sId) { climber.sId = this.state.sId }

    climber.latitude = this.state.latitude
    climber.longitude = this.state.longitude 

    // Significant hack used here to get state without CORS
    // Server just saves the session id and sends it back, client keeps track of it
    // TODO: Session correctly
    fetch(addClimber, {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json'
      },
      body: JSON.stringify(climber)
    }).then(resp => resp.text()).then(sId => this.setState({ sId }))

    // this.setState({ climbers: newClimbers })
  }
  
  render() {
    return (
      <div>
        <Climbers climbers={this.state.climbers} />
        <SetClimberForm onSubmitClimber={this.handleAddClimber}/>
      </div>
    )
  }
}
