
import React from 'react';
import { Link } from 'react-router-dom'; 
import './DonationItem.css';

const DonationItem = ({ donation }) => {
  console.log(donation);
  return (
    <Link to={`/donations/${donation.donationNo}`} className="donation-item-link">
      <div className="donation-item">
        <img 
          src={donation.image
                ? donation.image.startsWith('http')
                    ? donation.image
                    : `http://localhost:8081${donation.image}`
                : '/images/default.png' // 이미지가 없을 때 기본 이미지
              } 
          alt={donation.title || 'Donation Image'} 
          className="donation-image" 
        />
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