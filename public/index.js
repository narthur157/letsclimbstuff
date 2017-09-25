import React from 'react'
import {render} from 'react-dom'
import {BrowserRouter} from 'react-router-dom'
import LetsClimbMain from 'Components/LetsClimbMain.jsx'

import 'tachyons'

console.log('react app started', BrowserRouter, LetsClimbMain, render, React)

render((
  <BrowserRouter>
    <LetsClimbMain />
  </BrowserRouter>
), document.getElementById('root'))