const _ = require('lodash')

const dummy = (_blogs) => {
  return 1
}

/**
 * Calculates the total number of likes from a list of blog posts.
 *
 * @param {Array<Object>} blogs - An array of blog objects.
 * @param {number} blogs[].likes - The number of likes for a single blog post.
 * @returns {number} The total number of likes across all blog posts.
 */
const totalLikes = (blogs) => {
  const totalLikes = blogs.reduce((sum, blog) => sum + blog.likes, 0)
  return totalLikes
}

// const favoriteBlog = (blogs) => {
//   let favBlog = 0
//   let mostLikes = 0
//   for (let i = 0; i < blogs.length; i++) {
//     console.log('i', i)
//     console.log(mostLikes, '<', blogs[i].likes, mostLikes < blogs[i].likes)
//     if (mostLikes < blogs[i].likes) {
//       mostLikes = blogs[i].likes
//       favBlog = i
//       console.log('new value of favBlog', favBlog)
//     }
//   }
//   return blogs[favBlog]
// }

/**
 * Determines the blog with the highest number of likes from a list of blogs.
 *
 * @param {Array<Object>} blogs - An array of blog objects. Each blog object should have a `likes` property.
 * @param {number} blogs[].likes - The number of likes for a single blog post.
 * @returns {Object} The blog object with the highest number of likes. If the array is empty, the behavior is undefined.
 */
const favoriteBlog = (blogs) => {
  const favBlog = blogs.reduce(
    (fav, blog) => (fav.likes < blog.likes ? (fav = blog) : fav),
    blogs[0]
  )
  return favBlog
}

/**
 * Determines the author with the most blog posts from a list of blogs.
 *
 * @param {Array<Object>} blogs - An array of blog objects, where each object contains an `author` property.
 * @returns {Object} An object representing the author with the most blogs,
 *                   containing the `author` name and the number of `blogs` they have written.
 *                   If the input array is empty, returns an object with `author` set to `null` and `blogs` set to `0`.
 *
 * @example
 * const blogs = [
 *   { author: 'Alice', title: 'Post 1' },
 *   { author: 'Bob', title: 'Post 2' },
 *   { author: 'Alice', title: 'Post 3' }
 * ];
 *
 * const result = mostBlogs(blogs);
 * console.log(result); // { author: 'Alice', blogs: 2 }
 */
const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return { author: null, blogs: 0 }
  }
  const byAuthor = _.countBy(blogs, 'author')
  const blogsByAuthor = _.map(byAuthor, (count, author) => {
    return { author, blogs: count }
  })
  const mostBlogsByAuthor = _.maxBy(blogsByAuthor, 'blogs')
  return mostBlogsByAuthor
}

/**
 * Determines the author with the most likes from a list of blog posts.
 *
 * @param {Array<Object>} blogs - An array of blog objects, where each object contains
 *                                at least an `author` (string) and `likes` (number) property.
 * @returns {Object} An object containing the `author` with the most likes and the total number of `likes`.
 *                   If the input array is empty, returns an object with `author` set to `null` and `likes` set to `0`.
 */
const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return { author: null, likes: 0 }
  }
  const byAuthor = _.groupBy(blogs, 'author')
  const blogsByAuthor = _.map(byAuthor, (blogs, author) => {
    const sum = _.sumBy(blogs, 'likes')
    return { author, likes: sum }
  })
  const mostBlogsByAuthor = _.maxBy(blogsByAuthor, 'likes')
  return mostBlogsByAuthor
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
