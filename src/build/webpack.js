import path from 'path';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';

/**
 * @param {Magnet} magnet
 * @return {Object}
 */
export function getDefaultWebpackConfig(magnet) {
  return {
    output: {
      path: path.join(magnet.getDirectory(), '.magnet'),
      filename: '[name]',
    },
    plugins: [
      new ProgressBarPlugin({
        summary: false,
      }),
    ],
    entry: {},
    resolveLoader: {
      modules: [path.join(__dirname, '../../node_modules'), 'node_modules'],
    },
    module: {
      loaders: [],
    },
  };
}
