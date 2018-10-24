import pino from 'pino'

const createLogger = ({name, level}) => pino({
  name,
  level: level || process.env.LOG_LEVEL || 'info',
  prettyPrint: {
    colorize: true,
    translateTime: true
  }
})

global.log = createLogger({
  name: 'global',
  level: process.env.LOG_LEVEL || 'info'
})
global.Log = createLogger

module.exports = {
  createLogger
}
