const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/users')
const { SECRET } = require('../utils/config')

loginRouter.post('/', async (req, res) => {
  const { username, password } = req.body

  const user = await User.findOne({ username })

  if (!username || !password) {
    return res.status(400).json({ error: 'username or password missing' })
  }

  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash)

  // If the request body is empty, return an error
  if (Object.keys(req.body).length === 0) {
    res.status(400).json({ error: 'must provide the info in JSON' })
  }

  // If the username or password is not correct, return an error
  if (!(user && passwordCorrect)) {
    res.status(401).json({
      error: 'invalid username or password',
    })
  }

  const userForToken = {
    username: username,
    id: user._id,
  }

  const token = jwt.sign(userForToken, SECRET, { expiresIn: 60 * 60 })

  res.status(200).send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter
