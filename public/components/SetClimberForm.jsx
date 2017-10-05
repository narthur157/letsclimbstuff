import React from 'react'
import {render} from 'react-dom'
import validator from 'validator'


export default class SetClimberForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      desc: '',
      submitted: false
    }
    
    this.handleNameChange = this.handleNameChange.bind(this)
    this.handleDescChange = this.handleDescChange.bind(this)
    this.handleSubmitClimber = this.handleSubmitClimber.bind(this)
  }

  handleNameChange (e) {
    let username = e.target.value
    this.setState({ username })
    username = username.trim()

    let splitSpaces = username.split(' ').filter(x => x)
    let numWords = splitSpaces.length
    let validName = name => validator.isAlpha(name)

    if (splitSpaces.every(validName) && numWords <= 2) {
      this.setState({
        invalidUsername: false
      })
    }
    else {
      this.setState({
        invalidUsername: !validator.isEmail(username)
      })
      if (validator.isEmail(username)) {
        this.setState({
          invalidUsername: false
        })
      }
      else {
        this.setState({
          invalidUsername: true
        })
      }
    }
  }
  
  handleDescChange (e) {
    this.setState({
      desc: e.target.value
    })
  }
  
  handleSubmitClimber (e) {
    if (!this.state.submitted && this.state.invalidUsername) {
      window.alert('Please enter a valid name (no more than 2 words) or e-mail')
    }
    else {
      this.props.onSubmitClimber(this.state).then(result => {
        if (result) {
          this.state.submitted = true
        }
      }).catch(err => {
        window.alert('E-mail not registered on Mountain Project, try a different one or just use your name')
        this.state.invalidUsername = true
      })
    }
  }

  componentDidMount() {
    this.nameInput.focus()
  }
 
  render() {
    let nameClasses = 'wide-measure input-reset ba pa2 mb2 db w-100 ' + (this.state.invalidUsername ? 'b--orange outline-0' : 'b--black-20 ')
    let submitName = !this.state.submitted ? (
      <div>
        <label className='f6 b dib mb2'>Mountain Project e-mail (preferred) or name</label>
        <input ref={(input) => this.nameInput = input } type='text' id='name' className={nameClasses}
               onChange={this.handleNameChange} value={this.state.username} />
      </div>
    ) : null

    let submitText = !this.state.submitted ? 'Add information to list' : 'Update message'

    return (
      <form className='pa2 black-80 bt w-100'>
        <div className='pa1 center'>
          {submitName}
          <label className='f6 b db mb2 pt2'>How to find you and what you want to do</label>
          <input className='wide-measure input-reset ba b--black-20 pa2 mb2 db w-100' type='text' id='desc' onChange={this.handleDescChange} value={this.state.desc} />
          <button className='w-100 b f6 link dim ba bw1 ph3 pv2 dib bg-gold b-gold' type='button' onClick={this.handleSubmitClimber}>{submitText}</button>
        </div>
      </form>
    )
  }
}