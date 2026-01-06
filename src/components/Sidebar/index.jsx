import React, { useState } from 'react';
import './Sidebar.css';

function Sidebar() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

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
          <a href="#">
            <span className="icon">⚙️</span>
            <span>버그</span>
          </a>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
