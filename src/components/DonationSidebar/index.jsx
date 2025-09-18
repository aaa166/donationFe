// src/components/DonationSidebar.js
import React from 'react';

const DonationSidebar = ({ currentAmount, organization }) => {
  return (
    <aside className="donation-sidebar">
      <div className="sidebar-box">
        <h4>{organization}</h4>
        <p className="sidebar-amount">{currentAmount.toLocaleString()}원</p>
        <p>여러분의 참여로 함께 만들었어요!</p>
        <button className="donate-button">기부하기</button>
      </div>
    </aside>
  );
};

export default DonationSidebar;