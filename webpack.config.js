const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/dungeon.js',
  output: {
    path: `/build/`,
    filename: 'bundle.js',
    publicPath: `/build/`
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.json']
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: require.resolve('babel-loader'), options: { cacheDirectory: true } },
      { test: /\.(png|jpg|gif|json)$/, loader: 'file-loader' }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    contentBase: __dirname + '/public',
    port: 9000,
    hot: true,
    open: true,
    overlay: true,
    progress: true,
    watchOptions: {
      ignored: /node_modules/,
    }
  }
}