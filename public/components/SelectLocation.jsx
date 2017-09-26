import React from 'react'
import {render} from 'react-dom'
import Geolocate from 'Components/Geolocate.jsx'

export default class SelectLocation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
    this.handleLocate = this.handleLocate.bind(this)
  }

  handleLocate(location) {
    this.setState({
      latitude: location.latitude,
      longitude: location.longitude
    })

    this.props.onSelectLocation(location)
  }

  render () {
    let result
    if (this.state.latitude && this.state.longitude) {
      result = (
        <div>
          <p>Your selected location is {this.state.latitude} {this.state.longitude}</p>
        </div>
      )
    }
    else {
      let earthTreks = {
        latitude: 38.861922,
        longitude: -77.050498
      }

      let movement = {
        latitude: 40.030016,
        longitude: -105.257420
      }

      result = (
        <div>
          <h3>Where would you like to climb?</h3>
          <Geolocate onLocated={this.handleLocate} />
          <button className='w-100 f6 link dim ba bw1 ph3 pv2 mb2 dib black--50' type="button" onClick={this.handleLocate.bind(this, earthTreks)}>Earth Treks - Crystal City</button>
          <button className='w-100 f6 link dim ba bw1 ph3 pv2 mb2 dib black--50' type="button" onClick={this.handleLocate.bind(this, movement)}>Movement - Boulder</button>
        </div>
      )
    }

    return result
  }
}