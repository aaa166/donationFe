import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8081',
});

// 요청 인터셉터: accessToken 자동 부착
api.interceptors.request.use(
  async config => {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers['Authorization'] = `Bearer ${token}`;
    return config;
  },
  error => Promise.reject(error)
);

// 응답 인터셉터: 401 → refreshToken 재발급
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        try {
          const res = await axios.post('http://localhost:8081/api/auth/refresh', { refreshToken });
          localStorage.setItem('accessToken', res.data.accessToken);
          originalRequest.headers['Authorization'] = `Bearer ${res.data.accessToken}`;
          return axios(originalRequest); // 토큰 재발급 후 원래 요청 재시도
        } catch (err) {
          console.error('Refresh Token 재발급 실패:', err);
          // 여기서 바로 localStorage 삭제하지 않고 alert만
          alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
