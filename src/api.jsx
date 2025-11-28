import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8081/api',
});

// 요청 전 토큰 만료 확인
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (Date.now() > payload.exp * 1000) {
        localStorage.removeItem('jwtToken');
        window.location.href = '/'; // 세션 만료 시 홈으로 이동
        alert('로그인 세션이 만료되었습니다.');
        return Promise.reject('토큰 만료');
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
