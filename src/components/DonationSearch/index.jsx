import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DonationSearch.css';

const DonationSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate(`/donations?q=${searchTerm}`);
  };

  return (
    <div className="donation-search-container">
      <input
        type="text"
        placeholder="검색어를 입력하세요"
        className="donation-search-input"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button className="donation-search-button" onClick={handleSearch}>검색</button>
    </div>
  );
};

export default DonationSearch;