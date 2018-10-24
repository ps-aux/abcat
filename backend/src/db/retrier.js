const wait = time => new Promise(res => setTimeout(res, time))

export const retrier = () => {
  const log = Log({name: 'mongo-operation-retrier'})

  const isWriteConflict = err => err.code === 112

  return async (operation, {maxCount = 10, delay = 300} = {}) => {
    let count = 1
    // Handle conflicting updates
    while (true) {
      try {
        const r = await operation()
        return r
      } catch (err) {
        if (isWriteConflict(err)) {
          log.trace(`Write conflict detected on attempt #${count}. Will try again.`)
          if (count > maxCount) {
            log.info(`Maximum number of retries (${maxCount}) reached.`)
            throw err
          }
          count++
          await wait(delay)
        } else {
          throw err
        }
      }
    }
  }
}