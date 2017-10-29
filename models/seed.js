 var data = require('./seed.data');
 var assert = require('assert');
 var Promise = require('bluebird');
 var _ = require('lodash');

 module.exports = function ({User, Post}) {

   function createRoot() {
     return User
       .create({
         username: process.env.ROOT_USERNAME,
         password: process.env.ROOT_PASSWORD,
         email: 'root@root.com'
       })
   }

   function seedUsers() {
     // console.log("=> seed users");
     let tasks = Promise.map(data.users, (user) => {
       return User.create({
         username: user.username,
         password: user.password,
         email: user.email,
         description: user.description,
         avatarUrl: user.avatarUrl,
         age: user.age,
         currentProject: user.currentProject,
         agency: user.agency
       })
     });

     return tasks;
     // return User.bulkCreate([
     //   { username: 'john.donald', password: 'shh', email: 'user2@user.com'},
     //   { username: 'galen.erso', password: 'shh', email: 'user3@user.com'},
     //   { username: 'orson.krennic', password: 'shh', email: 'user4@user.com'},
     //   { username: 'darth.vader', password: 'shh', email: 'user5@user.com'},
     //   { username: 'jyn.erso', password: 'shh', email: 'user6@user.com'},
     //   { username: 'bail.organa', password: 'shh', email: 'user7@user.com'},
     //   ]).then(function() { return User.findAll()})

   }

   function seedGroups(users) {
     // console.log("=> seed groups");
     let tasks = Promise.mapSeries(data.groups, group => {
       let owner = _.find(users, u => u.username === group.owner);

       assert.ok(owner, `Group ${group.name} owner not found`);

       return Group.create({
         name: group.name,
         ownerId: owner.id,
         description: group.description,
         avatarUrl: group.avatarUrl
       }).then(dbGroup => {

         // console.log(`${group.name} added`);
         var addMembers = group.members.map(username => {
           let member = _.find(users, u => u.username == username);
           // console.log(`add ${username} to ${group.name}`);
           return dbGroup.addUser(member);
         })

         var addPosts;

         if (group.posts)
           addPosts = group.posts.map(post => {
             let user = _.find(users, u => u.username === post.user);
             console.log(`${user.id} => ${post.message}`);
             // console.log(`add ${post.message}`)
             return Post.create({
               message: post.message,
               ownerId: user.id,
               groupId: dbGroup.id
             });
           });
         else
           addPosts = [Promise.resolve()];

         return Promise.all(addMembers)
           .then(() => {
             return Promise.all(addPosts);
           })
           .then(() => {
             return Promise.resolve(dbGroup);
           });
       });
     })

     return tasks;
     // Group.bulkCreate([
     //   { name: 'Explorers', description: 'Hiking and outdoor activities', avatarUrl: 'http://s.hswstatic.com/gif/how-to-hike-1.jpg', ownerId: users[1].id},
     //   { name: 'Bikers', description: 'Bike enthusiast? Join in', avatarUrl: 'http://ec2-54-169-79-17.ap-southeast-1.compute.amazonaws.com/images/experiences/photo/947_1455027009.jpg', ownerId: users[2].id},
     //   { name: 'Metal fans', description: 'Newcomers welcome!', avatarUrl: 'http://www.deathmetal.org/wp-content/uploads/heavy_metal_concert-600x375.jpg', ownerId: users[3].id},
     //   { name: 'Star Wars fans', description: 'Patiently awaiting The Last Jedi!', 
     //   avatarUrl: 'https://blogs-images.forbes.com/brandonkatz/files/2016/10/Star-Wars-1200x675.jpg?width=960', ownerId: users[4].id},
     // ]).then(function() {
     //   return Group.findAll()
     // }).then(function(groups) {
     //   this.groups = groups
     //   var groupTask = groups.map(function(group) {
     //     return new Promise(function(resolve, reject) {
     //       group.addUser(users[1]).then(resolve).catch(reject)
     //     })
     //   })
     //   return Promise.all(groupTask)
     // })
   }

   //  function seedPosts() {
   //     // Post.bulkCreate([
   //     //   { message: 'Hello World!', ownerId: 2, groupId: 1},
   //     //   { message: 'Oh Danny boy', ownerId: 2, groupId: 2},
   //     //   { message: 'The pipes, the pipes', ownerId: 2, groupId: 2},
   //     //   { message: 'Are calling', ownerId: 2, groupId: 1},
   //     //   { message: 'The quick brown fox', ownerId: 2, groupId: 3},
   //     //   { message: 'jumps over the lazy dog.', ownerId: 2, groupId: 3},
   //     // ])
   //  }

   return function () {
     this.users = [];
     this.groups = [];
     this.posts = [];
     return createRoot()
       .then(() => seedUsers())
       .then(users => {
         this.users = users;
        //  return seedGroups(users);
       })
   }
 }