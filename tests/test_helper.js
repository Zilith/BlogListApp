const Blog = require('../models/blogs')
const User = require('../models/users')

// const initialBlogs = [
//   {
//     title: 'React patterns',
//     author: 'Michael Chan',
//     url: 'https://reactpatterns.com/',
//     likes: 7,
//   },
//   {
//     title: 'Go To Statement Considered Harmful',
//     author: 'Edsger W. Dijkstra',
//     url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
//     likes: 5,
//   },
// ]

// const initialUsers = [
//   {
//     name: 'root',
//     username: 'superuser',
//     password: 'supercontraseña',
//   },
//   {
//     name: 'usuariopromedio',
//     username: 'normaluser',
//     passwordHash: 'normalcontraseña',
//   },
// ]

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
}
