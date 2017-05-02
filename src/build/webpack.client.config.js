import path from 'path';

export default (entry, directory, outputDirectory, babelPresets) => {
  return {
    context: directory,
    entry: entry,
    output: {
      path: outputDirectory,
      filename: '[name]',
    },
    resolve: {
      mainFields: ['jsnext:main', 'browser', 'main'],
    },
    resolveLoader: {
      modules: [path.join(__dirname, '../../node_modules'), 'node_modules'],
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: babelPresets,
            },
          },
        },
      ],
    },
  };
};
