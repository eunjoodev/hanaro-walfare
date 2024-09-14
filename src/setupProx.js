const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://ec2-43-201-19-45.ap-northeast-2.compute.amazonaws.com:8080',
      changeOrigin: true,
      secure: false, // SSL/TLS 인증서 무시
      pathRewrite: {
        '^/api': '', // '/api' 경로를 제거하고 백엔드 서버로 요청을 보냅니다.
      },
      onProxyReq: (proxyReq, req, res) => {
        // 프록시 요청 커스터마이즈 (필요한 경우)
      },
    })
  );
};