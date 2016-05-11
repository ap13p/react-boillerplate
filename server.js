'use strict';

const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const webpackConfig = require('./webpack.config');

const compiler = webpack(webpackConfig);
const app = express();

app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath,
}));

app.use(webpackHotMiddleware(compiler));

app.use('/', express.static(path.join(__dirname, './dist/')));

app.listen(9019, function () {
    console.log('Server listening on http://127.0.0.1:9019/');
});
