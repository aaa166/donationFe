import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DonationItem from '../DonationItem';
import './DonationListDate.css';

const DonationListDate = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(4);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await axios.get('http://localhost:8081/api/donationsDate');
        setDonations(response.data);
      } catch (error) {
        console.error('데이터를 불러오는 중 오류 발생:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 4);
  };

  return (
    <div className="donation-list-date-container">
      <h3>마감 임박</h3>
      <div className="donation-list-date">
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

export default DonationListDate;