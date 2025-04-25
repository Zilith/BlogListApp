require('dotenv').config()

const MONGODB_URI =
  'test' === process.env.NODE_ENV
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI
const PORT = process.env.PORT

module.exports = {
  MONGODB_URI,
  PORT,
}
