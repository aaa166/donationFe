import React, { useState, useEffect } from 'react';
import './My.css';

const My = () => {
    const [activeTab, setActiveTab] = useState('home');
    
    // 사용자 정보를 담을 state
    const [userInfo, setUserInfo] = useState(null);
    // 기부 내역을 담을 state
    const [myDonation, setMyDonation] = useState([]);
    // 로딩 및 에러 상태 관리
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('jwtToken');
                if (!token) {
                    throw new Error('인증 토큰이 없습니다. 로그인이 필요합니다.');
                }

                const headers = {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                };

                // 사용자 정보와 기부 내역을 동시에 요청
                const [userResponse, donationsResponse] = await Promise.all([
                    fetch('http://localhost:8081/api/auth/mypage', { headers }),
                    fetch('http://localhost:8081/api/mydonation', { headers }) // 기부 내역 API 엔드포인트 (가정)
                ]);

                if (!userResponse.ok) {
                    throw new Error('사용자 정보를 가져오는데 실패했습니다.');
                }
                if (!donationsResponse.ok) {
                    throw new Error('기부 내역을 가져오는데 실패했습니다.');
                }

                const userData = await userResponse.json();
                const donationsData = await donationsResponse.json();

                setUserInfo(userData);
                setMyDonation(donationsData);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const renderContent = () => {
        switch (activeTab) {
            case 'home':
                return (
                    <div className="tab-pane">
                        <div className="info-grid">
                            {userInfo && Object.entries(userInfo).map(([key, value]) => {
                                // totalAmount는 이미 상단에 표시되므로 여기서는 제외
                                if (key === 'totalAmount') return null;
                                
                                // 키를 좀 더 친숙한 레이블로 변환
                                const keyMap = {
                                    'memberId': '아이디',
                                    'userName': '이름',
                                    'email': '이메일',
                                    'phoneNumber': '연락처',
                                    'birth': '생년월일',
                                    'gender': '성별'
                                };

                                return (
                                    <div className="info-item" key={key}>
                                        <span className="info-label">{keyMap[key] || key}</span>
                                        <span className="info-value">{value}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            case 'donations':
                return (
                    <div className="tab-pane">
                        <h3>나의 기부 내역</h3>
                        <table className="donation-table">
                            <thead>
                                <tr>
                                    <th style={{width: '10%'}}>번호</th>
                                    <th style={{width: '50%'}}>기부 캠페인</th>
                                    <th style={{width: '20%'}}>기부금액</th>
                                    <th style={{width: '20%'}}>기부일자</th>
                                </tr>
                            </thead>
                            <tbody>
                                {myDonation.length > 0 ? (
                                    myDonation.map((donation, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{donation.donationTitle}</td>
                                            <td>{`${donation.payAmount.toLocaleString()}원`}</td>
                                            <td>{new Date(donation.payDate).toLocaleDateString()}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" style={{textAlign: 'center'}}>기부 내역이 없습니다.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                );
            default:
                return null;
        }
    };

    // 로딩 중일 때 표시할 UI
    if (loading) {
        return <div className="my-container">로딩 중...</div>;
    }

    // 에러 발생 시 표시할 UI
    if (error) {
        return <div className="my-container">에러: {error}</div>;
    }
    
    // 사용자 정보가 없을 때 ( raro case )
    if (!userInfo) {
        return <div className="my-container">사용자 정보를 찾을 수 없습니다.</div>;
    }

    return (
        <div className="my-container">
            <div className="profile-summary">
                <div className="profile-info">
                    {/* userInfo state에서 동적으로 이름 표시 */}
                    <h2>{userInfo.userName}님</h2>
                </div>
                <div className="donation-summary">
                    <div>
                        <p>총 기부금액</p>
                        {/* userInfo state에서 동적으로 총 기부금액 표시 */}
                        <span>{parseInt(userInfo.totalAmount).toLocaleString()}원</span>
                    </div>
                </div>
            </div>

            <div className="my-tabs">
                <button
                    className={`tab-button ${activeTab === 'home' ? 'active' : ''}`}
                    onClick={() => setActiveTab('home')}
                >
                    마이홈
                </button>
                <button
                    className={`tab-button ${activeTab === 'donations' ? 'active' : ''}`}
                    onClick={() => setActiveTab('donations')}
                >
                    나의 기부
                </button>
            </div>

            <div className="tab-content">
                {renderContent()}
            </div>
        </div>
    );
};

export default My;
