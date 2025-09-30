import React, { useState } from 'react';
import './MyPage.css';

const MyPage = () => {
  const [activeTab, setActiveTab] = useState('home'); // 기본 탭을 'home'으로 설정

  // Placeholder data
  const userInfo = {
    name: 'dodo',
    beans: 120,
    totalDonation: 150000,
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <div className="tab-pane">환영합니다! 여기는 마이홈입니다. 활동 내역을 확인해보세요.</div>;
      case 'donations':
        return <div className="tab-pane">나의 기부 내역이 여기에 표시됩니다.</div>;
      default:
        return null;
    }
  };

  return (
    <div className="mypage-container">
      <div className="profile-summary">
        <div className="profile-info">
          {/* <img src="https://ssl.pstatic.net/static/pwe/member/img_profile.png" alt="profile" /> */}
          <h2>{userInfo.name}님</h2>
        </div>
        <div className="donation-summary">
          <div>
            <p>보유 콩</p>
            <span>{userInfo.beans.toLocaleString()}개</span>
          </div>
          <div>
            <p>총 기부금액</p>
            <span>{userInfo.totalDonation.toLocaleString()}원</span>
          </div>
        </div>
      </div>

      <div className="mypage-tabs">
        <button
          className={`tab-button ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => setActiveTab('home')}
        >
          마이홈
        </button>
        <button
          className={`tab-button ${activeTab === 'donations' ? 'active' : ''}`}
          onClick={() => setActiveTab('donations')}
        >
          나의 기부
        </button>
      </div>

      <div className="tab-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default MyPage;
