const { test, describe, after, beforeEach } = require('node:test')
const app = require('../app')
const supertest = require('supertest')
const assert = require('assert')
const helper = require('./test_helper')
const Blog = require('../models/blogs')
const mongoose = require('mongoose')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

describe('HTTP GET', () => {
  test('blogs are returned as a json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const result = await helper.blogsInDb()

    assert.strictEqual(result.length, helper.initialBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const result = await helper.blogsInDb()

    const contents = result.map((blog) => blog.title)
    assert.strictEqual(contents.includes('React patterns'), true)
  })

  test('blog post is named id, not _id', async () => {
    const response = await helper.blogsInDb()
    for (const blog of response) {
      assert.ok(blog.id, 'blog have the property id')
      assert.strictEqual(typeof blog.id, 'string')
      assert.strictEqual(blog._id, undefined, 'shoud not have _id')
    }
  })
})

describe('HTTP POST', () => {
  test('creates a new blog', async () => {
    const newblog = {
      title: 'Big Data',
      author: 'Diego',
      url: 'https://bigdata.com/',
      likes: 4,
    }

    const token = helper.generateToken()

    const response = await api
      .post('/api/blogs')
      .set({
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      })
      .send(newblog)
      .expect(201)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(response.body.title, 'Big Data', 'title is Big Data')
    assert.strictEqual(
      blogsAtEnd.length,
      helper.initialBlogs.length + 1,
      'the number of blogs increase',
    )
  })
  test('blog without likes is defaut to 0', async () => {
    const newblog = {
      title: 'Big Data',
      author: 'Diego',
      url: 'https://bigdata.com/',
    }

    const token = helper.generateToken()

    const response = await api
      .post('/api/blogs')
      .set({
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      })
      .send(newblog)
      .expect(201)

    assert.strictEqual(response.body.likes, 0, 'new like value is 0')
    assert.strictEqual(
      typeof response.body.likes,
      'number',
      'new like is a number',
    )
  })
  test('title is missing', async () => {
    const token = helper.generateToken()

    await api
      .post('/api/blogs')
      .set({
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      })
      .send({ author: 'Diego', url: 'https://bigdata.com/', likes: 4 })
      .expect(400)
  })
  test('url is missing', async () => {
    const token = helper.generateToken()

    await api
      .post('/api/blogs')
      .set({
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      })
      .send({
        title: 'Big Data',
        author: 'Diego',
        likes: 4,
      })
      .expect(400)
  })
  test('fails with status code 401 if token is not provided', async () => {
    const newblog = {
      title: 'Big Data',
      author: 'Diego',
      url: 'https://bigdata.com/',
      likes: 4,
    }
    const response = await api
      .post('/api/blogs')
      .set({
        'Content-Type': 'application/json',
      })
      .send(newblog)
      .expect(401)

    assert.strictEqual(
      response.body.error,
      'invalid token',
      'error message is correct',
    )
  })
})

describe('HTTP PUT', () => {
  /*
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  */

  test('succeeds with statuscode 201 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    let blogToUpdate = blogsAtStart[0]

    blogToUpdate.title = 'Angular patterns'

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()
    const titles = blogsAtEnd.map((blog) => blog.title)
    assert(titles.includes('Angular patterns'))
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
  })

  test('fails with a statuscode 400 if id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445'
    const blogsAtStart = await helper.blogsInDb()
    let blogToUpdate = blogsAtStart[0]

    await api.put(`/api/blogs/${invalidId}`).send(blogToUpdate).expect(400)
  })
})

describe('HTTP DELETE', () => {
  test('succeeds with statuscode 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[1]

    const token = helper.generateToken()

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set({
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      })
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    const titles = blogsAtEnd.map((blog) => blog.title)
    assert(!titles.includes(blogToDelete.title))
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
  })

  test('fails with a statuscode 400 if id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445'
    const token = helper.generateToken()

    await api
      .delete(`/api/blogs/${invalidId.id}`)
      .set({
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      })
      .expect(400)
  })
})

after(async () => {
  await mongoose.connection.close()
})
