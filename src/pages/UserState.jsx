import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import './UserState.css';

const UserState = () => {
    const [userStates, setUserStates] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [reportHistories, setReportHistories] = useState([]);

    const REPORT_HISTORY_URL = 'http://localhost:8081/api/findReportHistory';
    const API_URL = 'http://localhost:8081/api/auth/admin/userState';
    const CHANGE_STATE_URL = 'http://localhost:8081/api/auth/admin/changeUserState';
    const ITEMS_PER_PAGE = 10;

    const ROLE_MAP = { 0: '관리자', 1: '일반', 2: '기업' };
    const STATE_MAP = { 'A': '활성화', 'I': '비활성화' };

    const getJwtToken = () => localStorage.getItem('jwtToken');


    const fetchReportHistory = async (userNo) => {
        const token = getJwtToken();
        if (!token) {
            alert('JWT 토큰 없음');
            return;
        }

        try {
            const res = await fetch(
                `${REPORT_HISTORY_URL}?userNo=${userNo}`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const data = await res.json();
            setReportHistories(data);
        } catch (err) {
            console.error(err);
            setReportHistories([]);
        }
    };

    // 1️⃣ 사용자 데이터 가져오기
    const fetchUserData = async () => {
        setIsLoading(true);
        setError(null);
        const token = getJwtToken();
        if (!token) { setError('JWT 토큰 없음'); setIsLoading(false); return; }

        try {
            const res = await fetch(API_URL, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            setUserStates(data);
        } catch (err) {
            setError(err.message || '사용자 데이터 불러오기 실패');
        } finally { setIsLoading(false); }
    };

    useEffect(() => { fetchUserData(); }, []);

    // 2️⃣ 페이지 변경
    const handlePageClick = (event) => setCurrentPage(event.selected);

    // 3️⃣ 모달 열기/닫기
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

    // 4️⃣ 검색 필터
    const filteredUsers = userStates.filter(u => {
        const term = searchTerm.toLowerCase();
        return u.userId?.toLowerCase().includes(term) ||
               u.userName?.toLowerCase().includes(term) ||
               u.userEmail?.toLowerCase().includes(term);
    });

    const offset = currentPage * ITEMS_PER_PAGE;
    const currentItems = filteredUsers.slice(offset, offset + ITEMS_PER_PAGE);
    const pageCount = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
    const emptyRowsCount = ITEMS_PER_PAGE - currentItems.length;

    // 5️⃣ 상태 변경 함수
    const handleStateUpdate = async (newState) => {
        if (!selectedUser) return;
        const token = getJwtToken();
        if (!token) { alert('JWT 없음'); return; }


        try {
            const res = await fetch(CHANGE_STATE_URL, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userNo: selectedUser.userNo,
                    userRole: selectedUser.userRole,
                    userState: newState
                })
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            fetchUserData();
            handleCloseModal();
        } catch (err) {
            console.error(err);
            alert('상태 변경 실패');
        }
    };

    if (isLoading) return <div className="user-state-container">데이터 로딩 중...</div>;
    if (error) return <div className="user-state-container" style={{ color: 'red' }}>오류: {error}</div>;

    return (
        <div className="user-state-container">
            <h1>사용자 관리</h1>

            <div className="search-container">
                <input
                    type="text"
                    placeholder="ID, 이름, 이메일 검색"
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(0); }}
                />
            </div>

            <table className="user-state-table">
                <thead>
                    <tr>
                        <th>No</th><th>ID</th><th>이름</th><th>E-mail</th><th>전화번호</th>
                        <th>Role</th><th>기부 금액</th><th>상태</th><th>제재 내역</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map(user => (
                        <tr key={user.userNo}>
                            <td>{user.userNo}</td>
                            <td>{user.userId}</td>
                            <td>{user.userName}</td>
                            <td>{user.userEmail}</td>
                            <td>{user.userPhone}</td>
                            <td>{ROLE_MAP[user.userRole] || 'Unknown'}</td>
                            <td>{user.totalAmount.toLocaleString()}원</td>
                            <td className={`state-${user.userState}`}>{STATE_MAP[user.userState]}</td>
                            <td>
                                <button className="state-button change" onClick={() => handleOpenModal(user)}>보기</button>
                            </td>
                        </tr>
                    ))}
                    {emptyRowsCount > 0 && currentItems.length > 0 && Array.from({ length: emptyRowsCount }).map((_, i) => (
                        <tr key={`empty-${i}`} className="empty-row"><td colSpan="9">&nbsp;</td></tr>
                    ))}
                </tbody>
            </table>

            <ReactPaginate
                previousLabel={'이전'} nextLabel={'다음'} breakLabel={'...'}
                pageCount={pageCount} marginPagesDisplayed={2} pageRangeDisplayed={5}
                onPageChange={handlePageClick} containerClassName={'pagination'} activeClassName={'active'}
            />

            {/* 모달 */}
            {isModalOpen && selectedUser && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="close-button" onClick={handleCloseModal}>&times;</button>
                        <h2>'{selectedUser.userId}' 경고 내역</h2>
                        <div className="warning-history">
                            {reportHistories.length > 0 ? (
                                <ul>
                                    {reportHistories.map((report, index) => (
                                        <li key={index}>
                                            <div>신고일: {report.reportDate}</div>
                                            <div>사유: {report.reportDetails}</div>
                                            <div>상태: {report.reportStatus}</div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>제재 내역 없음</p>
                            )}
                        </div>
                        <div className="modal-state-buttons">
                            {selectedUser.userState === 'A' && (
                                <button onClick={() => handleStateUpdate('A')} className="state-button delete">비활</button>
                            )}
                            {selectedUser.userState === 'I' && (
                                <button onClick={() => handleStateUpdate('I')} className="state-button activate">활성</button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserState;
