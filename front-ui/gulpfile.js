var gulp = require('gulp');
var showFile = require('gulp-show-me-file');
var minifyHtml = require('gulp-minify-html');
var angularTemplatecache = require('gulp-angular-templatecache');
var del = require('del');
var concat = require('gulp-concat');
var es = require('event-stream');

const DestFolder = "dist";
const SourceFolder = "src";

gulp.task('default', ['clean', 'view-template', 'css', 'copy']);

gulp.task('copy', function() {
  return gulp.src(`${SourceFolder}/*`)
    .pipe(showFile())
    .pipe(gulp.dest(DestFolder));
});

gulp.task('clean', function() {
  return del([DestFolder], {
    force: true
  });
});

gulp.task('css', function() {
  return gulp.src(`${SourceFolder}/**/*.css`)
    .pipe(showFile())
    .pipe(concat("huoyun.css"))
    .pipe(gulp.dest(DestFolder));
});

gulp.task('view-template', function() {
  var templateStream = gulp.src('src/view/**/*.html')
    .pipe(showFile())
    .pipe(minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe(angularTemplatecache('view.template.tpl.js', {
      module: 'huoyun'
    }));

  var es = require('event-stream');
  return es.merge([
      gulp.src(['src/**/*.js']),
      templateStream
    ])
    .pipe(showFile())
    .pipe(concat('index.js'))
    .pipe(gulp.dest(DestFolder));
});