import React, { useState, useEffect } from 'react';
import './DonationState.css';

const DonationState = () => {
    const [donations, setDonations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = 'http://localhost:8081/api/admin/donationState';
    
    const STATE_OPTIONS = {
        'P': '대기',
        'A': '게시',
        'D': '비활성화',
    };

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

    useEffect(() => {
        fetchDonationData();
    }, []); 

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
                    {donations.map((donation) => (
                        <tr key={donation.donationNo}>
                            <td>{donation.donationNo}</td>
                            <td>{donation.donationTitle}</td>
                            <td>{donation.donationOrganization}</td>
                            <td>{donation.donationDeadlineDate}</td>
                            <td className={`state-${donation.donationState}`} >{STATE_OPTIONS[donation.donationState] || donation.donationState}</td>
                            <td>
                                {(donation.donationState === 'P' || donation.donationState === 'D') && <button className="state-button activate">활성화</button>}
                                {donation.donationState === 'A' && <button className="state-button deactivate">비활성화</button>}
                            </td> 
                        </tr>
                    ))}
                </tbody>
            </table>
            {donations.length === 0 && <p>등록된 캠페인이 없습니다.</p>}
        </div>
    );
};

export default DonationState;