var gulp          = require('gulp');
var notify        = require('gulp-notify');
var source        = require('vinyl-source-stream');
var browserify    = require('browserify');
var babelify      = require('babelify');
var ngAnnotate    = require('browserify-ngannotate');
var browserSync   = require('browser-sync').create();
var rename        = require('gulp-rename');
var templateCache = require('gulp-angular-templatecache');
var uglify        = require('gulp-uglify');
var merge         = require('merge-stream');

let cleanCSS = require('gulp-clean-css');

// Where our files are located
// var cssFiles   = "src/style/**/*.css";
var jsFiles   = "src/client/js/**/*.js";
var viewFiles = "src/client/js/**/*.html";

var interceptErrors = function(error) {
  var args = Array.prototype.slice.call(arguments);

  // Send error to notification center with gulp-notify
  notify.onError({
    title: 'Compile Error',
    message: '<%= error.message %>'
  }).apply(this, args);

  // Keep gulp from hanging on this task
  this.emit('end');
};


gulp.task('browserify', ['views'], function() {
  return browserify('./src/client/js/app.js')
      .transform(babelify, {presets: ["es2015"]})
      .transform(ngAnnotate)
      .bundle()
      .on('error', interceptErrors)
      //Pass desired output filename to vinyl-source-stream
      .pipe(source('main.js'))
      // Start piping stream to tasks!
      .pipe(gulp.dest('./src/client/'));
});
/* 
gulp.task('html', function() {
  return gulp.src("src/index.html")
      .on('error', interceptErrors)
      .pipe(gulp.dest('./src/build/'));
}); */

gulp.task('views', function() {
  return gulp.src(viewFiles)
      .pipe(templateCache({
        standalone: true
      }))
      .on('error', interceptErrors)
      .pipe(rename("app.templates.js"))
      .pipe(gulp.dest('./src/client/js/config/'));
});

// This task is used for building production ready
// minified JS/CSS files into the dist/ folder
// gulp.task('build', ['html', 'browserify'], function() {
  gulp.task('build', ['browserify'], function() {
/*   var html = gulp.src("build/index.html")
                 .pipe(gulp.dest('./dist/')); */

  var js = gulp.src("src/client/build/main.js")
               .pipe(uglify())
               .pipe(gulp.dest('./src/client/dist/'));

  // return merge(html,js);
  return merge(js);
});



// gulp.task('minify-css', () => {
//   return gulp.src('src/style/**/*.css')
//     .pipe(cleanCSS({compatibility: 'ie8'}))
//     .pipe(gulp.dest('./src/build/'));
// });



// gulp.task('default', ['html', 'minify-css','browserify'], function() {

gulp.task('default', ['browserify'], function() {

  browserSync.init(['./src/client/**/**.**'], {
    server: "./src/client/",
    port: 4000,
    notify: false,
    ui: {
      port: 4001
    }
  });

 /*  gulp.watch("src/index.html", ['html']);
  gulp.watch(cssFiles, ['minify-css']);*/
  gulp.watch(viewFiles, ['views']);
  gulp.watch(jsFiles, ['browserify']);
});
