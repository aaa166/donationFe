import React, { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import './My.css';
import { 
  User, Mail, Phone, Calendar, Shield, 
  ChevronRight, Download, Filter, Heart 
} from 'lucide-react'; // 아이콘 라이브러리 예시 (lucide-react)

const My = () => {
    const [activeTab, setActiveTab] = useState('home');
    const [userInfo, setUserInfo] = useState(null);
    const [myDonation, setMyDonation] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userResponse, donationsResponse] = await Promise.all([
                    api.get('/api/mypage'),
                    api.get('/api/mydonation')
                ]);
                setUserInfo(userResponse.data);
                setMyDonation(donationsResponse.data);
            } catch (err) {
                setError('데이터를 불러오는 중 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="loading-state">데이터를 불러오는 중...</div>;
    if (error) return <div className="error-state">{error}</div>;

    return (
        <div className="desktop-my-page">
            {/* 상단 프로필 히어로 섹션 */}
            <header className="profile-hero">
                <div className="hero-content">
                    <div className="user-meta">
                        <div className="avatar-wrapper">
                            {/* <img src="/default-avatar.png" alt="Profile" /> */}
                            <User size={70} />
                            {/* <span className="badge">VIP</span> */}
                        </div>
                        <div className="user-titles">
                            <h1>{userInfo.userName}님, 반갑습니다!</h1>
                            <p className="user-status">세상을 따뜻하게 만드는 기부자님</p>
                        </div>
                    </div>
                    <div className="total-donation-card">
                        <span className="label">누적 기부 금액</span>
                        <h2 className="amount">{parseInt(userInfo.totalAmount).toLocaleString()}원</h2>
                        
                    </div>
                </div>
            </header>

            {/* 탭 네비게이션 */}
            <nav className="my-tabs-nav">
                <button 
                    className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
                    onClick={() => setActiveTab('home')}
                >
                    마이홈
                </button>
                <button 
                    className={`nav-item ${activeTab === 'donations' ? 'active' : ''}`}
                    onClick={() => setActiveTab('donations')}
                >
                    기부 내역
                </button>
            </nav>

            <main className="tab-content-area">
                {activeTab === 'home' ? (
                    <div className="home-grid">
                        <section className="info-section">
                            <h3>계정 정보</h3>
                            <div className="info-cards-container">
                                <InfoCard icon={<User />} label="아이디" value={userInfo.userId} />
                                <InfoCard icon={<Mail />} label="이메일" value={userInfo.userEmail} />
                                <InfoCard icon={<Phone />} label="연락처" value={userInfo.userPhone} />
                                {/* <InfoCard icon={<Calendar />} label="생년월일" value={userInfo.userBirth} /> */}
                                <InfoCard 
                                    icon={<Shield />} 
                                    label="계정 유형" 
                                    value={userInfo.userRole === 0 ? '관리자' : userInfo.userRole === 1 ? '일반' : '기업'} 
                                />
                            </div>
                        </section>
                        <aside className="sidebar-section">
                            <div className="action-card settings">
                                <h4>계정 설정</h4>
                                <button className="action-btn1">프로필 수정 <ChevronRight size={16} /></button>
                                <button className="action-btn1">비밀번호 변경 <ChevronRight size={16} /></button>
                                <button className="logout-btn">로그아웃</button>
                            </div>
                        </aside>
                    </div>
                ) : (
                    <div className="donation-view">
                        <div className="view-header">
                            <h3>나의 기부 내역</h3>
                            <div className="view-actions">
                                
                            </div>
                        </div>
                        <div className="table-wrapper">
                            <table className="modern-table">
                                <thead>
                                    <tr>
                                        <th>번호</th>
                                        <th>기부 캠페인</th>
                                        <th>기부금액</th>
                                        <th>기부일자</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {myDonation.map((item, idx) => (
                                        <tr key={idx}>
                                            <td>{idx + 1}</td>
                                            <td className="campaign-cell">{item.donationTitle}</td>
                                            <td className="amount-cell">{item.payAmount.toLocaleString()}원</td>
                                            <td>{new Date(item.payDate).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

const InfoCard = ({ icon, label, value }) => (
    <div className="info-card">
        <div className="card-icon">{icon}</div>
        <div className="card-txt">
            <span className="card-label">{label}</span>
            <span className="card-value">{value}</span>
        </div>
    </div>
);

export default My;