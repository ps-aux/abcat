import React from 'react'

const Text = ({children, ...props}) =>
  <span {...props}>{children}</span>

export default Text
