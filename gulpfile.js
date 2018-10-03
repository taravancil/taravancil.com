var gulp = require('gulp')
var sass = require('gulp-sass')
var autoprefixer = require('gulp-autoprefixer')
var rename = require('gulp-rename')
var cssmin = require('gulp-clean-css')
var minifyHtml = require('gulp-htmlmin')
var notification = require('gulp-notify')
var exec = require('child_process').exec
var plumber = require('gulp-plumber')
var uglify = require('gulp-uglify')
var pump = require('pump')

gulp.task('build-scss', function () {
  var onError = function (err) {
    notification.onError({
        title: 'gulp: build-scss',
        message: '<%= error.message %>',
    })(err)
    this.emit('end')
  }

  return gulp.src('src/scss/style.scss')
    .pipe(plumber({errorHandler: onError}))
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(cssmin())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('static/css/'))
})

gulp.task('minify-html', function () {
  return gulp.src('public/**/*.html')
    .pipe(minifyHtml({collapseWhitespace: true}))
    .pipe(gulp.dest('public'))
})

gulp.task('build-js', function () {
  pump([
    gulp.src('src/js/*'),
    uglify(),
    gulp.dest('static/js')
  ])
})

gulp.task('hugo-server', function () {
  exec('hugo server', function(data, err) {
    console.log(data)
    console.log(err)
  })
})

gulp.task('hugo-build', function () {
  exec('hugo', function(data, err) {
    if (err) {
      exec('hugo')
    }
    console.log(data)
  })
})

gulp.task('watch', function () {
  gulp.watch('src/scss/**/*.scss', ['build-scss', 'hugo-build'])
  gulp.watch('src/js/*', ['build-js', 'hugo-build'])
  gulp.watch('layouts/**/*.html', ['hugo-build'])
  gulp.watch('content/**/*', ['hugo-build'])
  gulp.watch('data/**/*.yml', ['hugo-build'])
})

gulp.task('default', ['build-scss', 'build-js', 'watch', 'hugo-server'])
gulp.task('build', ['hugo-build'])
