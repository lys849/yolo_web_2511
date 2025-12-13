import axios from 'axios';

const client = axios.create({
  baseURL: "http://localhost:8000",   // 你的 FastAPI 后端地址
  timeout: 10000,
});

export default client;
