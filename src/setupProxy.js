const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // backendUrl 상수를 정의하여 환경 변수 또는 기본 URL을 사용하게 합니다.
  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://43.201.19.45:8080';

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
      target: backendUrl,
      changeOrigin: true,
      pathRewrite: {
        '^/api/proxy': '',
      },
    })
  );
};