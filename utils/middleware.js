const logger = require('./logger')
const morgan = require('morgan')

morgan.token('data', function (req) {
  return JSON.stringify(req.body)
})
morgan.token('origin', (req) => req.rawHeaders[1] || 'no-origin')

const morganMiddleware = morgan(':method :url :response-time :data :origin')

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, _next) => {
  logger.error(error.name)
  logger.error(error.message)

  if (error.name === 'CastError') {
    res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    res.status(400).send({ error: error.message })
  }
}

module.exports = {
  morganMiddleware,
  unknownEndpoint,
  errorHandler,
}
