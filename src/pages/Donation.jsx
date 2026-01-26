import React, { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import { Link } from 'react-router-dom';
import DonationList from '../components/DonationList';
import './Donation.css';

const Donation = () => {
  const [role, setRole] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await api.get('/api/user/role');
        setRole(res.data);
        console.log('받은 역할:', res.data);
      } catch (error) {
        console.error('역할 데이터를 불러오는 중 오류:', error);
        setRole(-1);
      }
    };

    const fetchDonations = async () => {
      try {
        const res = await api.get('/api/public/donations');
        setDonations(res.data);
      } catch (error) {
        console.error('기부 데이터 로딩 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
    fetchDonations();
  }, []);

  if (loading || role === null) {
    return <div>데이터를 불러오는 중입니다...</div>;
  }
  
  return (
    <div className="donation-wrap">
      <DonationList title="전달하는 기부>" donations={donations.slice(0, 4)} />

      {role === 0 && (
        <div id="managerDiv">
          <Link to="/userState" className="userStatus">유저 관리</Link>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Link to="/donationState" className="donationStatus">캠페인 관리</Link>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Link to="/report" className="report">신고 관리</Link>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Link to="/" className="donationStatus">문의/버그 관리</Link>
        </div>
      )}
    </div>
  );
};

export default Donation;
