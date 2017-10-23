import React from 'react'
import {render} from 'react-dom'
import {Redirect, Route, Link, withRouter} from 'react-router-dom'
import ClimberList from 'Components/ClimberList'
import SelectLocation from 'Components/SelectLocation'
import PropTypes from 'prop-types'


class LetsClimbMain extends React.Component {
  constructor(props) {
    super(props);

    this.state = {}

    this.handleSelectLocation = this.handleSelectLocation.bind(this)
  }

  handleSelectLocation (loc) {
    this.setState({ latitude: loc.latitude, longitude: loc.longitude })

    if (loc.latitude && loc.longitude) {
      this.props.history.push(this.makeLink(loc))
    }
  }

  makeLink (loc) {
    return '/list/' + loc.latitude + '/' + loc.longitude
  }

  render () {
    return (
      <div>
        <header className='bg-black-90 tracked fw6 ttu pl3 pv2 yellow overflow-auto'>
          <Link to='/' className='fl no-underline yellow dib'>Let's Climb Stuff</Link>
          <a className='f4 fr dib white' href='https://trello.com/b/7llp91a8'>
            <i className='fa fa-trello' aria-hidden='true'></i>
          </a>
          <a className='f4 ph2 fr dib white' href='https://github.com/narthur157/letsclimbstuff'>
            <i className='fa fa-github-square' aria-hidden='true'></i>
          </a>
        </header>
        <Route exact path='/' render={() => (
          <div>
            <div className='mw7 center'>
              <SelectLocation onSelectLocation={this.handleSelectLocation} />
            </div>
            <div className='mw7 center'>
              <h4>Hi! Thanks for trying out this app. It's brand new</h4>
              <p>So: because of that, your feedback is particularly important. Send all bugs/feature requests/thoughts to me at narthur157@gmail.com</p>
              <p>At the top right, there's a link <a href="https://trello.com/b/7llp91a8">to the trello board</a></p>
              <p>This is an easy way to see the status of development. If you send me feedback, it'll probably  end up on here somewhere</p>
              <p>There's also a link <a href="https://github.com/narthur157/letsclimbstuff">to the GitHub</a> for this project.</p> 
              <p>I'd be happy to have contributors for this project, so feel free to make a PR or e-mail me</p>
              <h4>What is this app?</h4>
              <p>It's a way to find people to climb with. Mountain Project has a solid partner finder, but it's hard to find people last minute</p>
              <h4>How do I use it?</h4>
              <p>Select a location above. This will bring you to a list of climbers. All entries expire after 45 minutes. You can prevent your entry from expiring by editing it</p>
              <p>Make sure you include any info in your description that's important to finding you or deciding to climb with you.</p>
              <p>You might want to consider mentioning what type of climbing you're doing, what grades you're trying, and what you look like and where exactly you are</p>
              <p>Users will be displayed if they are within 5km of the coordinates that you see in the URL (letsclimbstuff.com/list/latitude/longitude)</p>
              <p>If you want to give me money for some reason, send me BTC 12AgJh2eB3Dg9V3tXUDkWBgznPxpcsASh6</p>
            </div>
          </div>
        )} /> 
        <Route path='/list/:latitude/:longitude' component={ClimberList}/>
      </div>
    )
  }
} 

export default withRouter(LetsClimbMain)