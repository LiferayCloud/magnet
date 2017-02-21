import path from 'path';

/**
 * Creates namespace in `obj` based on `parts` with `value`.
 * @param {?object} obj
 * @param {?array.<string>} parts
 * @param {*} value
 * @private
 */
function createNamespace(obj = {}, parts = [], value) {
  let last = obj;
  parts.forEach((key, i) => {
    last[key] = (i === parts.length - 1) ? value : {};
    last = obj[key];
  });
}

/**
 * @param {!string} filename
 * @return {string} Filename without extension.
 * @private
 */
function removeExtension(filename) {
  let last = filename.lastIndexOf('.');
  if (last > -1) {
    return filename.substring(0, last);
  }
  return filename;
}

export default {
  test() {
    return true;
  },
  register(filename, module, magnet) {
    let folder = magnet.getServerDistDirectory();
    let parts = removeExtension(filename.substring(folder.length + 1))
      .split(path.sep)
      .map((part) => part.toLowerCase());
    createNamespace(magnet.injections, parts, module.default);
  },
};
