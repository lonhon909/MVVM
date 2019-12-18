const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    contentBase: 'dist',
    port: 8080
  },
  module: {
    rules: [
      // {
      //   test: /\.tsx?$/,
      //   use: ['ts-loader'],
      //   exclude: /node_modules/
      // }
    ]
  },
  plugins: [
    new htmlWebpackPlugin({
      title: 'Virtual DOM的实现及渲染',
      filename: 'index.html',
      template: path.resolve(__dirname, 'public/index.html')
    }),
    new CleanWebpackPlugin(),
  ]
}