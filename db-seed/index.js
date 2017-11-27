var data = require('./seed.data');
var assert = require('assert');
var Promise = require('bluebird');
var _ = require('lodash');
var assert = require('assert')
var db = require('../db');

module.exports = async () => {
  await db.ref('/users').set('null');

  await Promise.map(data.users, async (user, index) => {
    return db.utils.register({
      username: user.username,
      password: user.password,
      email: user.email
    })
  });

  let users = await db.utils.getList('/users');

  await db.ref('/posts').set(null);
  let posts = await Promise.map(data.posts, async (post, index) => {
    let user = users.find(u => u.username == post.user)
    user = user || users[0];

    let photos = data.photos.filter(photo => photo.postID == index+1);

    return db.ref('/posts').push({
      user: {
        key: user.key,
        username: user.username
      },
      title: post.title,
      message: post.message,
      location: post.location,
      photos: photos
    })
  })
  
  
}
