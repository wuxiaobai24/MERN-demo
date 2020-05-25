const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

require('dotenv').config();
const port = process.env.UI_SERVER_PORT || 8000;
const UI_API_ENDPOINT =
  process.env.UI_API_ENDPOINT || 'httpL//localhost:3000/graphql';
const enableHMR = (process.env.ENABLE_HMR || 'true') === 'true';

const env = { UI_API_ENDPOINT };
const apiProxyTarget = process.env.API_PROXY_TARGET;
console.log(apiProxyTarget, env);

const app = express();

if (apiProxyTarget) {
  app.use(
    '/graphql',
    createProxyMiddleware({ target: apiProxyTarget, changeOrigin: true })
  );
}

if (enableHMR && process.env.NODE_ENV !== 'production') {
  console.log('Adding dev middleware, enable HMR');
  const webpack = require('webpack');
  const devMiddleware = require('webpack-dev-middleware');
  const hotMiddleware = require('webpack-hot-middleware');

  const config = require('./webpack.config.js');
  config.entry.app.push('webpack-hot-middleware/client');
  config.plugins = config.plugins || [];
  config.plugins.push(new webpack.HotModuleReplacementPlugin());

  const compiler = webpack(config);
  app.use(devMiddleware(compiler));
  app.use(hotMiddleware(compiler));
}

// app.get('/env.js', function (req, res) {
//   res.send(`window.ENV = ${JSON.stringify(env)}`);
// });

app.use(express.static('public'));

app.listen(port, function () {
  console.log(`UI started on port ${port}`);
});
