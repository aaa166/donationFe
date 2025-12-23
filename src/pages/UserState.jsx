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

    const API_URL = 'http://localhost:8081/api/auth/admin/userState';
    const UPDATE_API_URL = 'http://localhost:8081/api/admin/users'; // Assumed endpoint
    const ITEMS_PER_PAGE = 10;

    const ROLE_MAP = {
        0: '관리자',
        1: '일반',
        2: '기업',
    };

    const STATE_MAP = {
        'A': '활성화',
        'I': '비활성화',
    };

    const getJwtToken = () => {
        const token = localStorage.getItem('jwtToken'); 
        if (!token) {
            console.error("JWT 토큰을 찾을 수 없습니다. 로그인 상태를 확인하세요.");
            return null;
        }
        return token;
    };

    const fetchUserData = async () => {
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
            setUserStates(data);

        } catch (err) {
            console.error("데이터 가져오기 실패:", err);
            setError(err.message || "사용자 데이터를 가져오는 데 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleStateUpdate = async (userId, newState) => {
        const token = getJwtToken();
        if (!token) {
            alert("인증 토큰이 없습니다. 로그인 상태를 확인하세요.");
            return;
        }

        if (!window.confirm(`사용자 '${userId}'의 상태를 '${STATE_MAP[newState]}'로 변경하시겠습니까?`)) {
            return;
        }

        try {
            const response = await fetch(`${UPDATE_API_URL}/${userId}/state`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify({ state: newState })
            });

            if (!response.ok) {
                const errorBody = await response.text(); 
                throw new Error(`상태 변경 실패: ${response.status} - ${errorBody || '서버 오류'}`);
            }

            alert(`'${userId}' 사용자의 상태가 성공적으로 변경되었습니다.`);
            await fetchUserData();
            handleCloseModal();

        } catch (err) {
            console.error("상태 업데이트 실패:", err);
            setError(err.message || "상태 업데이트 중 알 수 없는 오류가 발생했습니다.");
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []); 

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    const handleOpenModal = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    const filteredUsers = userStates.filter(user => {
        const searchLower = searchTerm.toLowerCase();
        return (
            (user.userId && user.userId.toLowerCase().includes(searchLower)) ||
            (user.userName && user.userName.toLowerCase().includes(searchLower)) ||
            (user.userEmail && user.userEmail.toLowerCase().includes(searchLower))
        );
    });

    const offset = currentPage * ITEMS_PER_PAGE;
    const currentItems = filteredUsers.slice(offset, offset + ITEMS_PER_PAGE);
    const pageCount = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
    const emptyRowsCount = ITEMS_PER_PAGE - currentItems.length;

    if (isLoading) {
        return <div className="user-state-container">데이터를 불러오는 중...</div>;
    }

    if (error) {
        return <div className="user-state-container" style={{ color: 'red', fontWeight: 'bold' }}>오류: {error}</div>;
    }

    return (
        <div className="user-state-container">
            <h1>사용자 관리</h1>
            <div className="search-container">
                <input
                    type="text"
                    placeholder="ID, 이름, 이메일로 검색"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(0); // Reset to first page on new search
                    }}
                />
            </div>
            <table className="user-state-table">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>ID</th>
                        <th>이름</th>
                        <th>E-mail</th>
                        <th>전화번호</th>
                        <th>Role</th>
                        <th>기부 금액</th>
                        <th>상태</th>
                        <th>제제 내역</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((user) => (
                        <tr key={user.userNo}>
                            <td>{user.userNo}</td>
                            <td>{user.userId}</td>
                            <td>{user.userName}</td>
                            <td>{user.userEmail}</td>
                            <td>{user.userPhone}</td>
                            <td>{ROLE_MAP[user.userRole] || 'Unknown'}</td>
                            <td>{user.totalAmount.toLocaleString()}원</td>
                            <td className={`state-${user.userState}`}>{STATE_MAP[user.userState] || 'Unknown'}</td>
                            <td>
                                <button onClick={() => handleOpenModal(user)} className="state-button change">보기</button>
                            </td>
                        </tr>
                    ))}
                    {emptyRowsCount > 0 && currentItems.length > 0 && Array.from({ length: emptyRowsCount }).map((_, index) => (
                        <tr key={`empty-${index}`} className="empty-row">
                            <td>&nbsp;</td>
                            <td>&nbsp;</td>
                            <td>&nbsp;</td>
                            <td>&nbsp;</td>
                            <td>&nbsp;</td>
                            <td>&nbsp;</td>
                            <td>&nbsp;</td>
                            <td>&nbsp;</td>
                            <td>&nbsp;</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {userStates.length > 0 && filteredUsers.length === 0 && <p>검색 결과가 없습니다.</p>}
            {userStates.length === 0 && <p>등록된 사용자가 없습니다.</p>}
            <ReactPaginate
                previousLabel={'이전'}
                nextLabel={'다음'}
                breakLabel={'...'}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={'pagination'}
                activeClassName={'active'}
            />

            {isModalOpen && selectedUser && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-button" onClick={handleCloseModal}>&times;</button>
                        <h2>'{selectedUser.userId}' 경고 내역</h2>
                        <div className="warning-history">
                                        {selectedUser.userWarningHistory && selectedUser.userWarningHistory.length > 0 ? (
                                            <ul>
                                                {selectedUser.userWarningHistory.map((warning, index) => (
                                                    <li key={index}>{warning}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p>경고 내역이 없습니다.</p>
                                        )}
                                    </div>
                        <div className="modal-state-buttons">
                            {selectedUser.userState === 'A' && (
                                <>
                                    
                                    <button  className="state-button suspend">추가</button>
                                    <button  className="state-button delete">비활</button>
                                </>
                            )}
                            {selectedUser.userState === 'I' && (
                                    <button onClick={() => handleStateUpdate(selectedUser.userId, 'A')} className="state-button activate">활성</button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserState;
