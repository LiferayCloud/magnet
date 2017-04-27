import {transformFileSync} from 'babel-core';
import es2015 from 'babel-preset-es2015';
import metalJsx from 'babel-preset-metal-jsx';
import path from 'path';
import fs from 'fs-extra';
import webpack from 'webpack';
import buildWebpackClientConfig from './webpack.client.config';

import jsdom from 'jsdom';
const {JSDOM} = jsdom;
const dom = new JSDOM();
global.document = dom.window.document;
global.window = dom.window;

/**
 * Builds server `files` into `outputPath`.
 * @param {!Array.<string>} files
 * @param {string} directory
 * @param {string} outputDirectory
 * @return {Promise}
 */
export async function buildServer(files, directory, outputDirectory) {
  fs.removeSync(outputDirectory);

  return new Promise((resolve, reject) => {
    files.forEach((file) => {
      try {
        let absoluteSrc = path.join(directory, file);
        let absoluteDist = path.join(outputDirectory, file);
        let transform = transformFileSync(absoluteSrc, {
          presets: [metalJsx, es2015],
          babelrc: false,
          filename: absoluteSrc,
          filenameRelative: file,
        });
        fs.outputFileSync(absoluteDist, transform.code);
      } catch(error) {
        reject(error);
      }
    });
    resolve();
  });
}

/**
 * Builds client `files` into `outputPath`.
 * @param {!Array.<string>} files
 * @param {string} directory
 * @param {string} outputDirectory
 * @return {Promise}
 */
export async function buildClient(files, directory, outputDirectory) {
  fs.removeSync(outputDirectory);

  let entry = {};
  files.forEach((file) => entry[file] = file);

  const webpackClientConfig = buildWebpackClientConfig(
    entry, directory, outputDirectory);

  return new Promise((resolve, reject) => {
    webpack(webpackClientConfig, (err, stats) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const output = stats.toString({
        colors: true,
        chunks: false,
      });
      console.log(output);
      resolve(output);
    });
  });
}
