import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import { Plus, Image as ImageIcon, ExternalLink, Calendar, Trash2, Edit } from 'lucide-react';
import './BannerState.css';

const BannerState = () => {
    const navigate = useNavigate();
    const [banners, setBanners] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchBanners = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/api/admin/banners');
            setBanners(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchBanners(); }, []);

    const handleDelete = async (bannerNo) => {
        if (!window.confirm('이 배너를 삭제하시겠습니까?')) return;
        try {
            await api.delete(`/api/admin/banners/${bannerNo}`);
            fetchBanners();
        } catch (err) { alert('삭제 실패'); }
    };

    // 통계 계산
    const stats = {
        total: banners.length,
        active: banners.filter(b => new Date(b.bannerDeadlineDate) >= new Date()).length,
        expired: banners.filter(b => new Date(b.bannerDeadlineDate) < new Date()).length
    };

    return (
        <div className="admin-desktop-container">
            {/* 좌측 사이드바 (필요 시 유지) */}
            
            <div className="admin-main-content">
                <header className="admin-page-header">
                    <div className="header-left">
                        <h1>배너 관리</h1>
                        <p>메인 화면의 슬라이드 및 배너 콘텐츠를 관리합니다.</p>
                    </div>
                    <button className="btn-add-banner" onClick={() => navigate('/admin/banners/add')}>
                        <Plus size={20} /> 배너 등록하기
                    </button>
                </header>

                <div className="stats-row">
                    <div className="stat-card">
                        <span className="label">전체 배너</span>
                        <span className="value">{stats.total}</span>
                    </div>
                    <div className="stat-card active">
                        <span className="label">게시 중</span>
                        <span className="value">{stats.active}</span>
                    </div>
                    <div className="stat-card expired">
                        <span className="label">기간 만료</span>
                        <span className="value">{stats.expired}</span>
                    </div>
                </div>

                <div className="table-card">
                    <table className="banner-desktop-table">
                        <thead>
                            <tr>
                                <th style={{ width: '60px' }}>No</th>
                                <th style={{ width: '200px' }}>미리보기</th>
                                <th>연결 URL</th>
                                <th style={{ width: '180px' }}>게시 기간</th>
                                <th style={{ width: '100px' }}>상태</th>
                                <th style={{ width: '120px' }}>관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan="6" className="loading">데이터 로드 중...</td></tr>
                            ) : banners.map(banner => {
                                const isExpired = new Date(banner.bannerDeadlineDate) < new Date();
                                return (
                                    <tr key={banner.bannerNo}>
                                        <td>{banner.bannerNo}</td>
                                        <td>
                                            <div className="banner-thumb">
                                                <img src={banner.bannerImg} alt="Banner" />
                                            </div>
                                        </td>
                                        <td className="url-cell">
                                            <a href={banner.bannerURL} target="_blank" rel="noreferrer">
                                                {banner.bannerURL} <ExternalLink size={14} />
                                            </a>
                                        </td>
                                        <td>
                                            <div className="date-info">
                                                <span>{banner.bannerDate}</span>
                                                <span className="date-sep">~</span>
                                                <span>{banner.bannerDeadlineDate}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${isExpired ? 'expired' : 'active'}`}>
                                                {isExpired ? '만료' : '진행중'}
                                            </span>
                                        </td>
                                        <td className="action-cells">
                                            <button className="icon-btn edit" onClick={() => navigate(`/admin/banners/edit/${banner.bannerNo}`)}>
                                                <Edit size={18} />
                                            </button>
                                            <button className="icon-btn delete" onClick={() => handleDelete(banner.bannerNo)}>
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default BannerState;