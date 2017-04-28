import {assertDefAndNotNull} from 'metal-assertions';
import fs from 'fs';
import path from 'path';

const baseConfig = () => {
  return {
    magnet: {
      host: '0.0.0.0',
      ignore: [
        'build/**',
        'magnet.config.js',
        'node_modules/**',
        'static/**',
        'test/**',
      ],
      logLevel: 'info',
      port: 3000,
      src: ['**/*.js'],
      plugins: {
        metal: {
          soySrc: ['**/*.soy'],
          soyDest: ['.'],
        },
      },
    },
  };
};

/**
 * Creates configuration.
 * @param {!string} directory
 * @param {!string} config Config filename.
 * @param {!string} configDir Config directory.
 * @return {Object}
 */
function createConfig(directory, config, configDir) {
  assertDefAndNotNull(directory, 'Directory must be specified.');
  assertDefAndNotNull(config, 'Config filename must be specified.');
  assertDefAndNotNull(configDir, 'Config directory must be specified.');

  let ext = {};
  let file = path.resolve(directory, configDir, config);

  if (fs.existsSync(file)) {
    ext = require(file);
  }

  return deepMerge_(baseConfig(), ext);
}

/**
 * Deep merges object.
 * @param {!Object} destination Destination object.
 * @param {!Object} source Source object.
 * @return {Object} Returns the result of mergint the two params.
 * @private
 */
function deepMerge_(destination, source) {
  for (let property in source) {
    if (
      source[property] &&
      source[property].constructor &&
      source[property].constructor === Object
    ) {
      destination[property] = destination[property] || {};
      deepMerge_(destination[property], source[property]);
    } else {
      destination[property] = source[property];
    }
  }
  return destination;
}

export {createConfig};
