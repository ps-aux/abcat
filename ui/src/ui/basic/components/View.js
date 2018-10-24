import React from 'react'
import { withCss } from '../../style'

const View = ({horizontal, classes, className, ...props}) =>
  <div className={classes.root + ' ' + className} {...props}>

  </div>

export default withCss({
  root: {
    display: 'flex',
    flexDirection: ps => ps.horizontal ? 'row' : 'column'
  }
})(View)
