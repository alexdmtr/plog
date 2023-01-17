var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    mocha = require('gulp-mocha')
var app = require('./app')

gulp.task('seed', function () {
    var seed = require('./db-seed')

    return seed();
})


gulp.task('test', gulp.series('seed', function () {
    return gulp.src('./test/**')
        .pipe(mocha({
            bail: true
        }))

}))

gulp.task('default', function () {
    nodemon({
        script: 'server.js',
        ext: 'js',
        ignore: ['./node_modules/**'],
        // tasks: ['test'],
        quiet: true
    })
})
