const gulp = require('gulp');
const del = require('del');
const plugins = require('gulp-load-plugins')();

const jsPath = 'app/assets/js/**/*.js';
const scssPath = 'app/assets/scss/**/*.scss';
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
    .pipe(plugins.plumber())
    .pipe(plugins.imagemin())
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
    .pipe(plugins.plumber())
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.sass().on('error', plugins.sass.logError))
    .pipe(plugins.postcss(processors))
    .pipe(plugins.concat('all.min.css'))
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest('build/assets/css/'));
  cb();
}

// If you would like to use babel and esnext, you need to uncomment this code.
// and also add task to the build
function jsTask(cb) {
  gulp
    .src(jsPath)
    .pipe(plugins.plumber())
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.babel())
    .pipe(plugins.concat('all.js'))
    .pipe(plugins.uglify())
    .pipe(plugins.rename({ suffix: '.min' }))
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest('build/assets/js/'));
  cb();
}

// TODO:
// Removing comments from js files
// Using TypeScript for some projects
// Implementing tests if necessary

exports.default = gulp.series(
  clean,
  gulp.parallel(gulp.series(copyHtml), imgTask, sassTask, jsTask)
);
