import React from 'react'
import {render} from 'react-dom'
import Climbers from 'Components/Climbers'
import SetClimberForm from 'Components/SetClimberForm'

let server
if (document.domain.includes('letsclimbstuff')) {
  server = 'https://' + document.domain + ':8001/'
}
else {
  server = 'http://' + document.domain + ':8001/'
}
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
    
  }

  componentDidMount() {
    this._mounted = true

    let updateClimbers = () => {
      let numClimbersOld = this.state.climbers.length
      fetch(getClimbers(this.state.latitude, this.state.longitude), {
        method: 'GET'
      }).then(resp => {
        return resp.text()
      }).then(val => {
        this.setState({
          climbers: JSON.parse(val)
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
    if (this.state.sId) { climber.sId = this.state.sId }

    climber.latitude = this.state.latitude
    climber.longitude = this.state.longitude 
    climber.time = new Date()

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
