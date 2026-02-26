import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8081',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: 모든 요청에 Access Token 주입
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: 401 에러 시 토큰 갱신 로직
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // [핵심 수정] 리프레시 요청 자체가 401을 뱉으면 즉시 루프 종료 및 로그아웃
    if (error.response?.status === 401 && originalRequest.url.includes('/api/auth/refresh')) {
      console.warn('리프레시 토큰이 만료되었습니다. 로그아웃 합니다.');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login'; 
      return Promise.reject(error);
    }

    // 일반 API 요청이 401인 경우 (토큰 만료 상황)
    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        originalRequest._retry = true; // 재시도 플래그 설정

        try {
          // 토큰 재발급 요청 (기본 axios 사용 권장)
          const res = await axios.post('http://localhost:8081/api/auth/refresh', { 
            refreshToken 
          });

          const { accessToken } = res.data;
          localStorage.setItem('accessToken', accessToken);

          // 실패했던 원래 요청의 헤더를 새 토큰으로 교체 후 재전송
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
          return api(originalRequest); 
        } catch (refreshError) {
          // 재발급 시도 중 에러 발생 시 처리
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        // 리프레시 토큰조차 없는 경우
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;