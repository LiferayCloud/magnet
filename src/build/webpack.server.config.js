import nodeExternals from 'webpack-node-externals';

export default (entry, directory, outputDirectory) => {
  return {
    context: directory,
    entry: entry,
    target: 'node',
    externals: [
      nodeExternals(),
    ],
    output: {
      libraryTarget: 'commonjs2',
      path: outputDirectory,
      filename: '[name]',
    },
  };
};
