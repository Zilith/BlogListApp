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

blogRouter.put('/:id', async (req, res) => {
  const newInfo = req.body

  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, newInfo, {
    new: true,
  })

  if (!updatedBlog) {
    res.status(404).end()
  }

  return res.json(updatedBlog)
})

blogRouter.delete('/:id', async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id)
  res.status(204).send()
})

module.exports = blogRouter
