'use strict'

const gulp = require('gulp')
const spawn = require('child_process').spawn
const livereload = require('gulp-livereload')

let server

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
gulp.task('reload',function(){
     gulp.src(['public/*/*','views/*'])
             .pipe(livereload());  
})

gulp.task('watch',['server'],function(){
        livereload.listen();
        gulp.watch(['js/*.js','app.js','routes/*'],['server']);
        gulp.watch(['public/*/*','views/*'],['reload']);
})