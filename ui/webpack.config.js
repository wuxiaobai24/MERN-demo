const path = require('path');
const webpack = require('webpack')
require('dotenv').config();

module.exports = {
  mode: 'development',
  entry: { app: ['./src/App.jsx'] },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'public'),
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  optimization: {
    splitChunks: {
      name: 'vendor',
      chunks: 'all',
    },
  },
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      __UI_API_ENDPOINT__: `'${process.env.UI_API_ENDPOINT}'`,
    })
  ]
};
