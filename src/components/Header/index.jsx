// Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = ({ isLoggedIn, handleLogout }) => { // App에서 전달된 handleLogout 사용
  return (
    <header className="header">
      <nav className="nav">
        <ul className="nav-list">
          <li className="nav-item"><Link to="/">홈</Link></li>
          <li className="nav-item"><Link to="/">문의</Link></li>
          <li className="nav-item"><Link to="/donationApply" className="donationApply">기부 신청</Link></li>
        </ul>
        <ul className="user-actions">
          {isLoggedIn ? (
            <>
              <li className="user-action-item">
                <Link to="/my">마이페이지</Link>
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
