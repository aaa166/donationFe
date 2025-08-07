import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import DonationList from '../components/DonationList';

// const DonationPage = () => {
//   const donations = [
//     {
//       title: '하루도 쉬지 않고 사고 현장을 지키는 소방관',
//       organization: '세이브더칠드런',
//       progress: 95,
//       amount: 9715324,
//       image: 'assets/donation/img/firefighter-1.jpg',
//     },
//     {
//       title: '독거노인을 위한 겨울나기 용품 지원',
//       organization: '굿네이버스',
//       progress: 50,
//       amount: 543210,
//       image: 'https://via.placeholder.com/250x150',
//     },
//   ];

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
      <div>
        기부
      </div>
      <DonationList donations={donations.slice(0, 4)} />
    </div>
  );
};

export default DonationPage;