var User = require('../models').models.user
var jwt = require('jsonwebtoken')
var bcrypt = require('bcrypt')

// add endpoint for POST on /api/auth
// should receive username and password
exports.postAuth = function (req, res) {

    this.user = {}
    User
        .findOne({
            where: {
                username: req.body.username
            }
        })
        .then(function (result) {
            this.user = result
            return bcrypt
                .compare(req.body.password, result.password)

        })
        .then(function (ok) {
            if (ok) {
                var token = jwt.sign({ username: this.user.username, id: this.user.id }, process.env.JWT_SECRET)
                // new Cookies(req, res).set('access_token', token, {
                //     httpOnly: true,
                //     secure: true      // for your production environment
                // });
                var d = new Date()
                d.setTime(d.getTime() + 7*24*60*60*1000); // 7 days
                res.cookie('access_token', token, { expires: d })
                console.log(token)
                res.status(200).json({
                    jwt: token, user: {
                        id: this.user.id,
                        username: this.user.username
                    }
                })
            }
            else
                res.status(401).json({ message: 'Authentication failed' })
        })
        .catch(function (err) {
            res.status(401).send(err)
        })

}
