'use strict'

const gulp = require('gulp')
const spawn = require('child_process').spawn
const livereload = require('gulp-livereload')
const istanbul = require('gulp-istanbul') // Code coverage
const mocha = require('gulp-mocha') // Unit testing
const browserify = require('gulp-browserify')

const globals = {}

function handleError (e) {
  console.log(e + e.stack)
  this.emit('end')
}

gulp.task('pre-test', () => {
  return gulp.src('public/javascripts/**/*')
    // Covering files
    .pipe(istanbul())
    // Force `require` to return covered files
    .pipe(istanbul.hookRequire())
})

gulp.task('test', () => {
  // gulp-mocha needs filepaths so you can't have any plugins before it
  return gulp.src(['test/*/*'], {read: false})
    .pipe(
      mocha({reporter: 'spec'}).on('error', handleError)
    )
})

gulp.task('coverage', ['pre-test'], () => {
  // gulp-mocha needs filepaths so you can't have any plugins before it
  return gulp.src(['test/*/*'], {read: false})
    .pipe(
      mocha({reporter: 'spec'}).on('error', handleError)
    )
    // Creating the reports after tests ran
    .pipe(
      istanbul.writeReports()
    )
    // Enforce a coverage of at least 90%
    .pipe(
      istanbul.enforceThresholds({ thresholds: { global: 10 } })
    )
})

gulp.task('scripts', function () {
  const b = browserify({}).on('error', handleError)
  gulp.src(['public/javascripts/index.js'])
    .pipe(b)
    .pipe(gulp.dest('public/build/'))
})

gulp.task('server', function () {
  if (globals.server) {
    globals.server.kill('SIGKILL')
    globals.server = undefined
  }
  globals.server = spawn('node', ['./bin/www'])
  globals.server.stdout.setEncoding('utf8')
  globals.server.stdout.on('data', function (data) {
    console.log(data)
  })
  globals.server.stderr.setEncoding('utf8')
  globals.server.stderr.on('data', function (data) {
    console.log(data)
  })
})

const reloadList = [
  'public/images/**/*',
  'public/stylesheets/**/*',
  'public/build/**/*',
  'views/**/*'
]

function reloadChange (file) {
  livereload.changed(file)
}

gulp.task('watch', ['server', 'scripts'], function () {
  livereload.listen()
  gulp.watch(['js/*.js', 'app.js', 'routes/*'], ['server'])

  gulp.watch(reloadList).on('change', reloadChange)

  gulp.watch([
    'public/images/**/*',
    'public/stylesheets/**/*',
    'public/javascripts/**/*',
    'views/**/*',
    'test/**/*'
  ], ['test'])

  gulp.watch([
    'public/javascripts/**/*'
  ], ['scripts'])
})
