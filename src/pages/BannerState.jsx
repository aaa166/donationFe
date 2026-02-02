import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import {
  Plus,
  Search,
  MoreVertical,
  ExternalLink,
  Layout,
  Grid,
  Megaphone,
  Bell,
  Clock,
  Maximize
} from 'lucide-react';
import './BannerState.css';

const BannerState = () => {
  const navigate = useNavigate();
  const [banners, setBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBanners = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/api/admin/bannerState');
      setBanners(res.data);
    } catch (err) {
      console.error('배너 조회 실패:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  return (
    <div className="banner-gallery-container">
      {/* Top Nav */}
      <nav className="top-nav">
        <div className="nav-left">
          <div className="logo-box">
            <div className="logo-icon">
              <Layout size={20} color="white" />
            </div>
            <span className="logo-text">배너 갤러리</span>
          </div>

          <div className="search-wrapper">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="배너 검색..." />
          </div>
        </div>

        <div className="nav-right">
          <button className="nav-item active"><Layout size={18} /> 비주얼</button>
          <button className="nav-item"><Grid size={18} /> 대시보드</button>
          <button className="nav-item"><Megaphone size={18} /> 캠페인</button>
          <div className="nav-divider" />
          <button className="icon-only-btn"><Bell size={20} /></button>
        </div>
      </nav>

      {/* Main */}
      <main className="gallery-main">
        <div className="content-inner">
          <header className="header-title-row">
            <div>
              <h1>비주얼 에셋</h1>
              <p>현재 등록된 배너 {banners.length}개</p>
            </div>
            <button
              className="btn-add-primary"
              onClick={() => navigate('/admin/banners/add')}
            >
              <Plus size={20} /> 새 배너 등록
            </button>
          </header>

          <div className="banner-feed">
            {isLoading ? (
              <div className="loading-state">데이터 불러오는 중...</div>
            ) : banners.length === 0 ? (
              <div className="loading-state">등록된 배너가 없습니다.</div>
            ) : (
              banners.map(banner => {
                const expired =
                  new Date(banner.bannerDeadlineDate) < new Date();

                return (
                  <div key={banner.bannerNo} className="banner-card">
                    <div className="banner-preview-box">
                      <img src={banner.bannerImg} alt={banner.bannerTitle} />
                      <span className={`status-badge ${expired ? 'expired' : 'active'}`}>
                        {expired ? '만료' : '진행 중'}
                      </span>
                    </div>

                    <div className="banner-info-box">
                      <div className="info-header">
                        <h3>{banner.bannerTitle}</h3>
                        <button className="more-btn">
                          <MoreVertical size={18} />
                        </button>
                      </div>

                      <div className="info-details">
                        <div className="detail-item">
                          <Maximize size={14} />
                          <span>배너 ID: {banner.bannerNo}</span>
                        </div>
                        <div className="detail-item">
                          <Clock size={14} />
                          <span>
                            {banner.bannerStartDate} ~ {banner.bannerDeadlineDate}
                          </span>
                        </div>
                      </div>

                      <div className="info-footer">
                        <button
                          className="action-link-btn"
                          onClick={() => window.open(banner.bannerURL)}
                        >
                          <ExternalLink size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {/* Quick Upload */}
            <div
              className="quick-upload-zone"
              onClick={() => navigate('/admin/banners/add')}
            >
              <div className="plus-circle">
                <Plus size={24} />
              </div>
              <h3>새 배너 등록</h3>
              <p>클릭하여 배너를 추가하세요</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BannerState;
