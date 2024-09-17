const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://ec2-43-201-19-45.ap-northeast-2.compute.amazonaws.com:8080',
      changeOrigin: true,
      secure: false, 
      pathRewrite: {
        '^/api': '', 
      },
      onProxyReq: (proxyReq, req, res) => {
      },
    })
  );
};