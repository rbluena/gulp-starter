const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const sourcemaps = require('gulp-sourcemaps');
const terser = require('gulp-terser');
const concat = require('gulp-concat');
const del = require('del');

const jsPath = 'app/assets/js/**/*.js';
const scssPath = 'app/assets/scss/**/*.scss'; // This might be removed if framework like TailWind is used
const imgPath = 'app/assets/images/**/*';

const copyFiles = () => console.log('Copy everything at once!');
const copyHtml = () => gulp.src('app/*.html').pipe(gulp.dest('build'));

const imgTask = () =>
  gulp.src(imgPath).pipe(imagemin()).pipe(gulp.dest('build/assets/images'));
const scssTask = () => console.log('css');

const jsTask = () => {
  return src(jsPath)
    .pipe(sourcemaps.init())
    .pipe(concat('all.js'))
    .pipe(terser())
    .pipe(sourcemaps.write())
    .dest('build/assets/js');
};

function clean() {
  console.log('*** Deleting build folder ***');
  del.sync('build');
}

// These are added configurations for TypeScript

function build(cb) {
  gulp.parallel(copyHtml, copyImages);
  cb();
}

// TODO:
// Removing comments from js files
// Implementing ESLint and Prettier
// Implementing PostCSS
// Implementing Minification
// Implementing tests if necessary
// Using TypeScript for some projects

exports.default = gulp.series(clean, build);
