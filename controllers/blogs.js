const blogRouter = require('express').Router()
const Blog = require('../models/blogs')
const User = require('../models/users')
const jwt = require('jsonwebtoken')
const { SECRET } = require('../utils/config')
const { userExtractor } = require('../utils/middleware')

blogRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  return res.json(blogs)
})

blogRouter.post('/', userExtractor, async (req, res, _next) => {
  //it is necesary next?
  const { title, author, url, likes } = req.body
  const decodedToken = jwt.verify(req.token, SECRET)

  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)

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

  return res.status(201).json(result)
})

blogRouter.put('/:id', async (req, res) => {
  const newInfo = req.body

  if (Object.keys(newInfo).length === 0) {
    return res
      .status(400)
      .json({ error: 'must be contain info to change in JSON' })
  }

  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, newInfo, {
    new: true,
  })

  if (!updatedBlog) {
    return res.status(404).end()
  }

  return res.json(updatedBlog)
})

blogRouter.delete('/:id', userExtractor, async (req, res) => {
  const blog = await Blog.findById(req.params.id)
  const user = req.user

  if (blog.user.toString() !== user.id.toString()) {
    return res.status(403).json({ error: 'no access to this blog' })
  }

  await Blog.findByIdAndDelete(blog.id)
  return res.status(204).send()
})

module.exports = blogRouter
