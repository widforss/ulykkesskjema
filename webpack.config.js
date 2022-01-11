const path = require('path');

module.exports = {
  entry: './client/main.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  output: {
    filename: 'static/js/main.js',
    path: path.resolve(__dirname),
  },
  experiments: {
    topLevelAwait: true,
  }
};