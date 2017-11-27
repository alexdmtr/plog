var bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = class Utils {
  constructor(db) {
    this.db = db;
  }
  async getList(path) {
    var snapshot = await this.db.ref(path).once('value')

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
    var snapshot = await this.db.ref(path).once('value')
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

    if (!user) throw new Error("No such user");

    const passwordOK = await bcrypt.compare(password, user.password);

    if (passwordOK)
      return user;
    throw new Error("Password wrong");
  }


  async hashPassword(user) {
    const hash = await bcrypt.hash(user.password, saltRounds)
    user.password = hash
  }

  async register({ email, username, password }) {
    if (await this.getUser(username))
      throw new Error("Username already used");

    let user = { email, username, password };
    await this.hashPassword(user);
    await this.db.ref("/users").push(user);

    return true;
  }

  async getPosts({ searchQuery }) {
    var posts = await this.getList('/posts');

    return posts;
  }

  async getPostDetails({ postId }) {

  }
}