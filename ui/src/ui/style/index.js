import jss, { ThemeProvider } from 'react-jss'
import React from 'react'

const theme = {
  color: 'red',
  spacing: 10
}

export const withCss = jss

export const withRootCss = rootCss => withCss(t => ({
  root: props => rootCss(t, props)
}))

export const StyleProvider = ({children}) =>
  <ThemeProvider children={children}
                 theme={theme}/>