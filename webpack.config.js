'use strict';

const path = require('path')
const webpack = require('webpack')
const autoprefixer = require('autoprefixer')
const WebpackHtmlPlugin = require('html-webpack-plugin')
const OfflinePlugin = require('offline-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const packageJson = require('./package.json')

const getPath = (_path) => path.resolve(path.join(__dirname, _path))

const config = {
  devtool: '#source-map',
  context: getPath('src'),
  entry: {
    vendor: Object.keys(packageJson.dependencies),
    app: [ getPath('src/index.js') ],
  },
  output: {
    path: getPath('./dist/'),
    filename: '[name].bundle.js',
    chunkFilename: '[id].chunk.js',
    publicPath: '/',
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'chunk',
      async: true,
    }),
    new webpack.EnvironmentPlugin([
      'NODE_ENV',
      'BUILD_ENV',
    ]),
    new webpack.optimize.DedupePlugin(),
    new WebpackHtmlPlugin({
      title: 'React Boillerplate',
      template: getPath('src/index.html'),
      minify: false,
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
  ],
  module: {
    loaders: [
      { test: /\.jsx?$/, loader: 'babel', exclude: /node_modules/ },
      { test: /\.jpe?g$|\.gif$|\.png$/i, loader: 'url?limit=10000', exclude: /node_modules/ },
      { test: /\.json$/, loader: 'json' },
    ],
    preLoaders: [
      { test: /\.jsx?$/, loader: 'jscs', exclude: /node_modules/, },
    ],
  },
  jscs: {
    emitErrors: false,
    failOnHint: false,
  },
  postcss: () => [autoprefixer({ browsers: ['android > 4', 'IE > 9'] })],
  resolve: {
    extensions: [
      '',
      '.js',
      '.jsx',
      '.json',
      '.scss',
      '.css',
    ],
    root: [
      getPath('src'),
    ],
  },
};

if (process.env.NODE_ENV === 'development') {
    config.entry.app.unshift('webpack-hot-middleware/client?http://localhost:9019');
    config.devtool = '#eval';
    config.module.loaders.push({
      test: /\.scss/,
      loader: 'style!css!postcss!sass',
    })
    config.plugins.unshift(new webpack.HotModuleReplacementPlugin());
}

if (process.env.NODE_ENV === 'production') {
    config.output.filename = '[chunkhash].js';
    config.output.chunkFilename = '[id]-[chunkhash].js';

    config.plugins.push(new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }))
    config.plugins.push(new webpack.optimize.AggressiveMergingPlugin())

    config.module.loaders.push({
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract('style', 'css!postcss!sass'),
      exclude: /node_modules/
    })
    config.plugins.push(new ExtractTextPlugin('[chunkhash].css'))
    config.plugins.push(new OfflinePlugin({
      AppCache: { directory: './' },
      excludes: ['/', 'index.html'],
    }));
}

module.exports = config;
