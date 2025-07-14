const jwt = require('jsonwebtoken')
const User = require('../models/users')
const { SECRET } = require('../utils/config')
const logger = require('./logger')
const morgan = require('morgan')

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')

  if (authorization && authorization.startsWith('Bearer ')) {
    req.token = authorization.replace('Bearer ', '')
  } else {
    req.token = null
  }
  next()
}

const userExtractor = async (req, res, next) => {
  const decodedToken = jwt.verify(req.token, SECRET)

  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token missing or invalid' })
  } else {
    req.user = await User.findById(decodedToken.id)
  }
  next()
}

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
    res.status(400).json({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    res.status(400).json({ error: error.message })
  } else if (
    error.name === 'MongoServerError' &&
    error.message.includes('E11000')
  ) {
    return res.status(400).json({ error: 'exprected username to be unique' })
  } else if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'invalid token' })
  } else if (error.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'token expired' })
  }
  _next(error)
}

module.exports = {
  morganMiddleware,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
}
