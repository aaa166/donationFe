import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DonationItem from '../DonationItem';
import './DonationList.css';

const DonationList = ({ donations, title, titleLinkable = true }) => {
  const [visibleCount, setVisibleCount] = useState(4);

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 4);
  };

  return (
    <div className="donation-list-container">
      {title && (
        titleLinkable ? (
          <Link to="/donations" className="donation-list-title-link">
            <h3>{title}</h3>
          </Link>
        ) : (
          <h3>{title}</h3>
        )
      )}
      <div className="donation-list">
        {donations.slice(0, visibleCount).map((donation, index) => (
          <DonationItem key={index} donation={donation} />
        ))}
      </div>
      {visibleCount < donations.length && (
        <div className="load-more-container">
          <button onClick={handleLoadMore} className="load-more-button">
            더보기
          </button>
        </div>
      )}
    </div>
  );
};

export default DonationList;