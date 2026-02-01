import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8081',
  // multipart/form-data 자동 인식
  headers: {
    'Content-Type': 'application/json', // 기본값
  },
});

// 🔹 요청 인터셉터: accessToken 자동 부착
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // FormData 요청이면 Content-Type 제거 → 브라우저가 boundary 자동 설정
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 🔹 응답 인터셉터: 401 → refreshToken 재발급 후 재요청
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 토큰 만료 & 첫 재시도
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        try {
          // refreshToken 요청
          const res = await api.post('/api/auth/refresh', { refreshToken });
          const newAccessToken = res.data.accessToken;

          // 로컬 스토리지 갱신
          localStorage.setItem('accessToken', newAccessToken);

          // 기존 요청 헤더 업데이트 후 재요청
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return api(originalRequest); // 반드시 api 인스턴스로 재요청
        } catch (err) {
          console.error('Refresh Token 재발급 실패:', err);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
      } else {
        // refreshToken 없으면 로그인 페이지로
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
