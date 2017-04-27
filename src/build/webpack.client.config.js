import es2015 from 'babel-preset-es2015';
import metalJsx from 'babel-preset-metal-jsx';
import path from 'path';

export default (entry, directory, outputDirectory) => {
  return {
    context: directory,
    entry: entry,
    output: {
      path: outputDirectory,
      filename: '[name]',
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
              presets: [es2015, metalJsx],
            },
          },
        },
      ],
    },
  };
};
