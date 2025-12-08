import React, { useState, useEffect, useCallback } from 'react';
import './DonationView.css';
import ProgressBar from '../components/ProgressBar';
import ContentTabs from '../components/ContentTabs';
import { useParams } from 'react-router-dom';
import DonationSidebar from '../components/DonationSidebar';

// API 호출을 위한 기본 URL
const API_BASE_URL = 'http://localhost:8081/api';

function DonationView() {
    const [activeTab, setActiveTab] = useState('story');
    const [donationData, setDonationData] = useState(null);
    const [payComments, setPayComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    
    // const donationNo = (donationData.donationNo); 
    // const donationNo = 1; 
    const { donationNo } = useParams();
    
    // useCallback으로 함수 재생성을 방지합니다.
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const [donationResponse, commentsResponse] = await Promise.all([
                fetch(`${API_BASE_URL}/public/donationView/${donationNo}`),
                fetch(`${API_BASE_URL}/public/donationComments/${donationNo}`),
            ]);

            if (!donationResponse.ok || !commentsResponse.ok) {
                const errorStatus = !donationResponse.ok ? donationResponse.status : commentsResponse.status;
                throw new Error(`데이터를 불러오는 데 실패했습니다. (Status: ${errorStatus})`);
            }

            const donationJson = await donationResponse.json();
            const commentsJson = await commentsResponse.json();

            setDonationData(donationJson);
            setPayComments(commentsJson);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }

    }, [donationNo]); // donationNo가 변경될 때만 함수가 재생성됩니다.

    useEffect(() => {
        fetchData();
    }, [fetchData]); // fetchData 함수를 의존성 배열에 추가합니다.

    // --- 렌더링 로직 ---
    if (loading) return <div>로딩 중...</div>;
    if (error) return <div style={{ color: 'red' }}>에러: {error}</div>;
    if (!donationData) return <div>데이터가 없습니다.</div>;
    const CDate = new Date(donationData.donationCreateDate);
    const DDate = new Date(donationData.donationCreateDate);

    const renderContent = () => {
        switch (activeTab) {
            case 'story':
                // 옵셔널 체이닝(?.)을 사용하여 데이터가 확실히 있을 때만 안전하게 렌더링
                return (
                    <div>
                        <div>{donationData?.donationContent}</div>
                        <div>{donationData?.donationAmountPlan}</div>
                    </div>
                );
            case 'reviews':
                return (
                    <div>
                        {payComments?.map((comment) => (
                            // map 사용 시 index보다 고유한 id를 key로 사용하는 것이 좋습니다.
                            <div key={comment.payCommentId || comment.id} className="review-item">
                                <p><strong>작성자:</strong> {comment.userName}</p>
                                <p><strong>후원금액:</strong> {comment.payAmount?.toLocaleString()}원</p>
                                <p><strong>응원글:</strong> {comment.payComment}</p>
                                <p><strong>작성일:</strong> {new Date(comment.payDate).toLocaleDateString()}</p>
                            </div>
                        ))}
                    </div>
                );
            case 'info':
                return <div>
                            <h3>모금단체 정보</h3>
                            <p><strong>단체명:</strong> {donationData.donationOrganization}</p>
                            <p><strong>모금기간:</strong> {CDate.toLocaleString()} ~ {DDate.toLocaleString()}</p>
                            <h3>모금액 사용 계획</h3>
                            <p>{donationData.donationAmountPlan}</p>
                        </div>
            default:
                return <div>스토리를 확인해주세요.</div>;
        }
    };
    
    return (
        <div>
            {/* 옵셔널 체이닝을 적용하여 안정성 향상 */}
            <div className="container">
                <main className="main-content">
                    <div className="donation-header">
                        <div className="tags">
                            {/* donationData.donationCode가 배열이 아닐 경우를 대비하여 방어 코드 추가 */}
                            {Array.isArray(donationData.donationCode) && donationData.donationCode.map((tag, index) => (
                                <span key={index} className="tag">{tag}</span>
                            ))}
                        </div>
                        <h1>{donationData.donationTitle}</h1>
                        <img src={donationData.donationImg} alt={donationData.donationTitle} className="main-image" />
                    </div>
                    <ProgressBar
                        current={donationData.donationCurrentAmount}
                        target={donationData.donationGoalAmount}
                    />
                    <div className="action-buttons">
                        <button className="donate-button main">참여하기</button>
                        <button className="share-button">공유</button>
                    </div>
                    <ContentTabs activeTab={activeTab} setActiveTab={setActiveTab} />
                    <div className="content-section">
                        {renderContent()}
                    </div>
                </main>
                <DonationSidebar
                    currentAmount={donationData.donationCurrentAmount}
                    organization={donationData.donationOrganization}
                />
            </div>
        </div>
    );
}

export default DonationView;