import React from 'react';
import './DonationItem.css';

const DonationItem = ({ donation }) => {
  return (
    <div className="donation-item">
      <img src={donation.image} alt={donation.title} className="donation-image" />
      <div className="donation-info">
        <h3 className="donation-title">{donation.title}</h3>
        <p className="donation-organization">{donation.organization}</p>
        <p className="donation-deadline">마감일: {new Date(donation.donationDeadlineDate).toLocaleDateString()}</p>
        <div className="progress-bar">
          <div className="progress" style={{ width: `${donation.progress}%` }}></div>
        </div>
        <p className="donation-amount">{donation.amount.toLocaleString()}원</p>
      </div>
    </div>
  );
};

export default DonationItem;