
import React from 'react';
import { Link } from 'react-router-dom'; 
import './DonationItem.css';

const DonationItem = ({ donation }) => {
  return (
    <Link to={`/donations/${donation.donationNo}`} className="donation-item-link">
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
    </Link>
  );
};

export default DonationItem;