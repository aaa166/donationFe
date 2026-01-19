import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import './DonationState.css';
import api from '../api/axiosInstance'; // axiosInstance 사용

const DonationState = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('donationTitle');

    const STATE_LABELS = { P: '대기', A: '공개', D: '비공개' };
    const ITEMS_PER_PAGE = 10;

    // 캠페인 데이터 가져오기
    const fetchDonations = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get('/api/admin/donationState');
            setDonations(res.data || []);
        } catch (err) {
            console.error('데이터 가져오기 실패:', err);
            setError(err.response?.data?.message || err.message || '캠페인 데이터를 가져오는 데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 캠페인 상태 변경
    const handleStateUpdate = async (donationNo) => {
        if (!window.confirm(`${donationNo}번 캠페인의 상태를 변경하시겠습니까?`)) return;

        try {
            await api.patch(`/api/admin/updateDonationState/${donationNo}`);
            alert(`${donationNo}번 캠페인 상태 변경 성공!`);
            fetchDonations();
        } catch (err) {
            console.error('상태 업데이트 실패:', err);
            setError(err.response?.data?.message || err.message || '상태 업데이트 중 오류가 발생했습니다.');
        }
    };

    useEffect(() => {
        fetchDonations();
    }, []);

    const handlePageClick = (event) => setCurrentPage(event.selected);

    // 검색 필터 적용
    const filteredDonations = donations.filter((donation) => {
        const term = searchTerm.trim().toLowerCase();
        if (!term) return true;
        const value = donation[searchType]?.toString().toLowerCase() || '';
        return value.includes(term);
    });

    const offset = currentPage * ITEMS_PER_PAGE;
    const currentItems = filteredDonations.slice(offset, offset + ITEMS_PER_PAGE);
    const pageCount = Math.ceil(filteredDonations.length / ITEMS_PER_PAGE);
    const emptyRowsCount = ITEMS_PER_PAGE - currentItems.length;

    if (loading) return <div className="donation-state-container">데이터를 불러오는 중...</div>;
    if (error) return <div className="donation-state-container" style={{ color: 'red' }}>{error}</div>;

    return (
        <div className="donation-state-container">
            <h1>캠페인 관리</h1>

            <div className="search-container">
                <select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
                    <option value="donationTitle">캠페인</option>
                    <option value="donationOrganization">기관</option>
                </select>
                <input
                    type="text"
                    placeholder="검색..."
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(0); }}
                />
            </div>

            <table className="donation-state-table">
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>캠페인</th>
                        <th>기관</th>
                        <th>모금액</th>
                        <th>마감일</th>
                        <th>상태</th>
                        <th>상태 변경</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((donation) => (
                        <tr key={donation.donationNo}>
                            <td>{donation.donationNo}</td>
                            <td>
                                {donation.donationState === 'D' ? (
                                    <a href="#" onClick={(e) => { e.preventDefault(); alert('비활성화된 게시글입니다.'); }}>
                                        {donation.donationTitle}
                                    </a>
                                ) : (
                                    <Link to={`/donations/${donation.donationNo}`}>{donation.donationTitle}</Link>
                                )}
                            </td>
                            <td>{donation.donationOrganization}</td>
                            <td>{donation.donationCurrentAmount?.toLocaleString()}원 / {donation.donationGoalAmount?.toLocaleString()}원</td>
                            <td className={new Date(donation.donationDeadlineDate) < new Date().setHours(0,0,0,0) ? 'deadline-past' : ''}>
                                {donation.donationDeadlineDate}
                            </td>
                            <td className={`state-${donation.donationState}`}>{STATE_LABELS[donation.donationState]}</td>
                            <td>
                                {(donation.donationState === 'P' || donation.donationState === 'D') && (
                                    <button className="state-button activate" onClick={() => handleStateUpdate(donation.donationNo)}>공개</button>
                                )}
                                {donation.donationState === 'A' && (
                                    <button className="state-button deactivate" onClick={() => handleStateUpdate(donation.donationNo)}>비공개</button>
                                )}
                            </td>
                        </tr>
                    ))}
                    {emptyRowsCount > 0 && currentItems.length > 0 && Array.from({ length: emptyRowsCount }).map((_, i) => (
                        <tr key={`empty-${i}`} className="empty-row"><td colSpan="7">&nbsp;</td></tr>
                    ))}
                </tbody>
            </table>

            {donations.length === 0 && <p>등록된 캠페인이 없습니다.</p>}

            <ReactPaginate
                previousLabel="이전"
                nextLabel="다음"
                breakLabel="..."
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName="pagination"
                activeClassName="active"
            />
        </div>
    );
};

export default DonationState;
