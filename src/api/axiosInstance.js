import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8081',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 공개 API인지 체크
    const isPublicAPI = originalRequest.url.startsWith('/api/public');

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        try {
          const res = await api.post('/api/auth/refresh', { refreshToken });
          const newAccessToken = res.data.accessToken;
          localStorage.setItem('accessToken', newAccessToken);
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (err) {
          console.error('Refresh Token 재발급 실패:', err);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');

          // 공개 API면 리다이렉트 안 함
          if (!isPublicAPI) window.location.href = '/login';
        }
      } else {
        if (!isPublicAPI) window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
