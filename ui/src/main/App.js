import React from 'react'
import View from '../ui/basic/components/View'
import Header from './Header'
import { Redirect, Route, Switch } from 'react-router'
import Stats from '../stats/Stats'
import { router } from './routes'
import Voting from '../voting/Voting'
import TopCats from '../top-cats/TopCats'
import { withCss } from '../ui/style'

const App = ({classes}) =>
  <View className={classes.root}>
    <Header/>
    <main className={classes.main}>
      <Switch>
        <Route path={router.voting()} component={Voting}/>
        <Route path={router.stats()} component={Stats}/>
        <Route path={router.topCats()} component={TopCats}/>
        <Redirect to={router.voting()}/>
      </Switch>
    </main>
  </View>

const headerHeight = 40
export default withCss({
  root: {
    minHeight: '100vh'
  },
  main: {
    marginTop: headerHeight,
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    background: '#e2e2e2'
  }
})(App)
