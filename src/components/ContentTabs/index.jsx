// src/components/ContentTabs.js
import React from 'react';

const ContentTabs = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="content-tabs">
      <button
        className={activeTab === 'story' ? 'active' : ''}
        onClick={() => setActiveTab('story')}
      >
        스토리
      </button>
      <button
        className={activeTab === 'reviews' ? 'active' : ''}
        onClick={() => setActiveTab('reviews')}
      >
        후기
      </button>
      <button
        className={activeTab === 'info' ? 'active' : ''}
        onClick={() => setActiveTab('info')}
      >
        기본정보
      </button>
    </nav>
  );
};

export default ContentTabs;