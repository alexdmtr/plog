var db = require('../db')



// add endpoint for POST on api/users
exports.postUsers = function (req, res) {
  let user = req.body

  db.utils.register({
    email: user.email,
    username: user.username,
    password: user.password
  }).then(() => {
    res.status(201).json({message: 'Register OK'});
  }).catch(err => {
    console.error(err);
    res.status(400);
  })
}
