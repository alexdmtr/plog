require('dotenv').config()
/* Add following environment variables in .env: */
let envVars = [
    "DB_HOST",
    "DB_NAME",
    "DB_USERNAME",
    "DB_PASSWORD",
    "JWT_SECRET",
    "ROOT_USERNAME",
    "ROOT_PASSWORD",
]

var assert = require('assert')

envVars.forEach((value) => assert.ok(process.env[value], `${value} not set`))

var express = require('express')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var expressJwt = require('express-jwt')
var morgan = require('morgan')
var winston = require('winston')
var jwt = require('jsonwebtoken')
var jwtMiddleware = expressJwt({
    secret: process.env.JWT_SECRET,
    getToken: function (req) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            return req.headers.authorization.split(' ')[1];
        }
        else if (req.cookies) {
            return req.cookies['access_token']
        }
        return null;
      }
})
// jwtMiddleware = (req, res, next) => { next() }
var app = express()
app.use(cookieParser())

app.use(morgan('dev'))
// simulate latency
// app.use((req, res, next) => {
//     setTimeout(next, 1000);
// });
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())

// allow CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept")
    next()
})


app.use(express.static('public'))
var exphbs  = require('express-handlebars');
app.engine('hbs', exphbs({defaultLayout:'layout', extname:"hbs"}))
app.set('view engine', 'hbs')


var router = express.Router()
var authController = require('./controllers/authController')
var groupsController = require('./controllers/groupsController')
var postsController = require('./controllers/postsController')
var usersController = require('./controllers/usersController')

// Add endpoints for /api/auth
router.route('/auth')
    .post(authController.postAuth)


// // Add endpoints for /api/groups/{userId}
// router.route('/groups/:userId')
//     .get(jwtMiddleware, groupsController.getUserGroups)

// // Add endpoints for /api/groups
// router.route('/groups')
//     .get(jwtMiddleware, groupsController.getGroups)
//     .post(jwtMiddleware, groupsController.postGroups)

// // Add endpoints for /api/group/{groupId}
// router.route('/group/:groupId')
//     .put(jwtMiddleware, groupsController.putGroup)
//     .get(jwtMiddleware, groupsController.getGroup)
//     .delete(jwtMiddleware, groupsController.deleteGroup)

// // Add endpoints for /api/group/{groupId}/members
// router.route('/group/:groupId/members')
//     .get(jwtMiddleware, groupsController.getGroupMembers)

// // Add endpoint for /api/group/:groupId/add/:userId
// router.route('/group/:groupId/add/:userId')
//     .put(jwtMiddleware, groupsController.putGroupMember)

// // Add endpoint for /api/group/:groupId/add/:userId
// router.route('/group/:groupId/remove/:userId')
//     .delete(jwtMiddleware, groupsController.deleteGroupMember)

// router.route('/group/:groupId/post')
//     .post(jwtMiddleware, postsController.postPost)

// router.route('/group/:groupId/post/:postId')
//     .put(jwtMiddleware, postsController.putPost)
//     .delete(jwtMiddleware, postsController.deletePost)

// Add endpoints for /api/users
router.route('/users')
    .get(jwtMiddleware, usersController.getUsers)
    .post(usersController.postUsers)

// Add endpoints for /api/users/{userId}
router.route('/users/:userId')
    .put(jwtMiddleware, usersController.putUser)
    .delete(jwtMiddleware, usersController.deleteUser)
    .get(jwtMiddleware, usersController.getUser)

router.route('/posts')
    .get(jwtMiddleware, postsController.getPosts)

app.get('/', jwtMiddleware, function (req, res) {
    let searchQuery = req.query.query
    res.render('home', { user: req.user, searchQuery })
})


app.get('/login', (req, res) => {
    if (req.user)
        return res.redirect('/')
    console.log(req.cookies)
    console.log(req.signedCookies)
    console.log("HEYYY!")
    res.render('login')
})

app.get('/signup', (req, res) => {
    if (req.user)
        return res.redirect('/')
    res.render('signup')
})

var models = require('./models').models

app.get('/details/:id', async function(req, res) {
    let id = req.params.id
    console.log(id)

    var Post = models.post;
    var Photo = models.photo
    var User = models.user

    var post = await Post.findById(id, {
        include: [ User, Photo ]
    })

    console.log(post)
    res.render('detail', { plog:post})
})



// app.get('/api', (req, res) => {
//     res.status(200).json({
//         '/auth': 'Authentication',
//         '/group': 'Group info & posts',
//         '/groups': 'Groups',
//         '/users': 'Users'
//     })
// })
app.use('/api', router)


app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
    //   res.status(401).send('invalid token...')
    console.log("error!")
     res.redirect('/login');
    } else
    next(err)
  });

module.exports = app