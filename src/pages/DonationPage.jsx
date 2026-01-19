import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosInstance'; // Axios 인스턴스 사용
import DonationList from '../components/DonationList';
import './DonationPage.css';

const DonationPage = () => {
  const [role, setRole] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const response = await api.get('/api/user/role'); // 인터셉터가 자동으로 토큰 추가
        setRole(response.data); // 예: "ROLE_ADMIN" 또는 "ROLE_USER"
        console.log('받은 역할:', response.data);
      } catch (error) {
        console.error('역할 데이터를 불러오는 중 오류 발생:', error);
        setRole('ROLE_USER'); // 기본값: 일반 사용자
      }
    };

    const fetchDonations = async () => {
      try {
        const response = await api.get('/api/public/donations');
        setDonations(response.data);
      } catch (error) {
        console.error('데이터를 불러오는 중 오류 발생:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
    fetchDonations();
  }, []);

  if (loading) {
    return <div>데이터를 불러오는 중입니다...</div>;
  }

  const isAdmin = role === 'ROLE_ADMIN';

  return (
    <div className="donation-page-wrap">
      <DonationList title="전달하는 기부" donations={donations.slice(0, 4)} />

      <Link to="/donationApply" className="donationApply">
        기부 신청
      </Link>

      {isAdmin && (
        <div id="managerDiv">
          <Link to="/donationState" className="donationState">
            캠페인 관리
          </Link>
        </div>
      )}
    </div>
  );
};

export default DonationPage;
