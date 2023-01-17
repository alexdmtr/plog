require('dotenv').config()
/* Add following environment variables in .env: */
let envVars = [
  "JWT_SECRET",
  "FIREBASE_PROJECT_ID",
  "FIREBASE_CLIENT_EMAIL",
  "FIREBASE_PRIVATE_KEY"
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
var jwtMiddleware = expressJwt.expressjwt({
  secret: process.env.JWT_SECRET,
  getToken: function (req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    }
    else if (req.cookies) {
      return req.cookies['access_token']
    }
    return null;
  },
  algorithms: ["HS256"]
})
var app = express()
app.use(cookieParser())

app.use(morgan('dev'))
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
var exphbs = require('express-handlebars');
app.engine('hbs', exphbs.engine({ defaultLayout: 'layout', extname: "hbs" }))
app.set('view engine', 'hbs')


var router = express.Router()
var auth = require('./routes/auth')
var posts = require('./routes/posts')
var users = require('./routes/users')

// Add endpoints for /api/auth
router.route('/auth')
  .post(auth.postAuth)

// Add endpoints for /api/users
router.route('/users')
  .post(users.postUsers)
router.route('/posts')
  .get(jwtMiddleware, posts.getPosts)

app.get('/', jwtMiddleware, function (req, res) {
  let searchQuery = req.query.query
  res.render('home', { user: req.user, searchQuery })
})


app.get('/login', (req, res) => {
  if (req.user)
    return res.redirect('/')
  res.render('login')
})

app.get('/signup', (req, res) => {
  if (req.user)
    return res.redirect('/')
  res.render('signup')
})

app.get('/logout', (req, res) => {
  res.cookie('access_token', null, { expires: new Date() })

  res.redirect('/login')
})

var db = require('./db');

app.get('/details/:id', async function (req, res) {
  var post = await db.utils.getPost({
    key: req.params.id
  })
  res.render('detail', { plog: post })
})


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
