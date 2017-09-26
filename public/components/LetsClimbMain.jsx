import React from 'react'
import {render} from 'react-dom'
import {Redirect, Route, Link} from 'react-router-dom'
import ClimberList from 'Components/ClimberList'
import SelectLocation from 'Components/SelectLocation'

export default class LetsClimbMain extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {}

    this.handleSelectLocation = this.handleSelectLocation.bind(this)
  }

  handleSelectLocation (loc) {
    this.setState({ latitude: loc.latitude, longitude: loc.longitude })
  }

  render () {
    let makeLink = () => "/list/" + this.state.latitude + "/" + this.state.longitude
    return (
      <div>
        <header className='bg-black-90 tracked fw6 ttu pl3 pv2 yellow overflow-auto'>
          <a href="/" className='fl no-underline yellow dib'>Lets Climb Stuff</a>
          <a className='no-underline fr pl3 dib white-90' href="https://trello.com/b/7llp91a8">Trello</a>
          <a className='no-underline fr pl3 dib white-90' href="https://github.com/narthur157/letsclimbstuff">Develop</a>
        </header>
        <Route exact path="/" render={() => (
          this.state.longitude ? (
            <Redirect to={makeLink()}/>
        ) : (
            <div className='mw7 center'>
              <SelectLocation onSelectLocation={this.handleSelectLocation} />
            </div>
          )
        )} /> 
        <Route path="/list/:latitude/:longitude" component={ClimberList}/>
      </div>
    )
  }
} 