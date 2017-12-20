import ProgressBarPlugin from 'progress-bar-webpack-plugin';
import path from 'path';

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
    resolve: {
      extensions: ['.js', '.json'],
      modules: [
        path.join(magnet.getDirectory(), 'node_modules'),
        path.join(__dirname, '../../node_modules'),
        'node_modules',
      ],
    },
    resolveLoader: {
      modules: [
        path.join(magnet.getDirectory(), 'node_modules'),
        path.join(__dirname, '../../node_modules'),
        'node_modules',
      ],
    },
    module: {
      loaders: [],
    },
    node: {
      console: true,
      assert: 'empty',
      async_hooks: 'empty',
      buffer: 'empty',
      child_process: 'empty',
      cluster: 'empty',
      crypto: 'empty',
      dgram: 'empty',
      dns: 'empty',
      domain: 'empty',
      events: 'empty',
      fs: 'empty',
      http: 'empty',
      https: 'empty',
      net: 'empty',
      os: 'empty',
      path: 'empty',
      punycode: 'empty',
      querystring: 'empty',
      readline: 'empty',
      repl: 'empty',
      stream: 'empty',
      string_decoder: 'empty',
      tls: 'empty',
      tty: 'empty',
      url: 'empty',
      util: 'empty',
      v8: 'empty',
      vm: 'empty',
      zlib: 'empty',
    },
  };
}
