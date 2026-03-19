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
    // 보안을 위해 실제 토큰값은 쿠키에 있고, 프론트엔드는 단순 플래그만 확인
    const loggedInFlag = localStorage.getItem('isLoggedIn');

    if (loggedInFlag !== 'true') {
      setIsLoggedIn(false);
      setIsAdmin(false);
      return;
    }

    try {
      // 쿠키가 자동 전송되므로 mypage를 호출해 유효성 검증 및 정보 획득
      const res = await api.get('/api/mypage');
      setIsLoggedIn(true);
      const role = res.data.userRole; 
      setIsAdmin(role === 'ROLE_ADMIN' || role === 0 || role === 'admin'); 
    } catch (error) {
      console.error('인증 체크 중 오류(토큰 만료 등):', error);
      handleLogout(false);
    }
  };

  // 로그아웃 함수
  const handleLogout = async (redirect = true) => {
    try {
      // 백엔드에 로그아웃 요청하여 쿠키 제거
      await api.post('/api/auth/logout');
    } catch (error) {
      console.error('로그아웃 요청 에러:', error);
    }

    localStorage.removeItem('isLoggedIn');
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
      {isAdmin && <Sidebar />}
    </div>
  );
}

export default App;
