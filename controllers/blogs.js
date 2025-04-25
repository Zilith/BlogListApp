const blogRouter = require('express').Router()
const Blog = require('../models/blogs')

blogRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({})
  res.json(blogs)
})

blogRouter.post('/', async (req, res) => {
  //it is necesary next?
  const blog = new Blog(req.body)

  const result = await blog.save()
  res.status(201).json(result)
})

module.exports = blogRouter
