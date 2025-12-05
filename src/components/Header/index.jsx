import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');

    setIsLoggedIn(false);

    navigate('/');
  };

  return (
    <header className="header">
      <nav className="nav">
        <ul className="nav-list">
          <li className="nav-item"><Link to="/">홈</Link></li>
          <li className="nav-item"><Link to="/funding">펀딩</Link></li>
          <li className="nav-item"><Link to="/store">스토어</Link></li>
        </ul>
        <ul className="user-actions">
          {isLoggedIn ? (
            <>
              <li className="user-action-item">
                <Link to="/mypage">마이페이지</Link>
              </li>
              <li className="user-action-item">
                <button onClick={handleLogout} className="logout-button">로그아웃</button>
              </li>
            </>
          ) : (
            <li className="user-action-item">
              <Link to="/login">로그인</Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
