import React from 'react'
import {render} from 'react-dom'

export default class Climber extends React.Component {
  render() {
    let latlon = this.props.latitude + ' ' + this.props.longitude

    return (
        <li className='ph0 pv0 bb b--light-silver overflow-auto'>
          <p className='dib w-25 fw1 black-90 truncate fl'>{this.props.name}</p>
          <p className='dib w-70 fw1 black-70 fr'>{this.props.desc}</p>
        </li>
    )
  }
}