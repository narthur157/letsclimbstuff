import React from 'react'
import {render} from 'react-dom'
import Climbers from 'Components/Climbers'
import SetClimberForm from 'Components/SetClimberForm'
import Notifier from 'Components/Notifier'
import API from 'Lib/api'

let server
if (document.domain.includes('letsclimbstuff')) {
  server = 'https:\/\/' + document.domain + ':8001/'
}
else {
  server = 'http:\/\/' + document.domain + ':8001/'
}
const getClimbers = (lat, lon) => server + 'climbers/' + lat + '/' + lon
const addClimber = server + 'climber'
const getUser = server + 'user'

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

    API.user.GET().then(resp => {
      return resp.text()
    }).then(val => {
      let {climber, subscription} = JSON.parse(val)

      if (climber) {
        this.setState({ climberAdded: true })
      }
    }).catch(err => {
      console.log(err)
    })

    let updateClimbers = () => {
      let numClimbersOld = this.state.climbers.length
      API.climbers.GET(this.state.latitude, this.state.longitude)
      .then(resp => {
        return resp.text()
      }).then(val => {
        let climbers = JSON.parse(val)
        console.log('fetch climbers', climbers)
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
    let apiMeth = this.state.climberAdded ? API.climber.PUT : API.climber.POST
    climber.latitude = this.state.latitude
    climber.longitude = this.state.longitude

    return new Promise((resolve, reject) => {
      apiMeth(climber)
      .then(resp => {
        if (resp.ok) {
          this.setState({ climberAdded: true })
          return resp.text()
        }
        
        throw new Error('Bad climber update')
      }).catch(err => {
        console.log(err)
        reject(err.message)
      })
    })
  }
  
  render() {
    return (
      <div>
        <Climbers climbers={this.state.climbers} />
        <div className='pa2 center'>
          <SetClimberForm climberAdded={this.state.climberAdded}  onSubmitClimber={this.handleAddClimber}/>
          <Notifier subscription={this.state.subscription} latitude={this.state.latitude} longitude={this.state.longitude} />
        </div>
      </div>
    )
  }
}
