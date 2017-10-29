var request = require('supertest')
var app = require('../app')
var assert = require('assert')
var Promise = require('bluebird')

context('groups CRUD', function() {
  let token = null 

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



  let group =
  {
    name: 'fun group',
    description: 'much fun',
    avatarUrl: 'basic.png'
  }
  it('should create a group', function(done) {
    request(app)
      .post('/api/groups')
      .set('Authorization', 'Bearer ' + token)
      .send(group)
      .expect(201)
      .end(function(err, res) {
        if (err) return done(err)

        let newGroup = res.body

        assert.equal(group.name, newGroup.name)
        assert.equal(group.description, newGroup.description)
        assert.equal(group.avatarUrl, newGroup.avatarUrl)
        assert.equal(newGroup.ownerId, 1)

        group = newGroup
        done()
      })
  })

  it('should update the group', function(done) {
    group.name = 'funnier group'
    group.description = 'much more fun'
    group.avatarUrl = 'awesome.png'

    request(app)
      .put(`/api/group/${group.id}`)
      .set('Authorization', 'Bearer ' + token)
      .send(group)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err)

        let newGroup = res.body

        assert.equal(group.name, newGroup.name)
        assert.equal(group.description, newGroup.description)
        assert.equal(group.avatarUrl, newGroup.avatarUrl)
        assert.equal(newGroup.ownerId, 1)
        console.log(newGroup);

        group = newGroup
        done()
      })
  })

  it('should read the same group + posts', function(done) {
  request(app)
    .get(`/api/group/${group.id}`)
    .set('Authorization', 'Bearer ' + token)
    .expect(200)
    .end(function(err, res) {
      if (err) return done(err)

      let newGroup = res.body

      assert.equal(group.name, newGroup.name)
      assert.equal(group.description, newGroup.description)
      assert.equal(group.avatarUrl, newGroup.avatarUrl)
        // assert.equal(newGroup.ownerId, 1)
      
      // console.log(newGroup)
      assert.equal(newGroup.posts.length, 0)

      done()
    })
  })

  it('should get [newGroup] of groups', (done) => {
    request(app)
      .get(`/api/groups/`)
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)

        let groups = res.body

        let foundGroup = groups.find(g => g.id === group.id)
        
        Object.keys(group).forEach(key => {
          if (key != 'ownerId')
            assert.equal(group[key], foundGroup[key])})

        done()
      })
  })

  it('should put user root in the group', function(done) {
    request(app)
      .put(`/api/group/${group.id}/add/1`)
      .set('Authorization', 'Bearer ' + token)
      .expect(201, done)
  })


  it('should get group members and find member root', function(done) {
    request(app)
      .get(`/api/group/${group.id}/members`)
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err)
        var members = res.body

        assert.equal(members.length, 1)

        assert.equal(members[0].id, 1)

        done()
      })
  })

  
  it('should read 1 groups for root', function(done) {
    request(app)
      .get('/api/groups/1')
      .set('Authorization', 'Bearer ' + token)      
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err)

        var groups = res.body

        assert.equal(typeof(groups), 'object')
        assert.equal(groups.length, 1)
        
        groups.forEach(function(group) {
          assert.ok(group.id, 'Missing ID')
          assert.ok(group.name, 'Mssing Name')
          assert.ok(group.description, 'Missing description')
        })

        done()
      })

  })

  it('should remove root from group', function(done) {
    request(app)
      .delete(`/api/group/${group.id}/remove/1`)
      .set('Authorization', 'Bearer ' + token)
      .expect(200, done)
  })

  it('should delete the group', function(done) {
    request(app)
      .delete(`/api/group/${group.id}`)
      .set('Authorization', 'Bearer ' + token)
      .expect(200, done)
  })

})