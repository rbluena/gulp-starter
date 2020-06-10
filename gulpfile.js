const gulp = require('gulp');
const sass = require('gulp-sass');
const imagemin = require('gulp-imagemin');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const terser = require('gulp-terser');
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
  gulp.src(imgPath).pipe(imagemin()).pipe(gulp.dest('build/assets/images'));
  cb();
}

/**
 * Compiling SCSS
 */
function sassTask(cb) {
  const processors = [require('autoprefixer'), require('cssnano')];

  gulp
    .src(scssPath)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(processors))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/assets/css/'));
  cb();
}

function jsTask(cb) {
  gulp
    .src(jsPath)
    .pipe(sourcemaps.init())
    .pipe(concat('all.js'))
    .pipe(terser())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/assets/js'));
  cb();
}

// TODO:
// Removing comments from js files
// Implementing Minification for JavaScript
// Using TypeScript for some projects
// Implementing tests if necessary

exports.build = gulp.series(clean, copyHtml, imgTask, jsTask, sassTask);
