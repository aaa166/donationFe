import React from 'react';
import './DonationFilter.css';

const categories = [
  { id: 'all', name: '전체', code: 0 },
  { id: 'children', name: '아동·청소년', code: 1 },
  { id: 'seniors', name: '어르신', code: 2 },
  { id: 'disabled', name: '장애인', code: 3 },
  { id: 'home', name: '가정', code: 4 },
  { id: 'animals', name: '동물', code: 5 },
  { id: 'environment', name: '환경', code: 6 },
  { id: 'ect', name: '기타', code: 7 },
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
            onChange={() => onCategoryChange(category.code)}
          />
          <label htmlFor={category.id}>{category.name}</label>
        </div>
      ))}
    </div>
  );
};

export default DonationFilter;