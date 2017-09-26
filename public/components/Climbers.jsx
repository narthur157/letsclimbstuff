import React from 'react'
import {render} from 'react-dom'
import Climber from 'Components/Climber'

export default class Climbers extends React.Component {
  render() {
      let climbers = this.props.climbers.map((climber, index) => (
        <Climber name={climber.name} time={climber.time} desc={climber.desc} latitude={climber.latitude} longitude={climber.longitude} key={index} />)
      )

      return (
        <article className='center mw7 overflow-auto vh-50 ph1'>
          <label className='f6 fw5 dib w-30'>Name</label>
          <label className='f6 fw5 dib w-70'>How to find</label>
          <ul className='list pl0 ml0 mt0 bt b--light-silver'>{climbers}</ul>
        </article>
      )
  }
}