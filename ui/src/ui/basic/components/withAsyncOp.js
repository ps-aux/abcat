import { withHandlers, withStateHandlers } from 'recompose'
import { compose } from 'ramda'

export const withAsyncOp = () =>
  compose(
    withStateHandlers({
      error: false,
      pending: false,
      done: false,
      result: undefined
    }, {
      opStarted: () => () => ({
        error: false,
        pending: true,
        done: false,
      }),
      opSuccess: () => result => ({
        error: false,
        pending: false,
        done: true,
        result: result
      }),
      opError: () => error => ({
        error: error,
        pending: false,
        done: false,
      })
    }),

    withHandlers({
      runAsync: ({opStarted, opSuccess, opError, ...props}) => action => {
        opStarted()
        action(props)
          .then(opSuccess)
          .catch(opError)
      }
    })
  )