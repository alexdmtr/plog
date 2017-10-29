var request = require('supertest')
var app = require('../app')
var assert = require('assert')
var Promise = require('bluebird')


context('posts CRUD', function() {
  let token = null 
  let post = {
    message: 'Hello there!',
    groupId: 2
  }

  it('should authenticate as root', function(done) {
		request(app)
			.post('/api/auth')
			.send({username: process.env.ROOT_USERNAME, password: process.env.ROOT_PASSWORD})
			.expect(200)
			.end(function(err, res) {
				if (err) return done(err)

				token = res.body.jwt
				done()
			})
	})

  it('should create a post', function(done) {
    request(app)
      .post(`/api/group/${post.groupId}/post`)
      .set('Authorization', 'Bearer ' + token)
      .send(post)
      .expect(201)
      .end(function(err, res) {
        if (err) return done(err)
        
        let newPost = res.body

        assert.equal(post.message, newPost.message)
        assert.equal(post.groupId, newPost.groupId)
        assert.equal(1, newPost.ownerId)

        post = newPost
        done()
      })
  })

  post.message = "New message"
  it('should update a post', function(done) {
    request(app)
      .put(`/api/group/${post.groupId}/post/${post.id}`)
      .set('Authorization', 'Bearer ' + token)
      .send(post)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err)

        let newPost = res.body
        assert.equal(post.message, newPost.message)
        assert.equal(post.groupId, newPost.groupId)
        assert.equal(1, newPost.ownerId)

        post = newPost
        done()
      })
  })

  it('should delete the post', function(done) {
    request(app)
      .delete(`/api/group/${post.groupId}/post/${post.id}`)
      .set('Authorization', 'Bearer ' + token)
      .expect(200, done)
  })
})