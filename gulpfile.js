const babel = require('gulp-babel');
const gulp = require('gulp');
const del = require('del');

gulp.task('build', ['clean'], () =>
  gulp
    .src(['./src/**/*', '!./src/**/*.test.js'])
    .pipe(babel())
    .pipe(gulp.dest('build'))
);

gulp.task('clean', () => del('build'));
