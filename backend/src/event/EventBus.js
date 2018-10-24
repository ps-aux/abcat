import { Subject } from 'rxjs'
import { filter } from 'rxjs/operators'

export const EventBus = () => {
  const sub = new Subject()
  const log = Log({name: 'event'})

  return {
    publish: e => {
      log.trace('event', e)
      sub.next(e)
    },
    events: ({type} = {}) =>
      sub.pipe(
        filter(e => {
          if (!type)
            return true
          return e.type === type
        }))
  }
}