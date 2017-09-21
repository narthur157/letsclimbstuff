import React from 'react'
import {render} from 'react-dom'

export default class SelectLocation extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      latitude: 'unknown',
      longitude: 'unknown'
    }
  }

  render () {
    navigator.geolocation.getCurrentPosition((position) => {
      this.setState({ 
        latitude: position.coords.latitude, 
        longitude: position.coords.longitude
      })

      this.props.onSelectLocation(this.state)
    })

    return (
      <div>
        <p>Your location is {this.state.latitude} {this.state.longitude}</p>
      </div>
    )
  }
}