import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import DonationListComponent from '../components/DonationList';
import DonationListDate from '../components/DonationListDate';
import DonationSearch from '../components/DonationSearch';
import DonationFilter from '../components/DonationFilter';
import './DonationList.css';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const categories = [
  { id: 'all', code: 0 },
  { id: 'children', code: 1 },
  { id: 'seniors', code: 2 },
  { id: 'disabled', code: 3 },
  { id: 'home', code: 4 },
  { id: 'animals', code: 5 },
  { id: 'environment', code: 6 },
  { id: 'ect', code: 7 },
];

const DonationList = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const query = useQuery();
  const searchTerm = query.get('q') || '';

  useEffect(() => {
    const fetchDonations = async () => {
      setLoading(true);
      try {
        const categoryCode = categories.find(c => c.id === selectedCategory)?.code ?? 0;
        console.log(categoryCode);
        const response = await axios.get('http://localhost:8081/api/public/donations', {
          params: { categoryId: categoryCode },
        });
        setDonations(response.data);

        
      } catch (error) {
        console.error('데이터를 불러오는 중 오류 발생:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, [selectedCategory]);

  const handleCategoryChange = (categoryId) => {
    // console.log("선택된 카테고리 ID:", categoryId);
    setSelectedCategory(categoryId);
  };

  const filteredDonations = donations
    .filter(donation =>
      donation.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    ;

  return (
    <div className="donation-list">
      <div className="page-content">
        <DonationFilter selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} />
        <DonationListComponent title="전체" donations={filteredDonations} titleLinkable={false} />
        <DonationSearch />
        <DonationListDate />
      </div>
    </div>
  );
};

export default DonationList;