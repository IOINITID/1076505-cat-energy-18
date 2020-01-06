"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var sass = require("gulp-sass");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var csso = require("gulp-csso");
var rename = require("gulp-rename");
var clean = require("gulp-clean");
var copy = require("gulp-copy");
var htmlmin = require("gulp-htmlmin");
var imagemin = require("gulp-imagemin");
var webp = require("gulp-webp");
var uglify = require("gulp-uglify");
var svgstore = require("gulp-svgstore");

gulp.task("clean", function () {
  return gulp.src('build', {
      allowEmpty: true
    })
    .pipe(clean())
});

gulp.task("css", function () {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("copy", function () {
  var sourceFiles = ["source/fonts/**/*.{woff,woff2}", "source/js/**/*.min.js"];
  return gulp.src(sourceFiles)
    .pipe(copy("build", {
      prefix: 1
    }))
});

gulp.task("html", function () {
  return gulp.src("source/*.html")
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest("build"));
});

gulp.task("images", function () {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.optipng(),
      imagemin.jpegtran({
        progressive: true
      }),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("build/img"));
});

gulp.task("webp", function () {
  return gulp.src("source/img/**/*.{png,jpg}")
    .pipe(webp({
      quality: 75
    }))
    .pipe(gulp.dest("build/img"));
});

gulp.task("js", function () {
  return gulp.src(["source/js/**/*.js", "!source/js/**/*.min.js"])
    .pipe(uglify())
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(gulp.dest("build/js"));
});

var svgFiles = ["source/img/htmlacademy.svg", "source/img/icon-{vk,insta,fb,phone,mail}.svg"];

gulp.task("svg", function () {
  return gulp.src(svgFiles)
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("icons.svg"))
    .pipe(gulp.dest("build/img"));
});

gulp.task("update", function () {
server.reload();
});

gulp.task("server", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("css"));
  gulp.watch(svgFiles, gulp.series("svg", server.reload));
  gulp.watch("source/*.html").on("change", gulp.series("html", "update"));
});

gulp.task("start", gulp.series("clean", "html", "css", "js", "copy", "svg", "images", "webp", "server"));
gulp.task("build", gulp.series("clean", "html", "css", "js", "copy", "svg", "images", "webp"));
