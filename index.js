import React from 'react'
import {render} from 'react-dom'
import {BrowserRouter, Route, Link} from 'react-router-dom'

const server = "http://localhost:8000/"
const getClimbers = (lat, lon) => server + "climbers/" + lat + "/" + lon
const addClimber = server + "addClimber"


// TODO: Split components into their own files
class ClimberList extends React.Component {
  constructor (props) {
    super(props)

    this.state = { 
      climbers: [],
      latitude: this.props.match.params.latitude,
      longitude: this.props.match.params.longitude
    }

    this.handleAddClimber = this.handleAddClimber.bind(this)

    let updateClimbers = () => {
      fetch(getClimbers(this.state.latitude, this.state.longitude), {
        method: 'GET'
      }).then(resp => {
        return resp.text()
      }).then(val => {
        console.log('fetched', val)
        this.setState({
          climbers: JSON.parse(val)
        })
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
    climber.latitude = this.state.latitude
    climber.longitude = this.state.longitude 

    let newClimbers = this.state.climbers
    newClimbers.push(climber)

    fetch(addClimber, {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json'
      },
      body: JSON.stringify(climber)
    })

    this.setState({ climbers: newClimbers })
  }
  
  render() {
    return (
      <div>
        <AddClimberForm onSubmitClimber={this.handleAddClimber}/>
        <Climbers climbers={this.state.climbers} />
      </div>
    )
  }
}

class AddClimberForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      desc: ''
    }
    
    this.handleNameChange = this.handleNameChange.bind(this)
    this.handleDescChange = this.handleDescChange.bind(this)
    this.handleSubmitClimber = this.handleSubmitClimber.bind(this)
  }

  handleNameChange (e) {
    this.setState({
      name: e.target.value
    })
  }
  
  handleDescChange (e) {
    this.setState({
      desc: e.target.value
    })
  }
  
  handleSubmitClimber (e) {
    this.props.onSubmitClimber(this.state)
  }
 
  render() {
    return (
      <div>
        <input onChange={this.handleNameChange} value={this.state.name} placeholder='name' />
        <input onChange={this.handleDescChange} value={this.state.desc} placeholder='description' />
        <button type="button" onClick={this.handleSubmitClimber}>Add Climber</button>
      </div>
    )
  }
}

class Climber extends React.Component {
  render() {
    return (
      <div className="row">
        <div className="col">{this.props.name}</div>
        <div className="col">{this.props.desc}</div>
        <div className="col">{this.props.latitude} {this.props.longitude}</div>
      </div>
    )
  }
}

class Climbers extends React.Component {
  render() {
      let climbers = this.props.climbers.map((climber, index) => (
        <Climber name={climber.name} desc={climber.desc} latitude={climber.latitude} longitude={climber.longitude} key={index} />)
      )

      return (
        <div className="container">
          <h3>Climbers looking for partners:</h3>
          <div className="row">
            <div className="col">Name</div>
            <div className="col">Description</div>
          </div>
          <ul>{climbers}</ul>
        </div>
      )
  }
}

class LetsClimbMain extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      latitude: 'unknown',
      longitude: 'unknown'
    }

    this.handleSelectLocation = this.handleSelectLocation.bind(this)
  }

  handleSelectLocation (loc) {
    this.setState({ latitude: loc.latitude, longitude: loc.longitude })
  }

  render () {
    let makeLink = () => "/list/" + this.state.latitude + "/" + this.state.longitude
    return (
      <div>
        <SelectLocation onSelectLocation={this.handleSelectLocation} />
        <Link to={makeLink()}>See climbers</Link>
        <Route path="/list/:latitude/:longitude" component={ClimberList}/>
      </div>
    )
  }
} 

class SelectLocation extends React.Component {
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

render((
  <BrowserRouter>
    <LetsClimbMain />
  </BrowserRouter>
), document.getElementById('root'))