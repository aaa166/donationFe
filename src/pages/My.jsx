import React, { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import './My.css';
import { 
  User, Mail, Phone, Shield, ChevronRight, X 
} from 'lucide-react';

const My = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [userInfo, setUserInfo] = useState(null);
  const [myDonation, setMyDonation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 프로필 수정 모달
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    userId: '',
    userEmail: '',
    userPhone: ''
  });

  // 중복확인 상태
  const [checkStatus, setCheckStatus] = useState({
    userId: false,
    userEmail: false,
    userPhone: false
  });

  // 저장 버튼 활성화
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);

  // 데이터 불러오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, donationRes] = await Promise.all([
          api.get('/api/mypage'),
          api.get('/api/mydonation')
        ]);
        setUserInfo(userRes.data);
        setMyDonation(donationRes.data);

        // 모달 초기값
        setEditForm({
          userId: userRes.data.userId,
          userEmail: userRes.data.userEmail,
          userPhone: userRes.data.userPhone
        });
      } catch {
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 입력값 변경 감지 + 저장 버튼 활성화
  useEffect(() => {
    if (!userInfo) return;
    const isChanged =
      editForm.userId !== userInfo.userId ||
      editForm.userEmail !== userInfo.userEmail ||
      editForm.userPhone !== userInfo.userPhone;

    if (!isChanged) {
      setCheckStatus({ userId: false, userEmail: false, userPhone: false });
    }

    setIsSaveEnabled(
      isChanged && Object.values(checkStatus).some(Boolean)
    );
  }, [editForm, checkStatus, userInfo]);

  // 중복 확인
  const handleCheckDuplicate = async (field) => {
    try {
      let url = '';
      let paramName = '';
      if (field === 'userId') {
        url = '/api/duplicateIdCheck';
        paramName = 'userId';
      } else if (field === 'userEmail') {
        url = '/api/duplicateEmailCheck';
        paramName = 'email';
      } else if (field === 'userPhone') {
        url = '/api/duplicatePhoneCheck';
        paramName = 'phone';
      }

      await api.get(url, { params: { [paramName]: editForm[field] } });
      setCheckStatus(prev => ({ ...prev, [field]: true }));
    } catch (error) {
      if (error.response && error.response.status === 409) {
        alert(`${field} 이미 사용 중입니다.`);
        setCheckStatus(prev => ({ ...prev, [field]: false }));
      } else {
        alert('중복 확인 중 오류가 발생했습니다.');
      }
    }
  };

  // 모달 닫기 + 초기화
  const closeEditModal = () => {
    setIsEditModalOpen(false);

    if (userInfo) {
      setEditForm({
        userId: userInfo.userId,
        userEmail: userInfo.userEmail,
        userPhone: userInfo.userPhone
      });
      setCheckStatus({ userId: false, userEmail: false, userPhone: false });
      setIsSaveEnabled(false);
    }
  };

  // 수정 저장
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!isSaveEnabled) return;

    try {
      await api.patch('/api/updateUserInfo', editForm);
      alert('프로필 정보가 수정되었습니다.');

      // 아이디가 바뀌었으면 강제 로그아웃
      if (userInfo.userId !== editForm.userId) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.replace('/'); // 새로고침 + 홈 이동
        return;
      }

      // 모달 닫기 및 초기화
      closeEditModal();

      const userRes = await api.get('/api/mypage');
      setUserInfo(userRes.data);
    } catch {
      alert('수정 중 오류가 발생했습니다.');
    }
  };

  if (loading) return <div className="loading-state">데이터를 불러오는 중...</div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="desktop-my-page">
      {/* Hero Section */}
      <header className="profile-hero">
        <div className="hero-content">
          <div className="user-meta">
            <div className="avatar-wrapper"><User size={70} /></div>
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

      {/* Tabs */}
      <nav className="my-tabs-nav">
        <button className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>마이홈</button>
        <button className={`nav-item ${activeTab === 'donations' ? 'active' : ''}`} onClick={() => setActiveTab('donations')}>기부 내역</button>
      </nav>

      <main className="tab-content-area">
        {activeTab === 'home' ? (
          <div className="home-grid">
            <section className="info-section">
              <h3>계정 정보</h3>
              <div className="info-cards-container">
                <InfoCard icon={<User />} label="이름" value={userInfo.userName} />
                <InfoCard icon={<User />} label="아이디" value={userInfo.userId} />
                <InfoCard icon={<Mail />} label="이메일" value={userInfo.userEmail} />
                <InfoCard icon={<Phone />} label="연락처" value={userInfo.userPhone} />
                <InfoCard icon={<Shield />} label="계정 유형" value={userInfo.userRole === 0 ? '관리자' : userInfo.userRole === 1 ? '일반' : '기업'} />
              </div>
            </section>

            <aside className="sidebar-section">
              <div className="action-card settings">
                <h4>계정 설정</h4>
                <button className="action-btn1" onClick={() => setIsEditModalOpen(true)}>프로필 수정 <ChevronRight size={16} /></button>
                <button className="action-btn1">비밀번호 변경 <ChevronRight size={16} /></button>
                <button className="logout-btn" onClick={() => {
                  localStorage.removeItem('accessToken');
                  localStorage.removeItem('refreshToken');
                  window.location.replace('/');
                }}>로그아웃</button>
              </div>
            </aside>
          </div>
        ) : (
          <div className="donation-view">
            <div className="view-header"><h3>나의 기부 내역</h3></div>
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

      {/* 프로필 수정 모달 */}
      {isEditModalOpen && (
        <div className="modal-overlay" onClick={closeEditModal}>
          <div className="modal-box profile-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close-x" onClick={closeEditModal}><X size={32} /></button>
            <div className="modal-header">
              <h2>프로필 수정</h2>
              <p>계정 정보를 최신으로 유지해 주세요.</p>
            </div>

            <form onSubmit={handleEditSubmit} className="edit-form">
              {['userId','userEmail','userPhone'].map(field => (
                <div className="form-group" key={field}>
                  <label>{field === 'userId' ? '아이디' : field === 'userEmail' ? '이메일' : '연락처'}</label>
                  <div className="input-with-btn">
                    <input 
                      type={field === 'userEmail' ? 'email' : 'text'}
                      value={editForm[field]}
                      onChange={e => {
                        setEditForm({...editForm, [field]: e.target.value});
                        setCheckStatus(prev => ({ ...prev, [field]: false }));
                      }}
                    />
                    {editForm[field] !== userInfo[field] && (
                      <button type="button" className="duplicate-btn" onClick={() => handleCheckDuplicate(field)}>
                        중복확인
                      </button>
                    )}
                    {checkStatus[field] && <span className="check-mark">✔</span>}
                  </div>
                </div>
              ))}
              <div className="modal-footer">
                <button type="button" className="action-btn cancel" onClick={closeEditModal}>취소</button>
                <button type="submit" className="action-btn save" disabled={!isSaveEnabled}>저장하기</button>
              </div>
            </form>

          </div>
        </div>
      )}
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
