import React from 'react';
import './MainBanner.css';

const MainBanner = () => {
  return (
    <div className="main-banner-wrap">
      <div className="main-banner-content">
        <h2 className="main-banner-title">세상을 바꾸는 작은 기부</h2>
        <p className="main-banner-description">
          여러분의 따뜻한 마음이 모여 세상을 더 나은 곳으로 만듭니다.
        </p>
        <div className="main-banner-stats">
          <div className="main-banner-stat">
            <span className="stat-label">총 기부액</span>
            <span className="stat-value">1,234,567,890원</span>
          </div>
          <div className="main-banner-stat">
            <span className="stat-label">참여 횟수</span>
            <span className="stat-value">987,654회</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainBanner;
