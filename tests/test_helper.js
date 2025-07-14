const Blog = require('../models/blogs')
const User = require('../models/users')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const user1Id = new mongoose.Types.ObjectId('687583016a6f73587522da70')
const user2Id = new mongoose.Types.ObjectId('687583546a6f73587522da73')

const blog1Id = new mongoose.Types.ObjectId('687584b86a6f73587522da7e')
const blog2Id = new mongoose.Types.ObjectId('6875844d6a6f73587522da79')

//   passwordHash:
//     '$2b$10$E9icCKhoJFvEJQDXWmzpaOs0oNgbvbvtntBaA4/9aUkpHYA0udIca',
//   passwordHash:
//     '$2b$10$yy3qqo3iIyXCFhxAMNSK3.FNQMAbSk/.GotIlHahcfPsDUaJgk95.',

const initialUsers = [
  {
    _id: user1Id,
    username: 'root',
    name: 'superuser',
    passwordHash:
      '$2b$10$E9icCKhoJFvEJQDXWmzpaOs0oNgbvbvtntBaA4/9aUkpHYA0udIca',
    blogs: [blog1Id],
  },
  {
    _id: user2Id,
    username: 'user',
    name: 'normaluser',
    passwordHash:
      '$2b$10$yy3qqo3iIyXCFhxAMNSK3.FNQMAbSk/.GotIlHahcfPsDUaJgk95.',
    blogs: [blog2Id],
  },
]

const initialBlogs = [
  {
    _id: new mongoose.Types.ObjectId('687584b86a6f73587522da7e'),
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    user: user1Id,
  },
  {
    _id: new mongoose.Types.ObjectId('6875844d6a6f73587522da79'),
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    user: user2Id,
  },
]

const generateToken = () => {
  const userForToken = {
    username: 'normaluser',
    id: initialUsers[1]._id.toString(),
  }

  const token = jwt.sign(userForToken, process.env.SECRET, {
    expiresIn: 60 * 60,
  })

  return token
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'Hacking',
    author: 'Alejandro',
    url: 'https://hacking.com/',
    likes: 10,
  })
  await blog.save()
  await blog.deleteOne()
  return blog._id.toString
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((user) => user.toJSON())
}

module.exports = {
  blogsInDb,
  nonExistingId,
  usersInDb,
  generateToken,
  initialBlogs,
  initialUsers,
}
