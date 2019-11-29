const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const plumber = require('gulp-plumber');
const sass = require('gulp-sass');
const uglifyCss = require('gulp-uglifycss');

const env = process.env.NODE_ENV || 'production';

const destDir = 'build';
const stylesDir = 'src/scss';
const imagesDir = 'src/images';
const scriptsDir = 'src/js';

gulp.task('html', () => {
  setTimeout(browserSync.reload, 0);
  return gulp.src('src/**/*.html').pipe(gulp.dest(destDir));
});

gulp.task('scss', () => {
  return gulp
    .src(`${stylesDir}/**/*.scss`)
    .pipe(plumber())
    .pipe(sass())
    .pipe(gulp.dest(`${destDir}/css`))
    .pipe(uglifyCss())
    .pipe(browserSync.stream());
});

gulp.task('js', () => {
  return gulp
    .src(`${scriptsDir}/**/*.js`)
    .pipe(plumber())
    .pipe(gulp.dest(`${destDir}/js`))
    .pipe(browserSync.stream());
});

gulp.task('images', () => {
  return gulp
    .src(`${imagesDir}/**/*.{jpg,jpeg,png,svg}`)
    .pipe(plumber())
    .pipe(gulp.dest(`${destDir}/images`));
});

gulp.task('serve', () => {
  browserSync.init({
    server: {
      baseDir: destDir
    }
  });
});

gulp.task('watch', () => {
  gulp.watch('src/**/*.html', ['html']);
  gulp.watch(`${stylesDir}/**/*.scss`, ['scss']);
  gulp.watch(`${scriptsDir}/**/*.js`, ['js']);
});

let taskList = ['html', 'images', 'scss', 'js'];

if (env === 'development') {
  taskList = taskList.concat(['serve', 'watch']);
}

gulp.task('default', gulp.series(taskList));
