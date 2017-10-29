const models = require('../models').models
const Sequelize = require('sequelize')
var Post = models.post
var User = models.user
var Group = models.group
var Photo = models.photo
const Op = Sequelize.Op

// function getPostPhotos(postId) {
//   return Photo.findAll({
//     where: { postId: postId }
//   })
// }

async function dataGetPosts(query) {
  return Post.findAll({
    include: [User, Photo]
  })
  .then(posts => {
    if (!query) query = ""
    else {
      query = query.toUpperCase()
      posts = posts.filter(post => {
          let ok = [post.title, post.location, post.user.username]

          ok = ok.map(x => x.toUpperCase())

          return ok.some(x => x.includes(query))
      })
    }
    return Promise.resolve(posts)
  

  })
}
exports.dataGetPosts = dataGetPosts;
exports.getPosts = async function (req, res) {
  let query = req.query.query
  posts = await dataGetPosts(query)

  res.json(posts)
}
/*
  Method POST on route ‘api/group/{groupId}/post’ - creates a new post and receives all the fields except groupId, because we have the groupId in the route.
*/
exports.postPost = function (req, res) {
  var groupId = req.params.groupId

  let post = req.body
  post.ownerId = req.user.id
  post.createdAt = new Date();

  Post
    .create(post)
    .then(function (post) {
      res.status(201).json(post)
    })
    .catch(function (err) {
      console.error(err)
      res.status(400).send('Bad request')
    })
}

/*
  Method PUT on route ‘api/group/{groupId}/post/{postId}’ - updates a post message.
*/
exports.putPost = function (req, res) {
  var groupId = req.params.groupId
  var postId = req.params.postId
  req.body.updatedAt = new Date();

  Post
    .findById(postId)
    .then(function (post) {
      return post.update(req.body)
    })
    .then(function (post) {
      res.status(200).json(post)
    })
    .catch(function (err) {
      console.error(err)
      res.status(400).send('Bad request')
    })
}

/*
  Method DELETE on route ‘api/group/{groupId}/post/{postId}’ - deletes a certain post.
*/

exports.deletePost = function (req, res) {
  var groupId = req.params.groupId;
  var postId = req.params.postId;

  Post
    .findById(postId)
    .then(function (post) {
      return post.destroy();
    })
    .then(function () {
      res.status(200).send('OK')
    })
    .catch(function (err) {
      console.error(err)
      res.status(400).send('Bad request')
    })
}