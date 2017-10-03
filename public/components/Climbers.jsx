import React from 'react'
import {render} from 'react-dom'
import Climber from 'Components/Climber'

export default class Climbers extends React.Component {
  render() {
      console.log(this.props.climbers)
      let climbers = this.props.climbers.map((climber, index) => (
        <Climber url={climber.url} avatar={climber.avatar} name={climber.name} time={climber.time} desc={climber.desc} latitude={climber.latitude} longitude={climber.longitude} key={index} />)
      )

      let climberTable = <ul className='list pl0 ml0 mt0 b--white-90'>{climbers}</ul>

      if (this.props.climbers.length < 1) {
        climberTable = (
          <div>
            <h3 className='tc black-60'>Climbers will appear here</h3>
            <h4 className='tc black-60'>Add yourself so others can find you</h4>
          </div>
        )
      }

      return (
        <article className='center mw7 overflow-auto vh-50 ph1'>
          {climberTable}
        </article>
      )
  }
}