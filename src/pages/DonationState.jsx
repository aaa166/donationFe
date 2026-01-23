import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import api from '../api/axiosInstance';
import './DonationState.css';

const DonationState = () => {
    const [donations, setDonations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('donationTitle');
    const [currentPage, setCurrentPage] = useState(0);

    const STATE_OPTIONS = { 'P': '대기', 'A': '공개', 'D': '비공개' };
    const ITEMS_PER_PAGE = 10;

    const fetchDonationData = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/api/admin/donationState');
            setDonations(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchDonationData(); }, []);

    const handleStateUpdate = async (donationNo) => {
        if (!window.confirm(`상태를 변경하시겠습니까?`)) return;
        try {
            await api.patch(`/api/admin/updateDonationState/${donationNo}`);
            fetchDonationData();
        } catch (err) {
            alert('업데이트 실패');
        }
    };

    const filteredDonations = donations.filter(d => {
        const term = searchTerm.toLowerCase();
        return d[searchType]?.toLowerCase().includes(term);
    });

    const currentItems = filteredDonations.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);
    const pageCount = Math.ceil(filteredDonations.length / ITEMS_PER_PAGE);

    // 통계 계산
    const stats = {
        total: donations.length,
        active: donations.filter(d => d.donationState === 'A').length,
        pending: donations.filter(d => d.donationState === 'P').length
    };

    return (
        <div className="admin-layout">
            <header className="admin-header">
                <div className="header-title">
                    <h1>캠페인 관리</h1>
                    <p>기부 캠페인의 공개 여부 및 모금 현황을 관리합니다.</p>
                </div>
                <div className="search-group">
                    <select value={searchType} onChange={e => setSearchType(e.target.value)}>
                        <option value="donationTitle">캠페인명</option>
                        <option value="donationOrganization">기관명</option>
                    </select>
                    <input
                        type="text"
                        placeholder="검색어 입력..."
                        value={searchTerm}
                        onChange={e => { setSearchTerm(e.target.value); setCurrentPage(0); }}
                    />
                </div>
            </header>

            <div className="stats-container">
                <div className="stat-card">
                    <span className="label">전체 캠페인</span>
                    <span className="value">{stats.total}</span>
                </div>
                <div className="stat-card active">
                    <span className="label">공개 중</span>
                    <span className="value">{stats.active}</span>
                </div>
                <div className="stat-card pending">
                    <span className="label">승인 대기</span>
                    <span className="value">{stats.pending}</span>
                </div>
            </div>

            <main className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th className="col-no">No</th>
                            <th className="col-title">캠페인 정보</th>
                            <th className="col-org">기관</th>
                            <th className="col-amount">모금 현황</th>
                            <th className="col-progress">달성률</th>
                            <th className="col-deadline">마감일</th>
                            <th className="col-state">상태</th>
                            <th className="col-action">관리</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan="8" className="loading">로딩 중...</td></tr>
                        ) : currentItems.map(d => {
                            // 달성률 계산 (0~100 사이)
                            const progress = Math.min(Math.round((d.donationCurrentAmount / d.donationGoalAmount) * 100), 100) || 0;
                            
                            return (
                                <tr key={d.donationNo}>
                                    <td>{d.donationNo}</td>
                                    <td className="title-cell">
                                        <Link to={`/donations/${d.donationNo}`} className="title-link">
                                            {d.donationTitle}
                                        </Link>
                                    </td>
                                    <td>{d.donationOrganization}</td>
                                    <td className="amount-cell">
                                        <div className="amount-text">
                                            <strong>{d.donationCurrentAmount?.toLocaleString()}</strong>
                                            <span> / {d.donationGoalAmount?.toLocaleString()}원</span>
                                        </div>
                                    </td>
                                    {/* 프로그레스 바 영역 */}
                                    <td className="progress-cell">
                                        <div className="progress-container">
                                            <div className="progress-info">
                                                <span className="progress-percentage">{progress}%</span>
                                            </div>
                                            <div className="progress-track">
                                                <div 
                                                    className="progress-fill" 
                                                    style={{ width: `${progress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{d.donationDeadlineDate}</td>
                                    <td>
                                        <span className={`state-badge state-${d.donationState}`}>
                                            {STATE_OPTIONS[d.donationState]}
                                        </span>
                                    </td>
                                    <td>
                                        <button 
                                            className={`action-btn ${d.donationState === 'A' ? 'hide' : 'show'}`}
                                            onClick={() => handleStateUpdate(d.donationNo)}
                                        >
                                            {d.donationState === 'A' ? '비공개' : '공개'}
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                <ReactPaginate
                    previousLabel="이전" nextLabel="다음"
                    pageCount={pageCount}
                    onPageChange={({ selected }) => setCurrentPage(selected)}
                    containerClassName="pagination-bar"
                    activeClassName="active"
                />
            </main>
        </div>
    );
};

export default DonationState;