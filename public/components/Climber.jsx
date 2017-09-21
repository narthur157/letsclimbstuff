import React from 'react'
import {render} from 'react-dom'

export default class Climber extends React.Component {
  render() {
    let latlon = this.props.latitude + ' ' + this.props.longitude

    return (
        <li className='ph1 pv1 bb b--light-silver'>
          <p className='dib w-20	 fw1 black-90'>{this.props.name}</p>
          <p className='dib w-80 fw1 black-70'>{this.props.desc}</p>
        </li>
    )
  }
}