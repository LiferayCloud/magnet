import {transformFileSync} from 'babel-core';
import path from 'path';
import fs from 'fs-extra';
import esEnv from 'babel-preset-env';
import {isFunction} from 'metal';
import log from '../log';

import jsdom from 'jsdom';
const {JSDOM} = jsdom;
const dom = new JSDOM();
global.document = dom.window.document;
global.window = dom.window;

/**
 * Aggregate babel presets.
 * @param {Array} plugins
 * @return {Array}
 */
const aggregateBabelPresets = plugins => {
  let presets = [esEnv];
  for (const plugin of plugins) {
    if (isFunction(plugin.babelPresets)) {
      presets = presets.concat(plugin.babelPresets());
    }
  }
  return presets;
};

/**
 * Builds server `files` into `outputPath`.
 * @param {!Array.<string>} files
 * @param {string} directory
 * @param {string} outputDirectory
 * @param {!Array} plugins
 * @return {Promise}
 */
export async function buildServer(
  files,
  directory,
  outputDirectory,
  plugins = []
) {
  log.info(false, 'Building server…');
  fs.removeSync(outputDirectory);
  const presets = aggregateBabelPresets(plugins);

  return new Promise((resolve, reject) => {
    files.forEach(file => {
      try {
        let absoluteSrc = path.join(directory, file);
        let absoluteDist = path.join(outputDirectory, file);
        let transform = transformFileSync(absoluteSrc, {
          presets,
          babelrc: false,
          filename: absoluteSrc,
          filenameRelative: file,
          plugins: [
            ['transform-runtime', {
              'helpers': false,
              'polyfill': false,
              'regenerator': true,
              'moduleName': 'babel-runtime',
            }],
          ],
        });
        fs.outputFileSync(absoluteDist, transform.code);
      } catch (error) {
        reject(error);
      }
    });
    resolve();
  });
}
