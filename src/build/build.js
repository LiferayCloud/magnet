import {transformFileSync} from 'babel-core';
import path from 'path';
import fs from 'fs-extra';
import es2015 from 'babel-preset-es2015';
import {isFunction} from 'metal';
import log from '../log';
import mv from 'mv';

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
  let presets = [es2015];
  for (const plugin of plugins) {
    if (isFunction(plugin.babelPresets)) {
      presets = presets.concat(plugin.babelPresets());
    }
  }
  return presets;
};

/**
 * Builds server `files` into `outputPath`.
 * @param {!Object} magnet
 * @return {Promise}
 */
export async function buildServer(magnet) {
  const files = magnet.getBuildFiles({directory: magnet.getDirectory()});

  if (!files.length) {
    return;
  }

  log.info(false, 'Building assets…');

  fs.removeSync(magnet.getServerDistDirectory());
  const presets = aggregateBabelPresets(magnet.getPlugins());

  return new Promise((resolve, reject) => {
    files.forEach(file => {
      try {
        const absoluteSrc = path.join(magnet.getDirectory(), file);
        const absoluteBuildDist = path.join(
          magnet.getServerBuildDirectory(), file);
        const transform = transformFileSync(absoluteSrc, {
          presets,
          babelrc: false,
          filename: absoluteSrc,
          filenameRelative: file,
        });
        fs.mkdirpSync(magnet.getServerBuildDirectory());
        fs.outputFileSync(absoluteBuildDist, transform.code);
      } catch (error) {
        reject(error);
      }
    });
    resolve();
  });
}

/**
 * Replaces current build.
 * @param {Object} magnet
 * @return {Promise}
 */
export async function replaceCurrentBuild(magnet) {
  const appDistDirectory = magnet.getDistDirectory();
  const buildDirectory = path.join(magnet.getBuildDirectory(), '.magnet');
  const oldBuildDirectory = path.join(
    magnet.getBuildDirectory(), '.magnet.old');

  try {
    await move(appDistDirectory, oldBuildDirectory);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  console.log(buildDirectory);
  console.log(appDistDirectory);
  await move(buildDirectory, appDistDirectory);
  return oldBuildDirectory;
}

/**
 * Promise wrapper for mv function.
 * @param {string} from
 * @param {string} to
 * @return {Promise}
 */
function move(from, to) {
  return new Promise((resolve, reject) => {
    mv(from, to, error => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}
