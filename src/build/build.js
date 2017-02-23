import buildWebpackServerConfig from './webpack.server.config';
import del from 'del';
import webpack from 'webpack';

/**
 * Builds `files` into `outputPath`.
 * @param {!Array.<string>} files
 * @param {string} directory
 * @param {string} outputDirectory
 * @return {Promise}
 */
export async function build(files, directory, outputDirectory) {
  await del(outputDirectory);

  return new Promise((resolve, reject) => {
    let entry = {};
    files.forEach((file) => entry[file] = file);

    const webpackServerConfig = buildWebpackServerConfig(
      entry, directory, outputDirectory);

    webpack(webpackServerConfig, function(err, stats) {
      if (err) {
        reject(err);
      }
      const output = stats.toString({
        colors: true,
        chunks: false,
      });
      resolve(output);
    });
  });
}
