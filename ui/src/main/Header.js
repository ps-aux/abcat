import React from 'react'
import { Menu } from 'semantic-ui-react'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import { router } from './routes'
import View from '../ui/basic/components/View'
import { withCss } from '../ui/style'

export const NavMenuItem = withRouter(({location, path, name}) =>
  <Link to={path}>
    <Menu.Item name='editorials'
               position="right"
               active={location.pathname.startsWith(path)}>
      {name}
    </Menu.Item>
  </Link>)

const Navigation = () =>
  <Menu secondary pointing position="right">
    <NavMenuItem path={router.voting()} name={'Voting'}/>
    <NavMenuItem path={router.stats()} name={'Stats'}/>
    <NavMenuItem path={router.topCats()} name={'Top cats'}/>
  </Menu>

const Header = ({classes}) =>
  <View className={classes.root}>
    <Navigation/>
  </View>

export default withCss({
  root: {
    top: 0,
    left: 0,
    width: '100%',
    position: 'absolute'
  }
})(Header)