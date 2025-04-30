const { test, describe, after, beforeEach } = require('node:test')
const app = require('../app')
const supertest = require('supertest')
const assert = require('assert')
const helper = require('./test_helper')
const User = require('../models/users')
const mongoose = require('mongoose')
//const User = require('../models/users')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
  await User.insertMany(helper.initialUsers)
})

describe('HTTP POST', () => {
  test('users are returned as a json', async () => {
    await api
      .get('/api/users')
      .expect(201)
      .expect('Content-Type', /application\/json/)
  })
  test('a valid user is created', async () => {
    const usersAtStart = await helper.blogsInDb()

    const newUser = {
      username: 'Zilith',
      name: 'Alejandro',
      password: 'ContraseñaUwU',
    }

    const response = await api.post('/api/users').send(newUser).expect(201)

    const usersAtEnd = await helper.usersInDb()
    const usernames = usersAtEnd.map((user) => user.username)

    assert.strictEqual(response.body.username, newUser.username)
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
    assert(usernames.includes(response.body.username))
  })
})

after(async () => {
  await mongoose.connection.close()
})
