const babel = require('gulp-babel');
const babelRegister = require('babel-register');
const del = require('del');
const eslint = require('gulp-eslint');
const gulp = require('gulp');
const isparta = require('isparta');
const istanbul = require('gulp-istanbul');
const mocha = require('gulp-mocha');

const testFiles = [
  'test/setup/node.js',
  'test/unit/**/*.js',
];

gulp.task('build', ['clean'], () =>
  gulp.src('src/**/*')
    .pipe(babel())
    .pipe(gulp.dest('build')));

gulp.task('build:watch', () =>
  gulp.watch('src/**/*', ['build']));

gulp.task('clean', () => del('build'));

gulp.task('coverage', (done) => {
  require('babel-register');
  gulp.src(['src/**/*.js'])
    .pipe(istanbul({
      instrumenter: isparta.Instrumenter,
      includeUntested: true,
    }))
    .pipe(istanbul.hookRequire())
    .on('finish', () => {
      return gulp.src(testFiles)
        .pipe(mocha({compilers: babelRegister}))
        .pipe(istanbul.writeReports())
        .on('end', done);
    });
});

gulp.task('lint', () =>
  gulp.src(['src/**/*.js', 'test/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError()));

gulp.task('test', () =>
  gulp.src(testFiles)
  .pipe(mocha({compilers: babelRegister})));

gulp.task('test:watch', () =>
  gulp.watch(testFiles.concat(['src/**/*.js']), ['test']));
