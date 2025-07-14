require('dotenv').config()

const MONGODB_URI =
  'test' === process.env.NODE_ENV
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI
const PORT = process.env.PORT

const SECRET = process.env.SECRET

const NORMALUSER_TOKEN = process.env.NORMALUSER_TOKEN
const SUPERUSER_TOKEN = process.env.SUPERUSER_TOKEN

module.exports = {
  MONGODB_URI,
  PORT,
  SECRET,
  NORMALUSER_TOKEN,
  SUPERUSER_TOKEN,
}
