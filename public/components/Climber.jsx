import React from 'react'
import {render} from 'react-dom'
import moment from 'moment'
import ReactLetterAvatar from 'react-letter-avatar'

const colorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae']

export default class Climber extends React.Component {
  render() {
  	let time = moment(this.props.time).format('LT')
    let avatar = (
      <a href={this.props.url}>
        <img href={this.props.url} className="fl dib h2 w2 br-100" src={this.props.avatar} />
      </a>
    )

    if (!this.props.avatar) {
      const letter = (this.props.name[0] || 'C').toUpperCase()
      const color = colorList[letter.charCodeAt(0) % colorList.length]

      const circleStyle = {
        backgroundColor: color
      }

      let letterStyle = {
        transform: 'scale(1)',
        position: 'absolute',
        display: 'inline-block',
        left: 'calc(50% - 5px)',
        lineHeight: '2rem',
        color: 'white'
      }

      avatar = (
          <span style={circleStyle} className='fl dib h2 w2 br-100 relative'>
            <span className='tc' style={letterStyle}>{letter}</span>
          </span>
      )
    }

    return (
      <li className='ph0 pv0 bb b--moon-gray overflow-auto flex justify-between'>
        <div className='dib pv2'>
            {avatar}
        </div>
        <p className='dib pl2 f6 fw3 black w-70'>{this.props.desc}</p>
      	<div className='pv2 dib fw1 black-90'>
        	<a href={this.props.url} className='tr db f6 fw3 black truncate'>{this.props.name}</a>
        	<span className='tr db f6 black-50 truncate'>{time}</span>
        </div>
      </li>
    )
  }
}