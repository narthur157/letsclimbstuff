import React from 'react'
import {render} from 'react-dom'
import Climber from 'Components/Climber'

export default class Climbers extends React.Component {
  render() {
      let climbers = this.props.climbers.map((climber, index) => (
        <Climber name={climber.name} desc={climber.desc} latitude={climber.latitude} longitude={climber.longitude} key={index} />)
      )

      return (
        <article className='center mw7'>
          <h1 className='f4 fw6 pb3'>Climbers near you</h1>
          <label className='f6 fw5 dib w-20'>Name</label>
          <label className='f6 fw5 dib w-80'>How to find</label>
          <ul className='list pl0 ml0 mt0 bt bb b--light-silver'>{climbers}</ul>
        </article>
      )
  }
}