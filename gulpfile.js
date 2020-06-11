const gulp = require('gulp');
const { series, parallel } = require('gulp');
const plumber = require('gulp-plumber');
const babel = require('gulp-babel');
const sass = require('gulp-sass');
const imagemin = require('gulp-imagemin');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const del = require('del');

const jsPath = 'app/assets/js/**/*.js';
const scssPath = 'app/assets/scss/**/*.scss'; // This might be removed if framework like TailWind is used
const imgPath = 'app/assets/images/**/*';

/**
 * Cleaning build directories
 */
function clean(cb) {
  console.log('*** Deleting build folder ***');
  del.sync('build');
  cb();
}

/**
 * copying HTML content to build folder
 */
function copyHtml(cb) {
  gulp.src('app/*.html').pipe(gulp.dest('build'));
  cb();
}

/**
 * Image processing
 */
function imgTask(cb) {
  gulp
    .src(imgPath)
    .pipe(plumber())
    .pipe(imagemin())
    .pipe(gulp.dest('build/assets/images'));
  cb();
}

/**
 * Compiling SCSS
 */
function sassTask(cb) {
  const processors = [require('autoprefixer'), require('cssnano')];

  gulp
    .src(scssPath)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(processors))
    .pipe(concat('all.min.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/assets/css/'));
  cb();
}

// If you would like to use babel and esnext, you need to uncomment this code.
// and also add task to the build
function jsTask(cb) {
  gulp
    .src(jsPath)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/assets/js/'));
  cb();
}

// TODO:
// Removing comments from js files
// Using TypeScript for some projects
// Implementing tests if necessary

exports.default = series(
  clean,
  parallel(series(copyHtml), imgTask, sassTask, jsTask)
);
