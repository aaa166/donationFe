// src/components/ProgressBar.js
import React from 'react';

const ProgressBar = ({ current, target, participants }) => {
  const percentage = Math.round((current / target) * 100);

  return (
    <div className="progress-bar-container">
      <div className="progress-info">
        <span className="percentage">{percentage}%</span>
        <span className="current-amount">{current.toLocaleString()}원</span>
        <span className="participants">{participants.toLocaleString()}명 참여</span>
      </div>
      <div className="progress-bar-background">
        <div className="progress-bar-fill" style={{ width: `${Math.min(percentage, 100)}%` }}></div>
      </div>
    </div>
  );
};

export default ProgressBar;