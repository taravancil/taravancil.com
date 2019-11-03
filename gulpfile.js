var gulp = require("gulp");
var sass = require("gulp-sass");
var autoprefixer = require("gulp-autoprefixer");
var rename = require("gulp-rename");
var cssmin = require("gulp-clean-css");
var minifyHtml = require("gulp-htmlmin");
var notification = require("gulp-notify");
var exec = require("child_process").exec;
var plumber = require("gulp-plumber");
var uglify = require("gulp-uglify");
var pump = require("pump");

gulp.task("build-scss", gulp.series(function() {
  var onError = function(err) {
    notification.onError({
      title: "gulp: build-scss",
      message: "<%= error.message %>"
    })(err);
    this.emit("end");
  };

  gulp
    .src("src/scss/style.scss")
    .pipe(plumber({ errorHandler: onError }))
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(cssmin())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("static/css/"));

  return gulp
    .src("src/scss/pages/*.scss")
    .pipe(plumber({ errorHandler: onError }))
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(cssmin())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("static/css/"));
}));

gulp.task("minify-html", gulp.series(function() {
  return gulp
    .src("public/**/*.html")
    .pipe(minifyHtml({ collapseWhitespace: true }))
    .pipe(gulp.dest("public"));
}));

gulp.task("build-js", gulp.series(function() {
  // pump([gulp.src("src/js/*"), uglify(), gulp.dest("static/js")]);
  return gulp.src("src/js/*").pipe(gulp.dest("static/js"));
}));

gulp.task("hugo-server", gulp.series(function() {
  exec("hugo server", function(_, err) {
    console.log("Listening on localhost:1313");
    if (err) console.log(err);
  });
}));

gulp.task("hugo-build", gulp.series(function() {
  exec("hugo", function(data, err) {
    if (err) {
      exec("hugo");
    }
  });
}));

gulp.task("watch", gulp.parallel(function() {
  gulp.watch("src/scss/**/*.scss", gulp.series("build-scss", "hugo-build"));
  gulp.watch("src/js/*", gulp.series("build-js", "hugo-build"));
  gulp.watch("layouts/**/*.html", gulp.series("hugo-build"));
  gulp.watch("content/**/*", gulp.series("hugo-build"));
  gulp.watch("data/**/*.yml", gulp.series("hugo-build"));
}));

gulp.task("default", gulp.series("build-scss", "build-js", "hugo-server", "watch"));
gulp.task("build", gulp.series("hugo-build"));
