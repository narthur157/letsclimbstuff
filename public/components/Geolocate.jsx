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
      // only keep the last 4 decimals to shorten urls
      let truncate = (coord) => {
        let cStr = coord.toString()
        return cStr.substring(0, cStr.indexOf('.')+5)
      }

      let truncated = {
        latitude: truncate(position.coords.latitude),
        longitude: truncate(position.coords.longitude)
      }

      this.setState({ 
        latitude: truncated.latitude, 
        longitude: truncated.longitude
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

    return <button className='b w-100 f6 ba b--yellow dim button-reset ph3 pv2 mb2 dib bg-yellow' onClick={this.handleGeolocate} type='button'>My location</button>
  }
}