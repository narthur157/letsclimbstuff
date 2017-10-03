import React from 'react'
import {render} from 'react-dom'

export default class SetClimberForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      desc: ''
    }
    
    this.handleNameChange = this.handleNameChange.bind(this)
    this.handleDescChange = this.handleDescChange.bind(this)
    this.handleSubmitClimber = this.handleSubmitClimber.bind(this)
  }

  handleNameChange (e) {
    this.setState({
      username: e.target.value
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
      <footer className='pa2 black-80 bt w-100'>
        <div className='pa1 center'>
          <label className='f6 b dib mb2'>Mountain Project e-mail (preferred) or name</label>
          <input type='text' id='name' className='wide-measure input-reset ba b--black-20 pa2 mb2 db w-100'
                 onChange={this.handleNameChange} value={this.state.username} />
          <label className='f6 b db mb2 pt2'>How to find you and what you want to do</label>
          <input className='wide-measure input-reset ba b--black-20 pa2 mb2 db w-100' type='text' id='desc' onChange={this.handleDescChange} value={this.state.desc} />
          <button className='w-100 b f6 link dim ba bw1 ph3 pv2 dib' type='button' onClick={this.handleSubmitClimber}>Add/Update my information</button>
        </div>
      </footer>
    )
  }
}