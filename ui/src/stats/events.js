import { propEq } from 'ramda'
import { filter } from 'rxjs/operators'

export const STATS_UPDATED = 'STATS_UPDATED'

export const setupStatsEvents = ({events, store, catApi}) => {

  catApi.getStats()
    .then(r => store.dispatch({
      type: STATS_UPDATED,
      payload: r
    }))

  events
    .pipe(
      filter(propEq('type', STATS_UPDATED))
    ).subscribe(store.dispatch)

}