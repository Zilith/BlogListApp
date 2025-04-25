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


after(async () => {
  await mongoose.connection.close()
})
