import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import DonationList from '../components/DonationList';
import DonationListDate from '../components/DonationListDate';
import DonationSearch from '../components/DonationSearch';
import DonationFilter from '../components/DonationFilter';
import './DonationListPage.css';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const DonationListPage = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const query = useQuery();
  const searchTerm = query.get('q') || '';

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await axios.get('http://localhost:8081/api/donations');
        // NOTE: Assuming donation objects have a 'category' field like: { ..., category: 'children' }
        setDonations(response.data);
      } catch (error) {
        console.error('데이터를 불러오는 중 오류 발생:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const filteredDonations = donations
    .filter(donation =>
      donation.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(donation => {
      if (selectedCategory === 'all') {
        return true;
      }
      // NOTE: This assumes donation.category exists and is a string
      return donation.category === selectedCategory;
    });

  return (
    <div className="donation-list-page">
      <Header />
      <DonationFilter selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} />
      <DonationList title="전체" donations={filteredDonations} titleLinkable={false} />
      <DonationSearch />
      <DonationListDate />
    </div>
  );
};

export default DonationListPage;