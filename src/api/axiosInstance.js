import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});


// 응답 인터셉터: 401 에러 시 토큰 갱신 로직
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // [핵심 수정] 리프레시 요청 자체가 401을 뱉으면 즉시 루프 종료 및 로그아웃
    if (error.response?.status === 401 && originalRequest.url.includes('/api/auth/refresh')) {
      console.warn('리프레시 토큰이 만료되었습니다. 로그아웃 합니다.');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // 일반 API 요청이 401인 경우 (토큰 만료 상황)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // 재시도 플래그 설정

      try {
        // 토큰 재발급 요청 (쿠키가 있으므로 바디에 넘기지 않아도 됨)
        await axios.post(`${API_BASE_URL}/api/auth/refresh`, {}, { withCredentials: true });

        // 다시 원래 요청 재시도 (새로 발급된 쿠키로 다시 요청)
        return api(originalRequest);
      } catch (refreshError) {
        // 재발급 시도 중 에러 발생 시 처리
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;