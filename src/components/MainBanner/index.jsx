import React, { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import './MainBanner.css';

const MainBanner = () => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const bannerBaseURL = "http://localhost:8081";

  useEffect(() => {
    // 배너 데이터 가져오기
    const fetchBanners = async () => {
      try {
        const res = await api.get('/api/public/mainBanner');
        setBanners(res.data);
      } catch (err) {
        console.error('배너 데이터 로딩 오류:', err);
      }
    };

    fetchBanners();
  }, []);

  // 5초마다 자동 슬라이드
  useEffect(() => {
    if (banners.length <= 1) return; // 배너가 1개 이하이면 자동 슬라이드 필요 없음
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % banners.length);
      console.log(`${bannerBaseURL}${currentBanner.bannerImg}`);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners]);

  if (banners.length === 0) {
    return <div className="main-banner-wrap">배너가 없습니다.</div>;
  }

  const currentBanner = banners[currentIndex];

  return (
    <div className="main-banner-wrap">
      <a href={currentBanner.bannerURL} target="_blank" rel="noopener noreferrer">
        <img
          src={`${bannerBaseURL}${currentBanner.bannerImg}`} 
          alt={currentBanner.bannerTitle}
          className="main-banner-img"
        />
      </a>

      {/* 슬라이드 인디케이터 */}
      {banners.length > 1 && (
        <div className="banner-indicator">
          {banners.map((_, idx) => (
            <span
              key={idx}
              className={idx === currentIndex ? 'active' : ''}
              onClick={() => setCurrentIndex(idx)}
            ></span>
          ))}
        </div>
      )}
    </div>
  );
};

export default MainBanner;
