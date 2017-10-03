import React from 'react'
import {render} from 'react-dom'
import moment from 'moment'
import ReactLetterAvatar from 'react-letter-avatar'


export default class Climber extends React.Component {
  render() {
  	let time = moment(this.props.time).format('LT')
  	let avatar = (
      <a href={this.props.url}>
        <img href={this.props.url} className="pv2 fl dib w2 h2 br-100" src={this.props.avatar} />
      </a>
    )

    if (!this.props.avatar) {
      avatar = <ReactLetterAvatar className="pv2 fl dib w2 h2 br-100" name={this.props.name} size={40} radius={20} />
    }

    return (
      <li className='ph0 pv0 bb b--light-silver overflow-auto'>
        <div className='fl w-10 dib'>
            {avatar}
        </div>
        <p className='dib w-60 fw3 black fl'>{this.props.desc}</p>
      	<div className='pv2 dib w-30 fw1 black-90 truncate fr'>
        	<a href={this.props.url} className='tr db f6 fw3 black truncate'>{this.props.name}</a>
        	<span className='tr db f6 black-50 truncate'>{time}</span>
        </div>
      </li>
    )
  }
}