import React from 'react'
import {render} from 'react-dom'
import moment from 'moment'

export default class Climber extends React.Component {
  render() {
  	let time = moment(this.props.time).format('LT')
  	
    return (
      <li className='ph0 pv0 bb b--light-silver overflow-auto'>
      	<div className='pv2 dib w-30 fw1 black-90 truncate fl'>
        	<span className='db fw3 black truncate'>{this.props.name}</span>
        	<span className='db f6 black-50 truncate'>{time}</span>
        </div>
        <p className='dib w-70 fw3 black fr'>{this.props.desc}</p>
      </li>
    )
  }
}