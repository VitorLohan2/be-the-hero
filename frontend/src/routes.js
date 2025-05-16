import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import Logon from './pages/Logon'
import Register from './pages/Register'
import Profile from './pages/Profile'
import NewIncident from './pages/NewIncident'
import Visitors from './pages/Visitors'
import History from './pages/History'


export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Logon} />
        <Route path="/register" component={Register} />
        <Route path="/profile" component={Profile} />
        <Route path="/incidents/new" component={NewIncident} />
        <Route path="/visitors" component={Visitors} /> {/* Nova rota */}
        <Route path="/history" component={History} />
      </Switch>
    </BrowserRouter>
  )
}