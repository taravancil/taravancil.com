var Promise      = require('es6-promise').Promise;
var gulp         = require('gulp');
var sass         = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var rename       = require('gulp-rename');
var cssmin       = require('gulp-clean-css');
var minifyHtml   = require('gulp-htmlmin');
var notification = require('gulp-notify');
var exec         = require('child_process').exec;

gulp.task('build-scss', function() {
    // TODO: Add notifications for Sass build failures
    return gulp.src('src/scss/main.scss')
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(cssmin())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('static/css/'));
});

gulp.task('minify-html', function() {
    return gulp.src('public/**/*.html').pipe(minifyHtml());
});

gulp.task('hugo-server', function() {
    exec('hugo server', function(stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
  });
})

gulp.task('watch', function() {
    gulp.watch('src/scss/**/*.scss', ['build-scss']);
    gulp.watch('public/*.html', ['minify-html']);
});

gulp.task('default', ['build-scss', 'watch', 'hugo-server']);
