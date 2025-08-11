import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import DonationList from '../components/DonationList';

const DonationPage = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await axios.get('http://localhost:8081/api/donations');
        setDonations(response.data);
      } catch (error) {
        console.error('데이터를 불러오는 중 오류 발생:', error);
      } finally {
        setLoading(false);
      }
    };

  fetchDonations();
}, []);

  return (
    <div>
      <Header />
      <h3>전달하는 기부</h3>
      <DonationList donations={donations.slice(0, 4)} />
    </div>
  );
};

export default DonationPage;