const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const plumber = require('gulp-plumber');
const sass = require('gulp-sass');
const uglifyCss = require('gulp-uglifycss');
const browserify = require('browserify');
const source = require('vinyl-source-stream');

const destDir = 'build';
const stylesDir = 'src/scss';
const imagesDir = 'src/images';
const scriptsDir = 'src/js';

gulp.task('html', () => {
  gulp.src('src/**/*.html')
  .pipe(gulp.dest(destDir));
  browserSync.reload();
});

gulp.task('scss', () => {
  gulp.src(`${stylesDir}/**/*.scss`)
  .pipe(plumber())
  .pipe(sass())
  .pipe(gulp.dest(`${destDir}/css`))
  .pipe(uglifyCss())
  .pipe(browserSync.stream());
});

gulp.task('js', () => {
  gulp.src(`${scriptsDir}/**/*.js`)
  .pipe(plumber())
  .pipe(gulp.dest(`${destDir}/js`))
  .pipe(browserSync.stream());
});

gulp.task('images', () => {
  gulp.src(`${imagesDir}/**/*.{jpg,jpeg,png,svg}`)
  .pipe(plumber())
  .pipe(gulp.dest(`${destDir}/images`))
});

gulp.task('serve', () => {
  browserSync.init({
    server: {
      baseDir: destDir,
    },
  });
});

gulp.task('watch', () => {
  gulp.watch('src/**/*.html', ['html']);
  gulp.watch(`${stylesDir}/**/*.scss`, ['scss']);
  gulp.watch(`${scriptsDir}/**/*.js`, ['js']);
});

gulp.task('default', ['html', 'images', 'scss', 'js', 'serve', 'watch']);
