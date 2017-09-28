import React from 'react'
import {render} from 'react-dom'
import {Link} from 'react-router-dom'
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

  makeLink (loc) {
    return '/list/' + loc.latitude + '/' + loc.longitude
  }

  render () {
    let earthTreksUrl = this.makeLink({
      latitude: 38.861922,
      longitude: -77.050498
    })

    let movementUrl = this.makeLink({
      latitude: 40.030016,
      longitude: -105.257420
    })

    return (
      <div>
        <h3>Where would you like to climb?</h3>
        <Geolocate onLocated={this.handleLocate} />
        <Link to={earthTreksUrl}>
          <button className='w-100 f6 link dim ba bw1 ph3 pv2 mb2 dib black--50' type="button">Earth Treks - Crystal City</button>
        </Link>
        <Link to={movementUrl}>
          <button className='w-100 f6 link dim ba bw1 ph3 pv2 mb2 dib black--50' type="button">Movement - Boulder</button>
        </Link>
      </div>
    )
  }
}