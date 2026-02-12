import React, { useState, useEffect, useCallback, useRef } from 'react';
import './DonationView.css';
import ProgressBar from '../components/ProgressBar';
import ContentTabs from '../components/ContentTabs';
import { useParams, useLocation } from 'react-router-dom';
import DonationSidebar from '../components/DonationSidebar';
import api from '../api/axiosInstance'; // ✅ JWT 인터셉터

const API_BASE_URL = 'http://localhost:8081/api';

function DonationView() {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(location.state?.openTab || 'story');
    const [donationData, setDonationData] = useState(null);
    const [payComments, setPayComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [amount, setAmount] = useState("");
    const [isCustomAmount, setIsCustomAmount] = useState(false);
    const [termsAgreed, setTermsAgreed] = useState(false);
    const [comment, setComment] = useState(""); 
    const [step, setStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const customAmountInputRef = useRef(null);

    const { donationNo } = useParams();

    /* ================= 데이터 로딩 ================= */
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        // console.log(donationData.donationNo);
        try {
            const [donationRes, commentRes] = await Promise.all([
                fetch(`${API_BASE_URL}/public/donationView/${donationNo}`),
                fetch(`${API_BASE_URL}/public/donationComments/${donationNo}`)
            ]);

            if (!donationRes.ok || !commentRes.ok) {
                throw new Error('데이터 조회 실패');
            }

            setDonationData(await donationRes.json());
            setPayComments(await commentRes.json());
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, [donationNo]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    /* ================= 후원 ================= */
    const handleDonateSubmit = async () => {
        if (!termsAgreed) return;

        setIsProcessing(true);
        try {
            await api.post('/api/donate', {
                payAmount: Number(amount),
                payComment: comment,
                donationNo: Number(donationNo),
            });
            
            alert('후원이 완료되었습니다.');
            handleCloseModal();
            fetchData();
        } catch (e) {
            if (e.response?.status === 401) {
                alert('로그인이 필요합니다.');
            } else {
                alert('후원 중 오류 발생');
            }
        } finally {
            setIsProcessing(false);
        }
    };

    /* ================= 신고 ================= */
    const handleReport = async (reportedId, reportDetails, typeNo, reportType) => {
        try {
            await api.post('/api/insertReport', {
                reportedId,
                reportDetails,
                typeNo,
                reportType,
            });
            console.log(typeNo);
            alert('신고가 접수되었습니다.');
            fetchData();
            setActiveTab('reviews');
        } catch (e) {
            if (e.response?.status === 409) {
                console.log(typeNo);
                alert('이미 신고된 게시글입니다.');
            } else if (e.response?.status === 401) {
                alert('로그인이 필요합니다.');
            } else {
                alert('신고 중 오류 발생');
            }
        }
    };

    /* ================= UI 헬퍼 ================= */
    const handleDonateClick = () => {
        setIsModalOpen(true);
        setStep(1);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setAmount("");
        setIsCustomAmount(false);
        setTermsAgreed(false);
        setComment("");
        setStep(1);
    };

    const formatWithCommas = (value) =>
        value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "";

    if (loading) return <div>로딩 중...</div>;
    if (error) return <div style={{ color: 'red' }}>에러: {error}</div>;
    if (!donationData) return <div>데이터 없음</div>;

    /* ================= 탭 콘텐츠 ================= */
    const renderContent = () => {
        switch (activeTab) {
            case 'story':
                return (
                    <div>
                        <div
                            className="content"
                            dangerouslySetInnerHTML={{
                                __html: donationData.donationContent
                                .split('\n\n') 
                                .map(p => {
                                    const [first, ...rest] = p
                                    .split('\n')
                                    .map(line => line.trim())
                                    .filter(line => line.length > 0); // 공백 줄 제거

                                    return `
                                    <p>
                                        <span class="title">${first}</span>
                                        ${rest.map(line => `<br>${line}`).join('')}
                                    </p>
                                    `;
                                })
                                .join('')
                            }}
                        />
                        <div>{donationData.donationAmountPlan}</div>
                    </div>
                );
            case 'reviews':
                return payComments.map((c, i) => (
                    <div key={i} className="review-item">
                        <p><strong>작성자:</strong> {c.userName}</p>
                        <p><strong>후원금:</strong> {c.payAmount.toLocaleString()}원</p>
                        <p>{c.payComment}</p>
                        <button
                            className="report-button"
                            onClick={() =>
                                handleReport(c.userNo, c.payComment, c.donationNo, 'payComment')
                            }
                        >
                            신고
                        </button>
                    </div>
                ));
            // case 'info':
            //     return (
            //         <div>
            //             <p><strong>단체:</strong> {donationData.donationOrganization}</p>
            //             <p>{donationData.donationAmountPlan}</p>
            //         </div>
            //     );
            default:
                return null;
        }
    };
    const BACKEND_URL = 'http://localhost:8081'; 
    const donationImgUrl = donationData.donationImg.startsWith("http")
            ? donationData.donationImg
            : `${BACKEND_URL}${donationData.donationImg}`;

    return (
        <div className="container">
            <main className="main-content">
                <div className="donation-header">
                    <h1>{donationData.donationTitle}</h1>
                    <img src={donationImgUrl} alt={donationData.donationTitle} className="main-image"/>
                    
                </div>

                <ProgressBar
                    current={donationData.donationCurrentAmount}
                    target={donationData.donationGoalAmount}
                />

                {/* 🔥 action-buttons 복구 */}
                {/* <div className="action-buttons">
                    <button className="donate-button main" onClick={handleDonateClick}>
                        참여하기
                    </button>
                    <button className="share-button">공유</button>
                </div> */}

                <ContentTabs activeTab={activeTab} setActiveTab={setActiveTab} />

                <div className="content-section">
                    {renderContent()}
                </div>
            </main>

            <DonationSidebar
                currentAmount={donationData.donationCurrentAmount}
                organization={donationData.donationOrganization}
                onDonateClick={handleDonateClick}
            />

            {/* 🔥 모달 그대로 유지 */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-button" onClick={handleCloseModal}>&times;</button>
                        <h2>후원하기</h2>
                        
                        {step === 1 && (
                            <>
                                <div className="donation-amount-options">
                                    <button 
                                        onClick={() => { setAmount("1000"); setIsCustomAmount(false); }}
                                        className={!isCustomAmount && amount === '1000' ? 'active' : ''}
                                    >1,000원</button>
                                    <button 
                                        onClick={() => { setAmount("5000"); setIsCustomAmount(false); }}
                                        className={!isCustomAmount && amount === '5000' ? 'active' : ''}
                                    >5,000원</button>
                                    <button 
                                        onClick={() => { setAmount("10000"); setIsCustomAmount(false); }}
                                        className={!isCustomAmount && amount === '10000' ? 'active' : ''}
                                    >10,000원</button>
                                    <button 
                                        onClick={() => { setAmount("50000"); setIsCustomAmount(false); }}
                                        className={!isCustomAmount && amount === '50000' ? 'active' : ''}
                                    >50,000원</button>
                                    <button 
                                        onClick={() => {
                                            setIsCustomAmount(true);
                                            setAmount("");
                                            customAmountInputRef.current?.focus();
                                        }}
                                        className={isCustomAmount ? 'active' : ''}
                                    >직접입력</button>
                                    <div className="custom-amount-input-wrapper">
                                        <input
                                            ref={customAmountInputRef}
                                            type="text"
                                            placeholder="금액 직접 입력"
                                            className="custom-amount-input"
                                            value={formatWithCommas(amount)}
                                            readOnly={!isCustomAmount}
                                            onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
                                        />
                                        <span className="custom-amount-unit">원</span>
                                    </div>
                                </div>
                                <div className="comment-input-wrapper">
                                    <textarea
                                        placeholder="응원의 한마디를 남겨주세요 (선택)"
                                        className="comment-input"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        maxLength="100"
                                    />
                                    <div className="char-counter">{comment.length}/100</div>
                                </div>
                                <div className="terms-text-wrapper">
                                    <strong>제1조 (목적)</strong><br />
                                    본 약관은 후원자가 OO 플랫폼을 통해 제공되는 기부 서비스를 이용함에 있어 후원자와 플랫폼 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.<br /><br />
                                    <strong>제2조 (정의)</strong><br />
                                    1. "후원금"이란 후원자가 기부의 목적으로 플랫폼을 통해 결제한 금액을 의미합니다.<br />
                                    2. "모금단체"란 플랫폼을 통해 후원금을 모집하는 단체를 의미합니다.<br /><br />
                                    <strong>제3조 (후원금의 전달)</strong><br />
                                    플랫폼은 수수료를 제외한 후원금을 모금단체에 전달할 책임이 있습니다. 후원금 전달 내역은 플랫폼 웹사이트를 통해 투명하게 공개됩니다.<br /><br />
                                    <strong>제4조 (환불 규정)</strong><br />
                                    후원금은 기부의 특성상 결제가 완료된 이후에는 원칙적으로 환불이 불가능합니다. 단, 모금단체의 명백한 귀책사유가 있는 경우 등 예외적인 경우에 한해 내부 심사를 거쳐 환불이 가능할 수 있습니다.<br /><br />
                                    <strong>제5조 (개인정보 수집 및 이용)</strong><br />
                                    플랫폼은 후원자의 개인정보를 관련 법령에 따라 안전하게 보호하며, 기부금 영수증 발급 등의 목적을 위해서만 최소한의 정보를 수집 및 이용합니다.
                                </div>
                                <div className="terms-agreement">
                                    <input
                                        type="checkbox"
                                        id="terms-checkbox"
                                        checked={termsAgreed}
                                        onChange={(e) => setTermsAgreed(e.target.checked)}
                                    />
                                    <label htmlFor="terms-checkbox">
                                        후원 약관에 동의합니다.
                                    </label>
                                </div>
                                <button
                                    className="donate-submit-button"
                                    disabled={!amount || !termsAgreed}
                                    onClick={() => setStep(2)}
                                >
                                    다음
                                </button>
                            </>
                        )}

                        {step === 2 && (
                            <>
                                {isProcessing ? (
                                    <div className="payment-processing">
                                        <div className="spinner"></div>
                                        <h3>결제 진행 중...</h3>
                                        <p>잠시만 기다려주세요.</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="donation-confirmation">
                                            <h3>후원 내역 확인</h3>
                                            <p><strong>후원 금액:</strong> {formatWithCommas(amount)}원</p>
                                            {comment && <p><strong>응원 메시지:</strong> {comment}</p>}
                                            <p>후원 약관에 동의하셨습니다.</p>
                                        </div>
                                        <div className="modal-navigation-buttons">
                                            <button
                                                className="back-button"
                                                onClick={() => setStep(1)}
                                            >
                                                뒤로
                                            </button>
                                            <button
                                                className="donate-submit-button"
                                                onClick={handleDonateSubmit}
                                            >
                                                {formatWithCommas(amount)}원 후원하기
                                            </button>
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default DonationView;

