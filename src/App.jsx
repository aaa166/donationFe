import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import api from './api/axiosInstance'; // Axios 인터셉터 사용
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  // 토큰 확인 및 상태 세팅
  const checkToken = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (!accessToken && !refreshToken) {
      setIsLoggedIn(false);
      setIsAdmin(false);
      return;
    }

    try {
      if (accessToken) {
        // accessToken이 있으면 payload 확인
        const payload = JSON.parse(atob(accessToken.split('.')[1]));
        const exp = payload.exp * 1000;

        if (Date.now() > exp && refreshToken) {
          // accessToken 만료 → refreshToken으로 갱신
          await refreshAccessToken(refreshToken);
        } else if (Date.now() < exp) {
          setIsLoggedIn(true);
          setIsAdmin(payload.role === 'admin');
        } else {
          handleLogout();
        }
      } else if (refreshToken) {
        // accessToken 없고 refreshToken만 있으면 갱신 시도
        await refreshAccessToken(refreshToken);
      }
    } catch (error) {
      console.error('토큰 체크 중 오류:', error);
      handleLogout();
    }
  };

  // accessToken 재발급
  const refreshAccessToken = async (refreshToken) => {
    try {
      const res = await api.post('/api/auth/refresh', { refreshToken });
      localStorage.setItem('accessToken', res.data.accessToken);
      const payload = JSON.parse(atob(res.data.accessToken.split('.')[1]));
      setIsLoggedIn(true);
      setIsAdmin(payload.role === 'admin');
    } catch (error) {
      console.error('토큰 갱신 실패:', error);
      handleLogout();
    }
  };

  // 로그아웃 함수
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsLoggedIn(false);
    setIsAdmin(false);
    navigate('/');
  };

  // 새로고침/마운트 시 토큰 체크
  useEffect(() => {
    checkToken();

    const interval = setInterval(() => {
      checkToken();
    }, 60000); // 1분마다 토큰 확인

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app-container">
      <Header
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        handleLogout={handleLogout}
      />
      <div className="main-wrapper">
        <main className="main-content">
          <Outlet context={{ isLoggedIn, setIsLoggedIn, isAdmin, setIsAdmin }} />
        </main>
      </div>
      <Sidebar isAdmin={isAdmin} />
    </div>
  );
}

export default App;
