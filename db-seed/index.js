var data = require('./seed.data');
var assert = require('assert');
var Promise = require('bluebird');
var _ = require('lodash');
var assert = require('assert')
var db = require('../db');

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