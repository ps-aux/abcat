import io from 'socket.io'

export const setupWs = ({eventBus, server}) => {
  const ws = io(server)
  eventBus.events().subscribe(e => {
    if (e.meta && e.meta.pushToClients)
      ws.emit('event', e)
  })

}