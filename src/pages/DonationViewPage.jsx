// src/App.js
import React, { useState } from 'react';
import './DonationViewPage.css';
import Header from '../components/Header';
import ProgressBar from '../components/ProgressBar';
import ContentTabs from '../components/ContentTabs';
import StoryContent from '../components/StoryContent';
import ReviewList from '../components/ReviewList';
import BasicInfo from '../components/BasicInfo';
import DonationSidebar from '../components/DonationSidebar';

function App() {
  const [activeTab, setActiveTab] = useState('story');

  // API로부터 받아왔다고 가정하는 데이터
  const donationData = {
    title: '[긴급모금] 튀르키예·시리아 지진피해 아동 긴급구호',
    tags: ['#긴급구호', '#지구촌'],
    imageUrl: 'https://via.placeholder.com/800x400', // 예시 이미지 URL
    organization: '유니세프한국위원회',
    currentAmount: 111483730,
    targetAmount: 1000000000,
    participantCount: 135110,
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'story':
        return <StoryContent />;
      case 'reviews':
        return <ReviewList />;
      case 'info':
        return <BasicInfo organization={donationData.organization} />;
      default:
        return <StoryContent />;
    }
  };

  return (
    <div>
      <Header />
      <div className="container">
        <main className="main-content">
          <ProgressBar
            current={donationData.currentAmount}
            target={donationData.targetAmount}
            participants={donationData.participantCount}
            />
          <div className="action-buttons">
            <button className="donate-button main">참여하기</button>
            <button className="share-button">공유</button>
          </div>
          <ContentTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="content-section">
            {renderContent()}
          </div>
        </main>
        <DonationSidebar
          currentAmount={donationData.currentAmount}
          organization={donationData.organization}
          />
      </div>
    </div>
  );
}

export default App;