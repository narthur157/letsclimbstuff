import React from 'react'
import {render} from 'react-dom'

export default class SetClimberForm extends React.Component {
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
      <form className='pa2 black-80 bb'>
        <div className='measure pa1 center'>
          <label className='f6 b db mb2'>Name</label>
          <input type='text' id='name' className='input-reset ba b--black-20 pa2 mb2 db w-100'
                 placeholder='Name' onChange={this.handleNameChange} value={this.state.name} />
          <label className='f6 b db mb2 pt2'>How to find you</label>
          <input className='input-reset ba b--black-20 pa2 mb2 db w-100' type='text' id='desc' onChange={this.handleDescChange} value={this.state.desc} placeholder='Description' />
          <button className='w-100 f6 link dim ba bw1 ph3 pv2 mb2 dib black--50' type='button' onClick={this.handleSubmitClimber}>Add/Update my information</button>
        </div>
      </form>
    )
  }
}