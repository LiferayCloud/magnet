import esEnv from 'babel-preset-env';
import fs from 'fs-extra';
import {isFunction} from 'metal';
import jsdom from 'jsdom';
import log from '../log';
import path from 'path';
import {transformFileSync} from 'babel-core';

const {JSDOM} = jsdom;
const dom = new JSDOM();

/**
 * Aggregate babel presets.
 * @param {Array} plugins
 * @return {Array}
 */
const aggregateBabelPresets = plugins => {
  let presets = [
    [
      esEnv,
      {
        targets: {
          node: 'current',
        },
      },
    ],
  ];
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
 * @param {?Array} config
 * @return {Promise}
 */
export async function buildServer(
  files,
  directory,
  outputDirectory,
  plugins = [],
  config = {}
) {
  log.info(false, 'Building server…');

  if (config.magnet && !config.magnet.apiOnly) {
    global.document = dom.window.document;
    global.window = dom.window;
  }

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
          sourceMaps: 'inline',
          plugins: [
            [
              'transform-runtime',
              {
                helpers: false,
                polyfill: false,
                regenerator: true,
                moduleName: 'babel-runtime',
              },
            ],
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
