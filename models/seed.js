var data = require('./seed.data');
var assert = require('assert');
var Promise = require('bluebird');
var _ = require('lodash');
var assert = require('assert')

module.exports = function ({ User, Post, Photo }) {
  return async function () {
    let root = await User.create({
      username: process.env.ROOT_USERNAME,
      password: process.env.ROOT_PASSWORD,
      email: 'root@root.com'
    })
    let users = await Promise.map(data.users, (user) => {
      return User.create({
        username: user.username,
        password: user.password,
        email: user.email,
      })
    });

    let posts = await Promise.map(data.posts, post => {
      let userId = users.find(u => u.username == post.user).id
      assert(userId + userId == 2 * userId, "UserID is not a number")

      return Post.create({
        title: post.title,
        message: post.message,
        location: post.location,
        userId
      })
    })

    let photos = await Promise.map(data.photos, photo => {

      return Photo.create({
        title: photo.title,
        url: photo.url,
        postId: photo.postID
      })
    })


  }
}