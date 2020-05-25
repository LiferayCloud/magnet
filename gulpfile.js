const {src, dest, series} = require('gulp');
const babel = require('gulp-babel');
const del = require('del');


/**
 * @return {Function}
 */
function js() {
  return src(['./src/**/*', '!./src/**/*.test.js'])
  .pipe(babel())
  .pipe(dest('build'));
}

/**
 * @return {Promise}
 */
function deleteBuildFolder() {
  return del('build');
}

exports.deleteBuildFolder = deleteBuildFolder;
exports.js = js;
exports.default = series(deleteBuildFolder, js);
