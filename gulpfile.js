'use strict';

const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const mocha = require('gulp-mocha');
const exit = require('gulp-exit');
const browserify = require('browserify');
const watchify = require('watchify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const concat = require('gulp-concat');


// this not only starts the app but will also monitor for file changes and
// restart the app when changes are detected
gulp.task('nodemon', function() {
  nodemon({
    script: 'app.js',
    nodeArgs: ['--harmony']
  }).on('restart');
});

// run mocha test when changes detected in files
gulp.task('watch', function() {
  // gulp's built in watch function
  /*gulp.watch(
    ['**!/!*.{js,jsx}', '!node_modules/!**'], // blurbs of files to watch
    ['mocha'] // tasks to run when the above files change
  );*/

  gulp.watch(
    ['src/css/**/*.css'], ['css-bundle']
  )
});

gulp.task('css-bundle', function(){
  return gulp.src('src/css/**/*.css')
    .pipe(concat('main.css'))
    .pipe(gulp.dest('public/css/'));
});

// one-off browserify task which is handy when debugging
// node --harmony `which gulp` browserify
gulp.task('browserify', function() {
  const b = getBrowserifyInstance();
  b.transform(babelify);
  return bundleBrowserify(b);
});

// update bundle.js when changes detected in client-side js/jsx
gulp.task('watchify', function() {
  // create watchify instance wrapping our browserify instance
  // re-run compile whenever watchify emits an update event
  const b = getBrowserifyInstance();
  const w = watchify(b);

  w.transform(babelify);
  w.on('update', function(event) {
    console.log('update detected', event);
    bundleBrowserify(w);
  });
  bundleBrowserify(w);
});

const getBrowserifyInstance = function() {
  // create browserify instance
  const b = browserify('src/js/app.jsx', {
    debug: true,
    extensions: ['.jsx'],

    // watchify args
    cache: {},
    packageCache: {}
  });

  return b;
}

// receives a browserify instance and bundles it
const bundleBrowserify = function(b) {
  return b
    .bundle(function(err){
      if(err){
        console.log(err.message);
      }else{
        console.log('bundle done');
      }
    })
    .pipe(source('app.js'))
    .pipe(gulp.dest('public/js'));
};

// running gulp (or in our ES6 case, node --harmony `which gulp`) will run the
// task in this array
gulp.task('default', ['watchify', 'css-bundle', 'watch','nodemon']);