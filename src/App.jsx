import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from './components/Header';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // JWT 만료 확인 함수
  const checkTokenExpiration = () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // JWT payload 디코딩
      const exp = payload.exp * 1000; // ms 단위로 변환
      if (Date.now() > exp) {
        localStorage.removeItem('jwtToken');
        setIsLoggedIn(false);
        alert('로그인 세션이 만료되었습니다.');
        navigate('/'); // 홈으로 이동
        return false;
      }
      return true;
    } catch (error) {
      console.error('토큰 확인 중 오류 발생:', error);
      localStorage.removeItem('jwtToken');
      setIsLoggedIn(false);
      return false;
    }
  };

  useEffect(() => {
    const tokenValid = checkTokenExpiration();
    setIsLoggedIn(tokenValid);

    // 1분마다 자동 체크
    const interval = setInterval(() => {
      checkTokenExpiration();
    }, 60000);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div>
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <main>
        <Outlet context={{ isLoggedIn, setIsLoggedIn }} />
      </main>
    </div>
  );
}

export default App;
