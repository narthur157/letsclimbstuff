import React from 'react'
import {render} from 'react-dom'
import {Route, Link} from 'react-router-dom'
import ClimberList from 'Components/ClimberList'
import SelectLocation from 'Components/SelectLocation'

export default class LetsClimbMain extends React.Component {
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
        <header className='bg-black-90'>
          <h3 className='tracked fw6 ttu pl3 pv2 white-80'>Let's Climb Stuff</h3>
        </header>
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