import React from 'react'
import {render} from 'react-dom'
import {BrowserRouter, Route, Link} from 'react-router-dom'
import 'typeface-roboto'
import Button from 'material-ui/Button'
import Grid from 'material-ui/Grid'
import Paper from 'material-ui/Paper'
import Typography from 'material-ui/Typography'
import TextField from 'material-ui/TextField'
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List'

const server = "http://localhost:8000/"
const getClimbers = (lat, lon) => server + "climbers/" + lat + "/" + lon
const addClimber = server + "setClimber"


// TODO: Split components into their own files
class ClimberList extends React.Component {
  constructor (props) {
    super(props)

    this.state = { 
      climbers: [],
      latitude: this.props.match.params.latitude,
      longitude: this.props.match.params.longitude,
      climberAdded: false
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
      <Grid container>
        <Grid item xs={6}>
          <AddClimberForm onSubmitClimber={this.handleAddClimber}/>
        </Grid>
        <Grid item xs={12}>
          <Climbers climbers={this.state.climbers} />
        </Grid>
      </Grid>
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
      <Paper>
        <Grid container>
          <Grid item>
            <TextField id='name' label='Name' onChange={this.handleNameChange} value={this.state.name} />
          </Grid>
          <Grid item>
            <TextField id='desc' onChange={this.handleDescChange} value={this.state.desc} label='Description' />
          </Grid>
          <Grid item>
            <Button color='primary' onClick={this.handleSubmitClimber}>Add me to the list</Button>
          </Grid>
        </Grid>
      </Paper>
    )
  }
}

class Climber extends React.Component {
  render() {
    let latlon = this.props.latitude + ' ' + this.props.longitude

    return (
        <ListItem>
          <ListItemText primary={this.props.name}></ListItemText>
          <ListItemText primary={this.props.desc}></ListItemText>
        </ListItem>
    )
  }
}

class Climbers extends React.Component {
  render() {
      let climbers = this.props.climbers.map((climber, index) => (
        <Climber name={climber.name} desc={climber.desc} latitude={climber.latitude} longitude={climber.longitude} key={index} />)
      )

      return (
        <Paper>
          <Typography type="display2">Climbers</Typography>
          <List>{climbers}</List>
        </Paper>
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
        <Route exact path="/" render={() => (
          <div>
            <SelectLocation onSelectLocation={this.handleSelectLocation} />
            <Link to={makeLink()}>See climbers</Link>
          </div>
        )} /> 
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
      <Paper>
        <Typography>Your location is {this.state.latitude} {this.state.longitude}</Typography>
      </Paper>
    )
  }
}

render((
  <BrowserRouter>
    <LetsClimbMain />
  </BrowserRouter>
), document.getElementById('root'))