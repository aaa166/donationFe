import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import api from './api/axiosInstance';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // 현재 경로

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
        const payload = JSON.parse(atob(accessToken.split('.')[1]));
        const exp = payload.exp * 1000;

        if (Date.now() > exp && refreshToken) {
          await refreshAccessToken(refreshToken);
        } else if (Date.now() < exp) {
          setIsLoggedIn(true);
          setIsAdmin(payload.role === 'admin');
        } else {
          handleLogout(false); // 새로고침 시 홈 이동 없이 상태만 초기화
        }
      } else if (refreshToken) {
        await refreshAccessToken(refreshToken);
      }
    } catch (error) {
      console.error('토큰 체크 중 오류:', error);
      handleLogout(false);
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
      handleLogout(false); // 상태만 초기화
    }
  };

  // 로그아웃 함수
  const handleLogout = (redirect = true) => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsLoggedIn(false);
    setIsAdmin(false);

    // redirect true일 때만 홈으로 이동
    if (redirect) {
      navigate('/'); // 로그아웃 버튼 클릭 시 홈으로 이동
    }
  };

  // 마운트 시 & 새로고침 시 토큰 체크
  useEffect(() => {
    checkToken();

    const interval = setInterval(() => {
      checkToken();
    }, 60000); // 1분마다 토큰 확인

    return () => clearInterval(interval);
  }, [location.key]); // 새로고침 시 effect 실행

  return (
    <div className="app-container">
      <Header
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        handleLogout={() => handleLogout(true)} // 버튼 클릭 시 홈으로 이동
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
