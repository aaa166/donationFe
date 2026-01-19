import React, { useState, useEffect } from 'react';
import api from '../api/axiosInstance'; // Axios 인스턴스 사용
import './My.css';

const My = () => {
    const [activeTab, setActiveTab] = useState('home');
    const [userInfo, setUserInfo] = useState(null);
    const [myDonation, setMyDonation] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 사용자 정보와 기부 내역을 동시에 요청
                const [userResponse, donationsResponse] = await Promise.all([
                    api.get('/api/mypage'),
                    api.get('/api/mydonation') // 기부 내역 API
                ]);

                setUserInfo(userResponse.data);
                setMyDonation(donationsResponse.data);

            } catch (err) {
                if (err.response?.status === 401) {
                    setError('로그인이 필요합니다. 다시 로그인해주세요.');
                } else if (err.response?.status === 403) {
                    setError('권한이 없습니다.');
                } else {
                    setError('데이터를 불러오는 중 오류가 발생했습니다.');
                    console.error(err);
                }
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
                                if (key === 'totalAmount') return null;
                                const keyMap = {
                                    'userId': 'ID',
                                    'userName': '이름',
                                    'userEmail': '이메일',
                                    'userPhone': '연락처',
                                    'userBirth': '생년월일',
                                    'userRole': '계정 유형'
                                };

                                let displayValue = value;
                                if (key === 'userRole') {
                                    const roleMap = { 0: '관리자', 1: '일반', 2: '기업' };
                                    displayValue = roleMap[value];
                                }

                                return (
                                    <div className="info-item" key={key}>
                                        <span className="info-label">{keyMap[key] || key}</span>
                                        <span className="info-value">{displayValue}</span>
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

    if (loading) return <div className="my-container">로딩 중...</div>;
    if (error) return <div className="my-container">에러: {error}</div>;
    if (!userInfo) return <div className="my-container">사용자 정보를 찾을 수 없습니다.</div>;

    return (
        <div className="my-container">
            <div className="profile-summary">
                <div className="profile-info">
                    <h2>{userInfo.userName}님</h2>
                </div>
                <div className="donation-summary">
                    <div>
                        <p>총 기부금액</p>
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
