require('babel/register')

var gulp = require('gulp')
var sourcemaps = require('gulp-sourcemaps')
var babel = require('gulp-babel')
// var concat = require('gulp-concat')
// var debug = require('gulp-debug')
var standard = require('gulp-standard')
var mocha = require('gulp-mocha')
// var stripDebug = require('gulp-strip-debug');

gulp.task('standard linter', function () {
  return gulp.src(['./**/*.js', '!lib/es5/**', '!node_modules/**'])
    .pipe(standard())
    .pipe(standard.reporter('default', {
      breakOnError: true
    }))
})

gulp.task('build with babel', function () {
  return gulp.src('src/**/*.js')
    .pipe(sourcemaps.init())
    // .pipe(debug({title: 'babel es6 to es5:'}))
    // .pipe(stripDebug())
    .pipe(babel())
    // .pipe(concat('khayyam.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('lib/es5'))
})

gulp.task('test with mocha', ['build with babel'], function () {
  return gulp.src('test/tests.js', {read: false})
    .pipe(mocha({reporter: 'spec'}))
})

gulp.task('test', ['test with mocha', 'standard linter'])

gulp.task('default', ['standard linter', 'build with babel'])
