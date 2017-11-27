
var admin = require("firebase-admin");
var bcrypt = require('bcrypt')
var serviceAccount = require("../secret/serviceAccountKey.json");
const saltRounds = 10;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://plog-5660f.firebaseio.com"
});

var db = admin.database();


class Utils {
  async getList(path) {
    var snapshot = await db.ref(path).once('value')
  
    var data = []
    snapshot.forEach(kid => {
      data.push({
        key: kid.key,
        ...kid.val()
      });
    })
  
    return data;
  }
  
  async getObj(path) {
    var snapshot = await db.ref(path).once('value')
    var obj = snapshot.val()
  
    obj.key = obj.key || snapshot.key
  
    return obj;
  }
  
  async getUser(username) {
    var users = await this.getList("/users")
  
    users = users.filter(user => user.username == username || user.email == username);
  
    if (users.length == 0) return false
  
    const user = users[0];
  
    return user
  }
  
  
  async login({ username, password }) {
  
    const user = await this.getUser(username);
  
    if (!user) return false;
  
    const passwordOK = await bcrypt.compare(password, user.password);
  
    if (passwordOK)
      return user;
    return false;
  }
  
  
  async hashPassword(user) {
    const hash = await bcrypt.hash(user.password, saltRounds)
    user.password = hash
  }
  
  async register({ email, username, password }) {
    if (await this.getUser(username))
      throw new Error("Username already used");
  
    let user = {email, username, password};
    await this.hashPassword(user);
    await db.ref("/users").push(user);
  
    return true;
  }
  
  async getPosts({searchQuery}) {
    var posts = await this.getList('/posts');
  
    return posts;
  }
  
  async getPostDetails({postId}) {
  
  }
}

db.utils = new Utils();

module.exports = db;

/*
var Sequelize = require('sequelize')
var Promise = require('bluebird')

var sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres',

    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },

    logging: false
})

var User = require('./user')(sequelize)
// var Group = require('./group')(sequelize)
var Post = require('./post')(sequelize)
var Photo = require('./photo')(sequelize)
// Group.belongsTo(User, {as: 'owner'})

// Group.belongsToMany(User, {through: 'user_group'})
// User.belongsToMany(Group, {through: 'user_group'})

Post.belongsTo(User)
Photo.belongsTo(Post)


User.hasMany(Post)
Post.hasMany(Photo)
// Post.belongsTo(Group, {as: 'group'})

sequelize.seed = require('./seed')({User, Post, Photo})

module.exports = sequelize
*/
