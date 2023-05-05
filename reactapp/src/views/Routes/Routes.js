import React, { lazy } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import FFSpinner from '../components/base/FFSpinner/FFSpinner'

const PageNotFound = lazy(() => import('../pages/PageNotFound/PageNotFound'))

const Home = lazy(() => import('../pages/Home/Home'))

const Routes = () => {
  return (
    <React.Suspense fallback={<FFSpinner />}>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/404" component={PageNotFound} />
        <Redirect to="/404" />
      </Switch>
    </React.Suspense>
  )
}

export default Routes
