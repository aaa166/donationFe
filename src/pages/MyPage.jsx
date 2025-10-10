import React, { useState, useEffect } from 'react';
import './MyPage.css';

const MyPage = () => {
    const [activeTab, setActiveTab] = useState('home');
    
    // 사용자 정보를 담을 state (초기값 null)
    const [userInfo, setUserInfo] = useState(null);
    // 로딩 및 에러 상태 관리
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 컴포넌트가 처음 렌더링될 때 사용자 정보를 가져오는 API 호출
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                // 1. 로컬 스토리지에서 JWT 토큰 가져오기
                const token = localStorage.getItem('jwtToken'); // 'jwtToken'은 로그인 시 저장한 토큰의 key 입니다.

                if (!token) {
                    throw new Error('인증 토큰이 없습니다. 로그인이 필요합니다.');
                }

                // 2. 백엔드 API에 GET 요청 (헤더에 토큰 포함)
                const response = await fetch('http://localhost:8081/api/auth/mypage', { // 백엔드와 협의된 API 엔드포인트
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`, // Bearer 스킴 사용
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('사용자 정보를 가져오는데 실패했습니다.');
                }

                const data = await response.json();
                setUserInfo(data); // 3. 성공 시 받아온 데이터로 state 업데이트

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false); // 4. 로딩 상태 종료
            }
        };

        fetchUserInfo();
    }, []); // 빈 배열을 전달하여 컴포넌트가 마운트될 때 한 번만 실행

    const renderContent = () => {
        switch (activeTab) {
            case 'home':
                return <div className="tab-pane">환영합니다! 여기는 마이홈입니다. 활동 내역을 확인해보세요.</div>;
            case 'donations':
                return <div className="tab-pane">나의 기부 내역이 여기에 표시됩니다.</div>;
            default:
                return null;
        }
    };

    // 로딩 중일 때 표시할 UI
    if (loading) {
        return <div className="mypage-container">로딩 중...</div>;
    }

    // 에러 발생 시 표시할 UI
    if (error) {
        return <div className="mypage-container">에러: {error}</div>;
    }
    
    // 사용자 정보가 없을 때 ( raro case )
    if (!userInfo) {
        return <div className="mypage-container">사용자 정보를 찾을 수 없습니다.</div>;
    }

    return (
        <div className="mypage-container">
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

            <div className="mypage-tabs">
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

export default MyPage;