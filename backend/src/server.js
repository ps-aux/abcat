import express from 'express'
import './log'
import { info } from './info'
import Mongo from './db/mongo'
import { catApi } from './cat/catApi'
import bodyParser from 'body-parser'
import { EventBus } from './event/EventBus'
import { eventOf } from './event/Event'
import { APP_STARTED } from './events'
import http from 'http'
import { setupWs } from './ws'
import path from 'path'

if (process.env.DEV_MODE) {
  console.log('running in dev mode')
}
const mongo = Mongo({
  url: process.env.MONGO_URL,
  dbName: process.env.MONGO_DB_NAME
})

const app = express()
const server = http.createServer(app)
const eventBus = EventBus()
genericMiddleware(app)
infoEndpoint(app)
setupWs({server, eventBus})

server.listen(process.env.PORT || 3000, () => {
  log.info(`Server started`)
  log.trace('Trace level enabled')

  const createRouter = express.Router
  mongo.then(mongo => {
    app.use('/api/cat',
      catApi({
        router: createRouter(),
        eventBus,
        mongo,
        createRouter
      }))
    eventBus.publish(eventOf(APP_STARTED))
    staticResources(app)
  })

})

function infoEndpoint (app) {
  app.get('/info', (req, res) => res.json(info()))
}

function genericMiddleware (app) {
  app.use(bodyParser.json())
  app.use((req, res, next) => {
      res.json = res.json.bind(res)
      res.send = res.send.bind(res)
      next()
    }
  )
}

function staticResources (app) {
  const pubDirConf = process.env.PUBLIC_DIR
  const pubDir = pubDirConf.startsWith('/') ? pubDirConf : path.join(__dirname, process.env.PUBLIC_DIR)

  log.info('serving static file from', pubDir)
  app.use('/', express.static(pubDir))
  app.get('*', (req, res) => {
    res.sendFile(pubDir + '/index.html')
  })
}
