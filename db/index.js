
var admin = require("firebase-admin");
var bcrypt = require('bcrypt')
// var serviceAccount = require("../secret/serviceAccountKey.json");
const saltRounds = 10;

admin.initializeApp({
    credential: admin.credential.cert({
        "projectId": process.env.FIREBASE_PROJECT_ID,
        "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        "clientEmail": process.env.FIREBASE_CLIENT_EMAIL,
      }),
  databaseURL: "https://plog-5660f.firebaseio.com"
});

var db = admin.database();

var Utils = require('./utils');
db['utils'] = new Utils(db);

module.exports = db;

