import React, { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import DonationList from '../components/DonationList';
import MainBanner from '../components/MainBanner';
import './Donation.css';

const Donation = () => {
  const [role, setRole] = useState(null);       // 사용자 역할
  const [donations, setDonations] = useState([]); // 기부 목록
  const [loading, setLoading] = useState(true);   // 로딩 상태

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 로그인 여부 확인
        const accessToken = localStorage.getItem('accessToken');

        // 로그인 되어 있으면 역할 조회
        if (accessToken) {
          try {
            const res = await api.get('/api/user/role');
            setRole(res.data);
            console.log('받은 역할:', res.data);
          } catch (err) {
            console.error('역할 데이터 로딩 오류:', err);
            setRole(-1); // 오류나 401이면 비로그인 상태 처리
          }
        } else {
          setRole(-1); // 로그인 안 되어 있음
        }

        // 기부 목록은 공개 API이므로 항상 호출
        const donationRes = await api.get('/api/public/donations');
        setDonations(donationRes.data);
      } catch (err) {
        console.error('기부 데이터 로딩 오류:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 로딩 중
  if (loading) return <div>데이터를 불러오는 중입니다...</div>;

  // // 로그인 필요 안내
  // if (role === -1) return (
  //   <div className="donation-wrap">
  //     <MainBanner />
  //     <div className="login-warning">
  //       로그인이 필요합니다. <a href="/login">로그인 페이지로 이동</a>
  //     </div>
  //     {/* 기부 목록은 공개이므로 보여줄 수 있음 */}
  //     <DonationList title="전달하는 기부" donations={donations.slice(0, 4)} />
  //   </div>
  // );

  return (
    <div className="donation-wrap">
      <MainBanner />
      <DonationList title="전달하는 기부" donations={donations.slice(0, 4)} />
    </div>
  );
};

export default Donation;
