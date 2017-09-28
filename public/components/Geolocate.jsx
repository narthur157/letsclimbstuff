import React from 'react'
import {render} from 'react-dom'

export default class Geolocate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
    this.handleGeolocate = this.handleGeolocate.bind(this)
  }

  handleGeolocate() {
    navigator.geolocation.getCurrentPosition(position => {
      this.setState({ 
        latitude: position.coords.latitude, 
        longitude: position.coords.longitude
      })

      this.props.onLocated(this.state)

    }, error => {
      this.setState({
        locationError: error.message
      })
    })
  }

  render () {
    if (!navigator.geolocation) {
        return <p>Cannot find my location, geolocation not supported</p>
    }

    if (this.state.locationError) {
      return <p>Error: {this.state.locationError} to find your location, please accept the permission in your browser</p>
    }

    return <button className='w-100 f6 link dim ba bw1 ph3 pv2 mb2 dib black--50' onClick={this.handleGeolocate} type='button'>My location</button>
  }
}