const path = require('path')
const webpack = require('webpack')
// const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

const isPro = process.env.NODE_ENV === 'production'

const geProjectRoot = () => {
  return path.resolve('.')
}

const plugins = []
if (isPro) {
  // plugins.push(new UglifyJSPlugin())
} else {
  plugins.push(new webpack.HotModuleReplacementPlugin())
}
plugins.push(new webpack.LoaderOptionsPlugin({
  eslint: {
    configFile: path.join(geProjectRoot(), '.eslintrc.js'),
    formatter: require('eslint-friendly-formatter'),
    useEslintrc: false
  }
}))

module.exports = {
  entry: path.resolve(geProjectRoot(), './src/index.js'),
  target: 'node',
  output: {
    path: path.resolve(geProjectRoot(), 'dist/'),
    publicPath: '',
    filename: 'AliOssPlugin.js'
  },
  devServer: {
    historyApiFallback: true,
    hot: true,
    inline: true
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components|dist)/,
        query: {
          presets: ['es2015'],
          plugins: ['transform-runtime']
        }
      },
      {
        test: /\.js$/,
        enforce: 'pre',
        loader: 'eslint-loader',
        exclude: /(node_modules|bower_components|dist)/
      }
    ]
  },
  plugins
}
