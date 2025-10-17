import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header'; 

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div>
      {/* 3. Header에게는 현재 로그인 '상태 값'을 prop으로 전달합니다. */}
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      
      <main>
        {/* 4. 페이지 컴포넌트들에게는 상태를 '변경하는 함수'를 context로 전달합니다. */}
        <Outlet context={{ isLoggedIn, setIsLoggedIn }} />
      </main>
    </div>
  );
}

export default App;