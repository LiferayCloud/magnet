import {transformFileSync} from 'babel-core';
import es2015 from 'babel-preset-es2015';
import path from 'path';
import fs from 'fs-extra';


/**
 * Builds `files` into `outputPath`.
 * @param {!Array.<string>} files
 * @param {string} directory
 * @param {string} outputDirectory
 * @return {Promise}
 */
export async function build(files, directory, outputDirectory) {
  fs.removeSync(outputDirectory);

  return new Promise((resolve, reject) => {
    files.forEach((file) => {
      try {
        let absoluteSrc = path.join(directory, file);
        let absoluteDist = path.join(outputDirectory, file);
        let transform = transformFileSync(absoluteSrc, {
          presets: [es2015],
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
