import React from 'react';
import './DonationFilter.css';

const categories = [
  { id: 'all', name: '전체' },
  { id: 'children', name: '아동·청소년' },
  { id: 'seniors', name: '어르신' },
  { id: 'disabled', name: '장애인' },
  { id: 'home', name: '가정' },
  { id: 'animals', name: '동물' },
  { id: 'environment', name: '환경' },
  { id: 'ect', name: '기타' },
];

const DonationFilter = ({ selectedCategory, onCategoryChange }) => {
  return (
    <div className="donation-filter-container">
      {categories.map(category => (
        <div key={category.id} className="filter-radio-button">
          <input
            type="radio"
            id={category.id}
            name="category"
            value={category.id}
            checked={selectedCategory === category.id}
            onChange={() => onCategoryChange(category.id)}
          />
          <label htmlFor={category.id}>{category.name}</label>
        </div>
      ))}
    </div>
  );
};

export default DonationFilter;