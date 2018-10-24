export const txManager = ({client}) => {
  const log = Log({name: 'mongo-tx-manager', level: 'info'})

  return async operation => {
    const session = client.startSession()
    const opts = {session}

    log.trace('starting transaction')
    session.startTransaction()
    try {
      const res = await operation(opts)
      log.trace('commiting transaction')
      await session.commitTransaction()
      session.endSession()
      return res
    } catch (err) {
      log.trace('aborting transaction due to error', err)
      await session.abortTransaction()
      session.endSession()
      throw err
    }
  }
}