import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import {
  Plus,
  Search,
  MoreVertical,
  ExternalLink,
  Clock,
  Maximize
} from 'lucide-react';
import './BannerState.css';

const BACKEND_URL = 'http://localhost:8081'; 

const BannerState = () => {
  const navigate = useNavigate();
  const [banners, setBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('total'); // 'total', 'active', 'expired'

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

  const filteredBanners = banners
    .filter(banner => {
      if (filterStatus === 'active') {
        const now = new Date();
        const startDate = new Date(banner.bannerStartDate);
        const deadlineDate = new Date(banner.bannerDeadlineDate);
        return now >= startDate && now <= deadlineDate;
      }
      if (filterStatus === 'expired') {
        const now = new Date();
        const deadlineDate = new Date(banner.bannerDeadlineDate);
        return now > deadlineDate;
      }
      return true; // 'total'
    })
    .filter(banner =>
      banner.bannerTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const stats = {
    total: banners.length,
    active: banners.filter(b => {
      const now = new Date();
      const startDate = new Date(b.bannerStartDate);
      const deadlineDate = new Date(b.bannerDeadlineDate);
      return now >= startDate && now <= deadlineDate;
    }).length,
    expired: banners.filter(b => {
      const now = new Date();
      const deadlineDate = new Date(b.bannerDeadlineDate);
      return now > deadlineDate;
    }).length
  };

  return (
    <div className="banner-gallery-container">
      <main className="gallery-main">
        <div className="content-inner">
          <header className="admin-header">
            <div className="header-title">
              <h1>배너 관리</h1>
              <p>등록된 배너와 통계를 관리합니다.</p>
            </div>
            <div className="search-group">
              <div className="search-wrapper">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="배너 제목 검색..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                className="btn-add-primary"
                onClick={() => navigate('/insertBanner')}
              >
                <Plus size={20} /> 새 배너 등록
              </button>
            </div>
          </header>

          <div className="stats-container">
            <div
              className={`stat-card ${filterStatus === 'total' ? 'selected' : ''}`}
              onClick={() => setFilterStatus('total')}
            >
              <span className="label">전체 배너</span>
              <span className="value">{stats.total}</span>
            </div>
            <div
              className={`stat-card active ${filterStatus === 'active' ? 'selected' : ''}`}
              onClick={() => setFilterStatus('active')}
            >
              <span className="label">진행 중</span>
              <span className="value">{stats.active}</span>
            </div>
            <div
              className={`stat-card expired ${filterStatus === 'expired' ? 'selected' : ''}`}
              onClick={() => setFilterStatus('expired')}
            >
              <span className="label">만료</span>
              <span className="value">{stats.expired}</span>
            </div>
          </div>

          <div className="banner-feed">
            {isLoading ? (
              <div className="loading-state">데이터 불러오는 중...</div>
            ) : filteredBanners.length === 0 ? (
              <div className="loading-state">
                {searchTerm ? '검색 결과가 없습니다.' : '등록된 배너가 없습니다.'}
              </div>
            ) : (
              filteredBanners.map(banner => {
                const now = new Date();
                const startDate = new Date(banner.bannerStartDate);
                const deadlineDate = new Date(banner.bannerDeadlineDate);
                const isActive = now >= startDate && now <= deadlineDate;
                const isExpired = now > deadlineDate;

                let statusLabel = '예정';
                let statusClass = 'pending';

                if (isActive) {
                  statusLabel = '진행 중';
                  statusClass = 'active';
                } else if (isExpired) {
                  statusLabel = '만료';
                  statusClass = 'expired';
                }
                
                const bannerImgUrl = banner.bannerImg 
                  ? `${BACKEND_URL}${banner.bannerImg}` 
                  : '/default-image.png'; // 이미지 없을 때 기본 이미지

                return (
                  <div key={banner.bannerNo} className="banner-card">
                    <div className="banner-preview-box">
                      <img src={bannerImgUrl} alt={banner.bannerTitle} />
                      <span className={`status-badge ${statusClass}`}>
                        {statusLabel}
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
