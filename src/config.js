import fs from 'fs';
import path from 'path';

const baseConfig = () => {
  return {
    magnet: {
      host: 'localhost',
      ignore: [
          './build/**',
          './coverage/**',
          './gulpfile.js',
          './magnet.config.js',
          './node_modules/**',
      ],
      port: 80,
      src: ['./**/*.js'],
    },
  };
};

/**
 * Deep merges object.
 * @param {!Object} destination Destination object.
 * @param {!Object} source Source object.
 * @return {Object} Returns the result of mergint the two params.
 * @private
 */
function deepMerge_(destination, source) {
  for (let property in source) {
    if (source[property] && source[property].constructor &&
     source[property].constructor === Object) {
      destination[property] = destination[property] || {};
      deepMerge_(destination[property], source[property]);
    } else {
      destination[property] = source[property];
    }
  }
  return destination;
}

/**
 * Creates configuration.
 * @param {!string} directory
 * @param {!string} config Config filename.
 * @return {Object}
 */
function createConfig(directory, config = 'magnet.config.js') {
  let ext = {};
  let file = path.resolve(config);

  if (fs.existsSync(file)) {
    ext = require(file);
  }

  return deepMerge_(baseConfig(), ext);
}

export {createConfig};
