import React from 'react'
import {render} from 'react-dom'

export default class SelectLocation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
    // this.state = {
    //   latitude: 'unknown',
    //   longitude: 'unknown'
    // }
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(position => {
      this.setState({ 
        latitude: position.coords.latitude, 
        longitude: position.coords.longitude
      })

      this.props.onSelectLocation(this.state)

    }, error => {
      this.setState({
        locationError: error.message
      })
    })
  }

  render () {
    let result

    if (!navigator.geolocation) {
        return <p>Geolocation not supported by this browser</p>
    }

    console.log(this.state)
    if (this.state.latitude && this.state.longitude) {
      return (
        <div>
          <p>Your location is {this.state.latitude} {this.state.longitude}</p>
        </div>
      )
    }

    if (this.state.locationError) {
      return (
        <div>
          <p>Error: {this.state.locationError}</p>
        </div>
      )
    }

    return (
      <div>
        <p>Accept the location</p>
      </div>
    )
  }
}