const blogRouter = require('express').Router()
const Blog = require('../models/blogs')
const User = require('../models/users')

blogRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({})
  res.json(blogs)
})

blogRouter.post('/', async (req, res) => {
  //it is necesary next?
  const { title, author, url, likes } = req.body
  const user = await User.findOne({})
  const blog = new Blog({
    title,
    author,
    url,
    likes,
    user: user.id,
  })

  const result = await blog.save()
  user.blogs = user.blogs.concat(result._id)
  await user.save()

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
