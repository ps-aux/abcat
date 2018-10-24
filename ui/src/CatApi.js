import axios from 'axios'
import { prop } from 'ramda'

export const CatApi = () => {

  const http = axios.create()
  http.interceptors.response.use(prop('data'))

  return {
    nextPair: ({session, vote}) => http.post(`/api/cat/voting/next-pair?session=${session}`, {
      vote: vote && {
        pickId: vote.pick.id,
        pair: {
          aId: vote.pair.a.id,
          bId: vote.pair.b.id
        }
      }
    }),

    getStats: () => http.get('/api/cat/stats'),

    getCatList: ({offset, size, sort}) =>
      http.get(`/api/cat/list?size=${size}&offset=${offset}&sort=${sort}`)
  }
}