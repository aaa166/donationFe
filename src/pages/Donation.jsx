import React, { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import DonationList from '../components/DonationList';
import MainBanner from '../components/MainBanner';
import './Donation.css';

const Donation = () => {
  const [role, setRole] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const urlAccessToken = params.get('accessToken');
        const urlRefreshToken = params.get('refreshToken');

        if (urlAccessToken && urlRefreshToken) {
          localStorage.setItem('accessToken', urlAccessToken);
          localStorage.setItem('refreshToken', urlRefreshToken);
          
          api.defaults.headers.common['Authorization'] = `Bearer ${urlAccessToken}`;

          window.history.replaceState({}, document.title, window.location.pathname);
        }

        const currentToken = localStorage.getItem('accessToken');

        if (currentToken) {
          try {
            const res = await api.get('/api/user/role');
            setRole(res.data);
          } catch (err) {
            console.error('역할 조회 실패:', err);
            setRole(-1);
          }
        } else {
          setRole(-1);
        }

        const donationRes = await api.get('/api/public/donations');
        setDonations(donationRes.data);

      } catch (err) {
        console.error('데이터 로딩 오류:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>데이터를 불러오는 중입니다...</div>;

  return (
    <div className="donation-wrap">
      <MainBanner />
      <DonationList title="전달하는 기부" donations={donations.slice(0, 4)} />
    </div>
  );
};

export default Donation;