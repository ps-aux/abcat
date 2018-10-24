import { SessionManager } from '../session/SessionManager'
import { CatApi } from '../CatApi'
import io from 'socket.io-client'
import { Subject } from 'rxjs'
import { createStore } from '../state'

export const createContext = () => {

  const ws = io()

  const events = new Subject()
  ws.on('event', e => {
    console.debug('received', e)
    events.next(e)
  })

  const store = createStore()
  return {
    catApi: CatApi(),
    sessionManager: SessionManager(),
    events,
    store
  }
}