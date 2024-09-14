const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  "https://hanaro-walfare1.vercel.app",
  "https://hanaro-walfare.vercel.app"
];

const corsOptions = {
  origin: function (origin, callback) { 
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// 백엔드 API 프록시 설정
app.use(
  "/api",
  createProxyMiddleware({
    target: "http://ec2-43-201-19-45.ap-northeast-2.compute.amazonaws.com:8080",
    changeOrigin: true,
    pathRewrite: {
      "^/api": "", // 프록시로 요청 보낼 때 '/api'를 제거
    },
  }),
);

// 예제 라우트
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
