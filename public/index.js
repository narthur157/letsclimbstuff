import React from 'react'
import {render} from 'react-dom'
import {BrowserRouter} from 'react-router-dom'
import LetsClimbMain from 'Components/LetsClimbMain.jsx'
import 'tachyons'

render((
  <BrowserRouter>
    <LetsClimbMain />
  </BrowserRouter>
), document.getElementById('root'))