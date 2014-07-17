var gulp = require('gulp'),
  release = require('github-release'),
  pkg = require('./package.json'),
  browserify = require('browserify'),
  source = require('vinyl-source-stream'),
  rename = require('gulp-rename'),
  ecstatic = require('ecstatic'),
  http = require('http'),
  exec = require('child_process').exec,
  coffee = require('gulp-coffee');


function create(fn){
  browserify({entries: ['./bin/mongodb-infer-browser.js']})
    .bundle({})
    .pipe(source('./bin/mongodb-infer-browser.js'))
    .pipe(rename('mongodb-infer.js'))
    .pipe(gulp.dest('./dist/'))
    .on('end', fn);
}

gulp.task('serve', function(){
  create(function(){
    gulp.src('./dist/mongodb-infer.js')
      .pipe(gulp.dest('./examples/'));

    http.createServer(
      ecstatic({root: __dirname + '/'})
    ).listen(8080);
    exec('open http://localhost:8080/examples', function(){});
  });
});

gulp.task('dist', function(){
  create(function(){
    gulp.src('./dist/*').pipe(release(pkg));
  });
});

gulp.task('coffee', function() {
  gulp.src('./src/*.coffee')
    .pipe(coffee({bare: true}).on('error', gutil.log))
    .pipe(gulp.dest('./lib/'));
});
