'use strict'

const gulp = require('gulp')
const spawn = require('child_process').spawn
const livereload = require('gulp-livereload')
const mocha = require('gulp-mocha');
const browserify = require('gulp-browserify');

let server

gulp.task('test', () => {
  return gulp.src(['test/*/*'], {read: false})
    .pipe(mocha({reporter: 'nyan'})); // gulp-mocha needs filepaths so you can't have any plugins before it
});

gulp.task('scripts', function() {
  console.log('scripts')
  gulp.src(['public/javascripts/index.js'])
    .pipe(browserify({
    }))
    .pipe(gulp.dest('public/build/'))
});

gulp.task('server',function(){
  if(server){
    server.kill('SIGKILL');
    server=undefined;
  }
  server = spawn('node',['./bin/www']);
  server.stdout.setEncoding('utf8');
  server.stdout.on('data',function(data){
    console.log(data);
  });
  server.stderr.setEncoding('utf8');
  server.stderr.on('data',function(data){
    console.log(data);
  });
})
const reloadList = [
  'public/images/**/*',
  'public/stylesheets/**/*',
  'public/build/**/*',
  'views/**/*'
]
gulp.task('reload', function(){
  gulp.src(reloadList)
    .pipe(livereload());  
})

gulp.task('watch',['server', 'scripts'],function(){
  livereload.listen();
  gulp.watch(['js/*.js','app.js','routes/*'],['server']);

  gulp.watch(reloadList, ['reload']);

  gulp.watch([
    'public/images/**/*',
    'public/stylesheets/**/*',
    'public/javascripts/**/*',
    'views/**/*',
    'test/**/*'
  ], ['test']);

  gulp.watch([
    'public/javascripts/**/*'
  ],['scripts']);
})