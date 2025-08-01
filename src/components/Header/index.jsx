
import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <nav className="nav">
        <ul className="nav-list">
          <li className="nav-item"><Link to="/">기부</Link></li>
          <li className="nav-item"><Link to="/funding">펀딩</Link></li>
          <li className="nav-item"><Link to="/store">스토어</Link></li>
        </ul>
        <ul className="user-actions">
          <li className="user-action-item"><Link to="/login">로그인</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
