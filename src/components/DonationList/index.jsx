import React from 'react';
import DonationItem from '../DonationItem';
import './DonationList.css';

const DonationList = ({ donations }) => {
  return (
    <div className="donation-list">
      {donations.map((donation, index) => (
        <DonationItem key={index} donation={donation} />
      ))}
    </div>
  );
};

export default DonationList;