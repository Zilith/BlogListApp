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
    const newblog = new Blog({
      title: 'Big Data',
      author: 'Diego',
      url: 'https://bigdata.com/',
      likes: 4,
    })
    await newblog.save()
    const response = await helper.blogsInDb()
    const titles = response.map((blog) => blog.title)

    assert.strictEqual(
      response.length,
      helper.initialBlogs.length + 1,
      'the number of blogs increase'
    )
    assert.strictEqual(titles.includes('Big Data'), true)
  })
  test.only('blog without likes is defaut to 0', async () => {
    const newblog = new Blog({
      title: 'Big Data',
      author: 'Diego',
      url: 'https://bigdata.com/',
    })
    await newblog.save()
    const response = await helper.blogsInDb()
    const likes = response.map((blog) => blog.likes)

    assert.strictEqual(typeof likes.at(-1), 'number', 'new like is a number')
    assert.strictEqual(likes.at(-1), 0, 'new like value is 0')
  })
  test.only('title is missing', async () => {
    await api
      .post('/api/blogs')
      .send({ author: 'Diego', url: 'https://bigdata.com/', likes: 4 })
      .expect(400)
  })
  test.only('url is missing', async () => {
    await api
      .post('/api/blogs')
      .send({
        title: 'Big Data',
        author: 'Diego',
        likes: 4,
      })
      .expect(400)
  })
})

after(async () => {
  await mongoose.connection.close()
})
