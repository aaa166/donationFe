// App.jsx
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const checkTokenExpiration = () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      setIsLoggedIn(false);
      setIsAdmin(false);
      return false;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000;

      if (Date.now() > exp) {
        handleLogout(); // 만료 시 로그아웃 처리
        return false;
      }

      setIsLoggedIn(true);
      setIsAdmin(payload.role === 'admin');
      return true;
    } catch (error) {
      console.error('토큰 확인 중 오류 발생:', error);
      handleLogout();
      return false;
    }
  };

  // 로그아웃 함수
  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    setIsLoggedIn(false);
    setIsAdmin(false);
    navigate('/');
  };

  // 새로고침/마운트 시 토큰 체크
  useEffect(() => {
    checkTokenExpiration();

    const interval = setInterval(() => {
      checkTokenExpiration();
    }, 60000);

    return () => clearInterval(interval);
  }, [navigate]);

  // 로그인 직후 상태 반영
  useEffect(() => {
    if (isLoggedIn) {
      const token = localStorage.getItem('jwtToken');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setIsAdmin(payload.role === 'admin');
      }
    }
  }, [isLoggedIn]);

  return (
    <div className="app-container">
      <Header
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        handleLogout={handleLogout} // Header에서 로그아웃 버튼 사용
      />
      <div className="main-wrapper">
        <main className="main-content">
          <Outlet context={{ isLoggedIn, setIsLoggedIn, isAdmin, setIsAdmin }} />
        </main>
      </div>
      {isAdmin && <Sidebar />}
    </div>
  );
}

export default App;
