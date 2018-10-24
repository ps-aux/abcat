export const exceptLast = style => ({
  '& >*:not(:last-child)': style
})

export const centerContent = () => ({
  alignItems: 'center',
  justifyContent: 'center'
})