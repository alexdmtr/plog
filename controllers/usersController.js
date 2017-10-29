var User = require('../models').models.user

// middleware for getting the user
exports.userParam = function (req, res, next, userId) {
  User
    .findById(userId)
    .then((result) => {
      req.user = result
      next()
    })
    .catch((err) => {
      res.status(404)
      next(err)
    })
}

/**
 * GET on /api/users that returns [] of users.
 * Optional search terms (query):
 * - username
 */
exports.getUsers = function (req, res) {
  let username = req.query.username || "";

  User
    .findAll({
      attributes: [
        'id', 'username', 'avatarUrl'
      ],
      where: {
        username: {
          $iLike: `%${username}%`
        }
      }
    })
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      console.error(err);
      res.status(400).send(err);
    })
}
// add endpoint for POST on api/users
exports.postUsers = function (req, res) {
  // res.status(501).send()

  let user = req.body

  User
    .create(user)
    .then((result) => {
      res.status(201).json(result)
    })
    .catch((err) => {
      console.error(err)
      res.status(400).send(err)
    })
}

// add endpoint for PUT on api/users/{userId}
exports.putUser = function (req, res) {
  let userId = req.params.userId

  if (userId != req.user.id) return res.status(401).send()

  let user = req.body
  User
    .update(user, {
      where: {
        id: userId
      },
      returning: true
    })
    .then(function (result) {
      res.status(200).json(result[1][0])
    })
    .catch(function (err) {
      throw err

      res.send(err)
    })
}

// add endpoint for DELETE on api/users/{userId}
exports.deleteUser = function (req, res) {
  let userId = req.params.userId

  if (userId != req.user.id) return res.status(401).send()

  User
    .destroy({
      where: {
        id: userId
      }
    })
    .then(function (result) {
      res.status(200).json({
        message: 'User deleted succesfuly'
      })
    })
    .catch(function (err) {
      throw err

      res.end(err)
    })
}

// add endpoint for GET on api/users/{userId}
exports.getUser = function (req, res) {
  let userId = req.params.userId

  if (userId != req.user.id) return res.status(401).send()

  User
    .findById(userId)
    .then((result) => {
      res.status(200).json({
        age: result.age,
        agency: result.agency,
        avatarUrl: result.avatarUrl,
        currentProject: result.currentProject,
        description: result.description,
        email: result.email,
        id: result.id,
        username: result.username
      })
    })
    .catch((err) => {
      res.status(404).send(err)
    })
}