import React, { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react'; // Optional: for icons
import './MainBanner.css';

const MainBanner = () => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const bannerBaseURL = "http://localhost:8081";

  useEffect(() => {
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

  useEffect(() => {
    if (banners.length <= 1 || !isPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners, isPlaying]);

  const handlePrev = (e) => {
    e.preventDefault();
    setCurrentIndex(prev => (prev - 1 + banners.length) % banners.length);
  };

  const handleNext = (e) => {
    e.preventDefault();
    setCurrentIndex(prev => (prev + 1) % banners.length);
  };

  if (banners.length === 0) {
    return <div className="main-banner-wrap empty">배너를 불러오는 중입니다...</div>;
  }

  const currentBanner = banners[currentIndex];

  return (
    <div className="main-banner-container">
      <div className="main-banner-wrap">
        <a href={currentBanner.bannerURL} target="_blank" rel="noopener noreferrer" className="banner-link">
          {/* Text Overlay - Happybean Style */}
          <div className="banner-text-overlay">
            {/* <span className="banner-btn">보기</span> */}
          </div>
          
          <img
            src={`${bannerBaseURL}${currentBanner.bannerImg}`} 
            alt={currentBanner.bannerTitle}
            className="main-banner-img"
          />
        </a>

        {/* Happybean Style Numeric Controller */}
        {banners.length > 1 && (
          <div className="banner-controls">
            <div className="control-pill">
              <span className="current-page">{String(currentIndex + 1).padStart(2, '0')}</span>
              <span className="total-page">/ {String(banners.length).padStart(2, '0')}</span>
              <div className="control-divider" />
              <button onClick={handlePrev} className="control-arrow"><ChevronLeft size={16} /></button>
              <button onClick={() => setIsPlaying(!isPlaying)} className="control-play">
                {isPlaying ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
              </button>
              <button onClick={handleNext} className="control-arrow"><ChevronRight size={16} /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainBanner;