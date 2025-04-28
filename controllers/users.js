const userRouter = require('express').Router()
const User = require('../models/users')
const bcrypt = require('bcrypt')

userRouter.get('/', async (req, res) => {
  const users = await User.find({})

  res.status(201).json(users)
})

userRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body
  const saltRounds = 10

  console.log('body', username, name, password)

  const user = await User.findOne({ username: username })

  console.log('user result', user)

  if (user !== null) {
    return res.status(400).json({ error: 'the username already exist' })
  }

  const cryptPassword = await bcrypt.hash(password, saltRounds)

  const newUser = new User({
    username: username,
    name: name,
    passwordHash: cryptPassword,
  })

  const response = await newUser.save()

  return res.status(200).json(response)
})


module.exports = userRouter
