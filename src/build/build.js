import buildWebpackServerConfig from './webpack.server.config';
import del from 'del';
import webpack from 'webpack';

/**
 * Builds `files` into `outputPath`.
 * @param {!array.<string>} files
 * @param {string} outputPath
 * @return {Promise}
 * @async
 */
export async function build(files, outputPath) {
  await del(outputPath);

  return new Promise((resolve, reject) => {
    let entry = {};
    files.forEach((file) => entry[file] = file);

    let webpackServerConfig = buildWebpackServerConfig(entry, outputPath);

    webpack(webpackServerConfig, function(err, stats) {
      if (err) {
        reject(err);
      }
      let output = stats.toString({
        colors: true,
        chunks: false,
      });
      resolve(output);
    });
  });
}
