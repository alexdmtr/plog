var db = require('../db');
var jwt = require('jsonwebtoken')

// add endpoint for POST on /api/auth
// should receive username and password
exports.postAuth = async function (req, res) {

  let user = req.body;
  db.utils.login({
    username: user.username,
    password: user.password
  }).then(user => {
    var token = jwt.sign({ username: user.username, id: user.id }, process.env.JWT_SECRET)
    var d = new Date();
    d.setTime(d.getTime() + 7*24*60*60*1000); // 7 days
    res.cookie('access_token', token, { expires: d })
    res.status(200).json({
        jwt: token,
        user: {
            id: user.id,
            username: user.username
        }
    })
  }).catch(err => {
    res.status(401).json({ message: 'Authentication failed' })
    console.error(err);
  })
    // User
    //     .findOne({
    //         where: {
    //             $or: [{username: req.body.username}, {email: req.body.username}],
    //         },
    //
    //     })
    //     .then(function (result) {
    //         this.user = result
    //         // console.log(result)
    //         return bcrypt
    //             .compare(req.body.password, result.password)
    //
    //     })
    //     .then(function (ok) {
    //         if (ok) {
    //             var token = jwt.sign({ username: this.user.username, id: this.user.id }, process.env.JWT_SECRET)
    //             var d = new Date()
    //             d.setTime(d.getTime() + 7*24*60*60*1000); // 7 days
    //             res.cookie('access_token', token, { expires: d })
    //             console.log(token)
    //             res.status(200).json({
    //                 jwt: token, user: {
    //                     id: this.user.id,
    //                     username: this.user.username
    //                 }
    //             })
    //         }
    //         else
    //             res.status(401).json({ message: 'Authentication failed' })
    //     })
    //     .catch(function (err) {
    //         res.status(401).send(err)
    //         console.log(err)
    //     })

}
