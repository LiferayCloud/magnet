const babel = require('gulp-babel');
const babelRegister = require('babel-register');
const del = require('del');
const eslint = require('gulp-eslint');
const gulp = require('gulp');
const mocha = require('gulp-mocha');

const testFiles = ['test/setup/node.js', 'test/unit/**/*.js'];

gulp.task('build', ['clean'], () =>
  gulp.src('src/**/*').pipe(babel()).pipe(gulp.dest('build'))
);

gulp.task('build:watch', () => gulp.watch('src/**/*', ['build']));

gulp.task('clean', () => del('build'));

gulp.task('lint', () =>
  gulp
    .src(['src/**/*.js', 'test/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
);

gulp.task('test', () =>
  gulp.src(testFiles).pipe(mocha({compilers: babelRegister, timeout: 20000}))
);

gulp.task('test:watch', () =>
  gulp.watch(testFiles.concat(['src/**/*.js']), ['test'])
);
