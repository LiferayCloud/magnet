import nodeExternals from 'webpack-node-externals';

export default (entry, outputPath) => {
  return {
    entry: entry,
    target: 'node',
    externals: [
      nodeExternals(),
    ],
    output: {
      libraryTarget: 'commonjs2',
      path: outputPath,
      filename: '[name]',
    },
  };
};
