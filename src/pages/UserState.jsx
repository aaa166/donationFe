import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import api from '../api/axiosInstance';
import './UserState.css';

const UserManagement = () => {
    const [userStates, setUserStates] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [reportHistories, setReportHistories] = useState([]);
    const [filterStatus, setFilterStatus] = useState('all'); // all, active, inactive

    const ITEMS_PER_PAGE = 10;
    const ROLE_MAP = { 0: '관리자', 1: '일반', 2: '기업' };
    const STATE_MAP = { 'A': '활성화', 'I': '비활성화' };

    const fetchUserData = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/api/admin/userState');
            setUserStates(res.data);
        } catch (err) {
            console.error('사용자 데이터 로드 실패', err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchReportHistory = async (userNo) => {
        try {
            const res = await api.get('/api/admin/findReportHistory', { params: { userNo } });
            setReportHistories(res.data);
        } catch (err) {
            setReportHistories([]);
        }
    };

    useEffect(() => { fetchUserData(); }, []);

    const handleOpenModal = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
        fetchReportHistory(user.userNo);
    };

    const handleCloseModal = () => {
        setSelectedUser(null);
        setReportHistories([]);
        setIsModalOpen(false);
    };

    const handleStateUpdate = async (newState) => {
        if (!selectedUser) return;
        try {
            await api.post('/api/admin/changeUserState', {
                userNo: selectedUser.userNo,
                userState: newState
            });
            fetchUserData();
            handleCloseModal();
        } catch (err) {
            alert('상태 변경 실패');
        }
    };

    const filteredUsers = userStates
        .filter(u => {
            if (filterStatus === 'active') return u.userState === 'A';
            if (filterStatus === 'inactive') return u.userState === 'I';
            return true;
        })
        .filter(u =>
            u.userId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.userEmail?.toLowerCase().includes(searchTerm.toLowerCase())
        );

    const offset = currentPage * ITEMS_PER_PAGE;
    const currentItems = filteredUsers.slice(offset, offset + ITEMS_PER_PAGE);
    const pageCount = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

    // 통계 데이터 계산
    const stats = {
        total: userStates.length,
        active: userStates.filter(u => u.userState === 'A').length,
        inactive: userStates.filter(u => u.userState === 'I').length
    };

    return (
        <div className="admin-layout">
            <header className="admin-header">
                <div className="header-title">
                    <h1>사용자 관리</h1>
                    <p>전체 사용자 정보와 제재 내역을 관리합니다.</p>
                </div>
                <div className="search-wrapper">
                    <input
                        type="text"
                        placeholder="ID, 이름, 이메일 검색..."
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(0); }}
                    />
                </div>
            </header>

            <div className="stats-container">
                <div className={`stat-card ${filterStatus === 'all' ? 'selected' : ''}`} onClick={() => setFilterStatus('all')}>
                    <span className="label">전체 사용자</span>
                    <span className="value">{stats.total}</span>
                </div>
                <div className={`stat-card active ${filterStatus === 'active' ? 'selected' : ''}`} onClick={() => setFilterStatus('active')}>
                    <span className="label">활성</span>
                    <span className="value">{stats.active}</span>
                </div>
                <div className={`stat-card inactive ${filterStatus === 'inactive' ? 'selected' : ''}`} onClick={() => setFilterStatus('inactive')}>
                    <span className="label">비활성/정지</span>
                    <span className="value">{stats.inactive}</span>
                </div>
            </div>

            <main className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>No</th><th>ID</th><th>이름</th><th>E-mail</th>
                            <th>Role</th><th>기부 금액</th><th className="status-cell">상태</th><th>상세 보기</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan="8" className="loading">데이터를 불러오는 중...</td></tr>
                        ) : currentItems.map(user => (
                            <tr key={user.userNo}>
                                <td>{user.userNo}</td>
                                <td className="font-bold">{user.userId}</td>
                                <td>{user.userName}</td>
                                <td className="text-sub">{user.userEmail}</td>
                                <td><span className={`role-badge role-${user.userRole}`}>{ROLE_MAP[user.userRole]}</span></td>
                                <td>{user.totalAmount?.toLocaleString()}원</td>
                                <td className="status-cell">
                                    <span className={`state-indicator state-${user.userState}`}>
                                        {STATE_MAP[user.userState]}
                                    </span>
                                </td>
                                <td>
                                    <button className="view-btn" onClick={() => handleOpenModal(user)}>조회</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <ReactPaginate
                    previousLabel={'이전'} nextLabel={'다음'}
                    pageCount={pageCount}
                    onPageChange={({ selected }) => setCurrentPage(selected)}
                    containerClassName={'pagination-bar'}
                    activeClassName={'active'}
                />
            </main>

            {isModalOpen && selectedUser && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-box" onClick={e => e.stopPropagation()}>
                        <button className="close-x" onClick={handleCloseModal}>&times;</button>
                        <h2>'{selectedUser.userId}' 상세 내역</h2>
                        
                        <div className="history-section">
                            <h3>신고 및 제재 기록</h3>
                            <div className="history-list">
                                {reportHistories.length > 0 ? reportHistories.map((r, i) => (
                                    <div key={i} className="history-item">
                                        <span className="h-date">{r.reportDate}</span>
                                        <p className="h-reason">{r.reportDetails}</p>
                                    </div>
                                )) : <p className="no-history">기록이 없습니다.</p>}
                            </div>
                        </div>

                        <div className="modal-footer">
                            {selectedUser.userState === 'A' ? (
                                <button onClick={() => handleStateUpdate('A')} className="action-btn block">계정 비활성화</button>
                            ) : (
                                <button onClick={() => handleStateUpdate('I')} className="action-btn activate">계정 활성화</button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;