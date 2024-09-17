const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api/local',
    createProxyMiddleware({
      target: process.env.REACT_APP_LOCAL_API_URL || 'http://localhost:3000',
      changeOrigin: true,
      pathRewrite: {
        '^/api/local': '',
      },
    })
  );

  app.use(
    '/api/proxy',
    createProxyMiddleware({
      target: process.env.REACT_APP_BACKEND_URL || 'http://ec2-43-201-19-45.ap-northeast-2.compute.amazonaws.com:8080',
      changeOrigin: true,
      pathRewrite: {
        '^/api/proxy': '', 
      },
    })
  );
};