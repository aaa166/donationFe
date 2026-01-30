import React, { useState, useEffect } from 'react';
import './Sidebar.css';

function Sidebar() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(() => {
    const savedState = localStorage.getItem('isSidebarVisible');
    return savedState !== null ? JSON.parse(savedState) : false;
  });

  useEffect(() => {
    localStorage.setItem('isSidebarVisible', JSON.stringify(isSidebarVisible));
  }, [isSidebarVisible]);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  if (!isSidebarVisible) {
    return (
      <button onClick={toggleSidebar} className="sidebar-toggle-button open">
        ☰
      </button>
    );
  }

  return (
    <div className="sidebar">
      <button onClick={toggleSidebar} className="sidebar-toggle-button close">
        X 
      </button>
      <h2>관 리</h2>
      <ul>
        <li>
          <a href="/userState">
            <span className="icon">👤</span>
            <span>유저</span>
          </a>
        </li>
        <li>
          <a href="/donationState">
            <span className="icon">❤️</span>
            <span>캠페인</span>
          </a>
        </li>
        <li>
          <a href="/report">
            <span className="icon">🏠</span>
            <span>신고</span>
          </a>
        </li>
        <li>
          <a href="/insertBanner">
            <span className="icon">⚙️</span>
            <span>배너 추가</span>
          </a>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
