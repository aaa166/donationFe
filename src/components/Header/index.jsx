
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <header className="header">
      <nav className="nav">
        <ul className="nav-list">
          <li className="nav-item"><Link to="/">기부</Link></li>
          <li className="nav-item"><Link to="/funding">펀딩</Link></li>
          <li className="nav-item"><Link to="/store">스토어</Link></li>
        </ul>
        <ul className="user-actions">
          <li className="search-bar">
            <input type="text" placeholder="검색어를 입력하세요" />
            <button className="search-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="16"
                fill="currentColor"
                className="bi bi-search"
                viewBox="0 0 16 16"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
              </svg>
            </button>
          </li>
          <li className="user-action-item">
            {isLoggedIn ? (
              <Link to="/myinfo">내 정보</Link>
            ) : (
              <Link to="/login">로그인</Link>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
