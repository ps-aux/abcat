import { STATS_UPDATED } from './events'

const statsReducer = (s = null, a) => {

  if (a.type === STATS_UPDATED)
    return a.payload

  return s
}

export default statsReducer