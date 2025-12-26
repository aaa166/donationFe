import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import DonationList from '../components/DonationList';
import './Donation.css';

const Donation = () => {
  const [role, setRole] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      const token = localStorage.getItem('jwtToken'); 
      const config = {
          headers: {
              'Authorization': token ? `Bearer ${token}` : ''
          }
      };

      try {
          const response = await axios.get(`http://localhost:8081/api/public/role`,config);
          setRole(response.data); 
          console.log('받은 역할:', response.data);
      } catch (error) {
          console.error('역할 데이터를 불러오는 중 오류 발생:', error);
          setRole(-1); 
      }
    };

    const fetchDonations = async () => {
      try {
        const response = await axios.get('http://localhost:8081/api/public/donations');
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

  if (loading || role === null) {
    return <div>데이터를 불러오는 중입니다...</div>;
  }
  
  return (
    <div className="donation-wrap">
      <DonationList title="전달하는 기부>" donations={donations.slice(0, 4)} />

      <Link to="/donationApply" className="donationApply">
        기부 신청
      </Link>

      {role === 0 && (
        <div id="managerDiv">
          <Link to="/donationState" className="donationStatus">
            캠페인 관리
          </Link>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Link to="/userState" className="userStatus">
            유저 관리
          </Link>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Link to="/" className="donationStatus">
            신고 관리
          </Link>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Link to="/" className="donationStatus">
            문의/버그 관리
          </Link>
          <li>
            공유
          </li>
        </div>
      )}
    </div>
  );
};

export default Donation;
