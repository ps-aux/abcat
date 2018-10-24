import nanoid from 'nanoid'

const genSessionId = nanoid

export const SessionManager = () => {

  let currentSession = genSessionId()

  return {
    currentSession: () => {
      return currentSession
    }
  }
}