import path from 'path';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';

export default magnet => {
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
};
