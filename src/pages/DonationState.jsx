import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import './DonationState.css';

const DonationState = () => {
    const [donations, setDonations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);

    const API_URL = 'http://localhost:8081/api/admin/donationState';
    const UPDATE_API_URL = 'http://localhost:8081/api/admin/updateDonationState';

    const STATE_OPTIONS = {
        'P': '대기',
        'A': '공개',
        'D': '비공개',
    };

    const ITEMS_PER_PAGE = 15;

    const getJwtToken = () => {
        const token = localStorage.getItem('jwtToken'); 
        if (!token) {
            console.error("JWT 토큰을 찾을 수 없습니다. 로그인 상태를 확인하세요.");
            return null;
        }
        return token;
    };

    const fetchDonationData = async () => {
        setIsLoading(true);
        setError(null);

        const token = getJwtToken();
        if (!token) {
            setIsLoading(false);
            setError("UNAUTHORIZED: JWT 토큰이 없어 인증할 수 없습니다. 로그인 상태를 확인하세요.");
            return;
        }
        
        try {
            const response = await fetch(API_URL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
            });

            if (response.status === 401) {
                throw new Error("UNAUTHORIZED: 인증이 필요합니다. 관리자 로그인 상태를 확인하세요.");
            }
            if (response.status === 403) {
                throw new Error("NO_PERMISSION: 관리자 권한이 필요합니다.");
            }
            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            const data = await response.json();
            setDonations(data);

        } catch (err) {
            console.error("데이터 가져오기 실패:", err);
            setError(err.message || "캠페인 데이터를 가져오는 데 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    };


    const handleStateUpdate = async (donationNo) => {
        const token = getJwtToken();
        if (!token) {
            alert("인증 토큰이 없습니다. 로그인 상태를 확인하세요.");
            return;
        }

        if (!window.confirm(`${donationNo}번 캠페인의 상태를 변경하시겠습니까?`)) {
            return;
        }

        try {
            const updateUrl = `${UPDATE_API_URL}/${donationNo}`;

            const response = await fetch(updateUrl, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json', 
                },
            });

            if (response.status === 401) {
                throw new Error("인증 실패: 다시 로그인해주세요.");
            }
            if (response.status === 403) {
                throw new Error("권한 부족: 관리자 권한이 필요합니다.");
            }
            if (!response.ok) {
                const errorBody = await response.text(); 
                throw new Error(`상태 변경 실패: ${response.status} - ${errorBody || '서버 오류'}`);
            }

            alert(`${donationNo}번 캠페인 상태 변경 성공! 목록을 새로고침합니다.`);
            await fetchDonationData();

        } catch (err) {
            console.error("상태 업데이트 실패:", err);
            setError(err.message || "상태 업데이트 중 알 수 없는 오류가 발생했습니다.");
        }
    };

    useEffect(() => {
        fetchDonationData();
    }, []); 

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    const offset = currentPage * ITEMS_PER_PAGE;
    const currentItems = donations.slice(offset, offset + ITEMS_PER_PAGE);
    const pageCount = Math.ceil(donations.length / ITEMS_PER_PAGE);
    const emptyRowsCount = ITEMS_PER_PAGE - currentItems.length;

    if (isLoading) {
        return <div className="donation-state-container">데이터를 불러오는 중...</div>;
    }

    if (error) {
        return <div className="donation-state-container" style={{ color: 'red', fontWeight: 'bold' }}>오류: {error}</div>;
    }

    return (
        <div className="donation-state-container">
            <h1>캠페인 상태</h1>
            <table className="donation-state-table">
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>캠페인</th>
                        <th>기관</th>
                        <th>마감일</th>
                        <th>상태</th>
                        <th>상태 변경</th> 
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((donation) => (
                        <tr key={donation.donationNo}>
                            <td>{donation.donationNo}</td>
                            <td>{donation.donationTitle}</td>
                            <td>{donation.donationOrganization}</td>
                            <td>{donation.donationDeadlineDate}</td>
                            <td className={`state-${donation.donationState}`} >{STATE_OPTIONS[donation.donationState] || donation.donationState}</td>
                            <td>
                                {(donation.donationState === 'P' || donation.donationState === 'D') && 
                                    <button 
                                        className="state-button activate"
                                        onClick={() => handleStateUpdate(donation.donationNo)}
                                    >
                                        공개
                                    </button>
                                }
                                {donation.donationState === 'A' && 
                                    <button 
                                        className="state-button deactivate"
                                        onClick={() => handleStateUpdate(donation.donationNo)}
                                    >
                                        비공개
                                    </button>
                                }
                            </td>
                        </tr>
                    ))}
                    {emptyRowsCount > 0 && Array.from({ length: emptyRowsCount }).map((_, index) => (
                        <tr key={`empty-${index}`} className="empty-row">
                            <td>&nbsp;</td>
                            <td>&nbsp;</td>
                            <td>&nbsp;</td>
                            <td>&nbsp;</td>
                            <td>&nbsp;</td>
                            <td>&nbsp;</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {donations.length === 0 && <p>등록된 캠페인이 없습니다.</p>}
            <ReactPaginate
                previousLabel={'이전'}
                nextLabel={'다음'}
                breakLabel={'...'}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={'pagination'}
                activeClassName={'active'}
            />
        </div>
    );
};

export default DonationState;