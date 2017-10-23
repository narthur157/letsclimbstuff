const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: path.resolve(__dirname, 'public/index'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[hash].js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.css'],
    modules: [
      path.resolve(__dirname, 'public'),
      'node_modules'
    ],
    alias: {
      Components: path.resolve(__dirname, 'public/components/'),
      Lib: path.resolve(__dirname, 'public/lib')
    }
  },
  module: {
    rules: [  
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['react']
          }
        }
      },
      { test: /\.css$/,
        use: [ { loader: 'style-loader'}, { loader: 'css-loader' } ]
      },
      {
        test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/,
        loader: 'url-loader?limit=30000&name=[name]-[hash].[ext]'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/indexTemplate.html',
      filename: 'index.html',
      favicon: 'favicon.ico'
    })
  ]
}
