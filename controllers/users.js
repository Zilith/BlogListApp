const userRouter = require('express').Router()
const User = require('../models/users')
const bcrypt = require('bcrypt')

userRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('blogs', {
    title: 1,
    author: 1,
    url: 1,
  })

  res.status(201).json(users)
})

userRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body
  const saltRounds = 10

  const user = await User.findOne({ username: username })

  if (user !== null) {
    return res.status(400).json({ error: 'the username already exist' })
  }

  if (password.length <= 2) {
    return res
      .status(400)
      .json({ error: 'the password must be at least 3 characters long' })
  }

  const cryptPassword = await bcrypt.hash(password, saltRounds)

  const newUser = new User({
    username: username,
    name: name,
    passwordHash: cryptPassword,
  })

  const response = await newUser.save()

  return res.status(201).json(response)
})

//delete user

module.exports = userRouter
