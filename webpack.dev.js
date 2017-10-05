const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  devtool: 'eval-source-map',
  devServer: {
    historyApiFallback: {
      index:'dist/index.html',
      rewrites: [
        { from: /list\/*/, to: 'dist/index.html' }
      ]
    },
    https: false
  }
})
