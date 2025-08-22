import React from 'react';
import './ModernDonationItem.css';

const ModernDonationItem = ({ donation }) => {
  const { title, description, imageUrl, raisedAmount, targetAmount, supporters } = donation;
  const progress = (raisedAmount / targetAmount) * 100;

  return (
    <div className="modern-donation-item">
      <div className="item-image">
        <img src={imageUrl} alt={title} />
      </div>
      <div className="item-content">
        <h3>{title}</h3>
        <p>{description}</p>
        <div className="progress-bar">
          <div className="progress" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="item-stats">
          <div className="stat">
            <strong>{raisedAmount.toLocaleString()}원</strong>
            <span>모인 금액</span>
          </div>
          <div className="stat">
            <strong>{supporters.toLocaleString()}명</strong>
            <span>참여</span>
          </div>
          <div className="stat">
            <strong>{Math.floor(progress)}%</strong>
            <span>달성률</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernDonationItem;
