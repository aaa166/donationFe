import React from 'react';
import ModernDonationItem from '../ModernDonationItem';
import './ModernDonationList.css';

const ModernDonationList = ({ donations }) => {
  return (
    <div className="modern-donation-list">
      {donations.map((donation) => (
        <ModernDonationItem key={donation.id} donation={donation} />
      ))}
    </div>
  );
};

export default ModernDonationList;
