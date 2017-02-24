import path from 'path';
import {isObject} from 'metal';

/**
 * Creates namespace in `obj` based on `parts` with `value`.
 * @param {?Object} obj
 * @param {?array.<string>} parts
 * @param {*} value
 * @private
 */
function createNamespace_(obj = {}, parts = [], value) {
  let last = obj;
  parts.forEach((key, i) => {
    last[key] = (i === parts.length - 1) ? value : {};
    last = last[key];
  });
}

/**
 * @param {!string} filename
 * @return {string} Filename without extension.
 * @private
 */
function removeExtension_(filename) {
  let last = filename.lastIndexOf('.');
  if (last > -1) {
    return filename.substring(0, last);
  }
  return filename;
}

export default {
  test(filename, module, magnet) {
    return !isObject(module.route);
  },
  register(filename, module, magnet) {
    let folder = magnet.getServerDistDirectory();
    let parts = removeExtension_(filename.substring(folder.length + 1))
      .split(path.sep)
      .map((part) => part.toLowerCase());
    createNamespace_(magnet.injections, parts, module.default);
  },
};
