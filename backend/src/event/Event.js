export const eventOf = (type, payload = {}, meta = {}) => ({
  type,
  meta,
  payload
})
