import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import './Report.css';

const Report = () => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('reporterNo');

  const ITEMS_PER_PAGE = 10;

  const REPORT_STATE_URL = 'http://localhost:8081/api/admin/findReportState';
  const getJwtToken = () => localStorage.getItem('jwtToken');

  // ✅ 신고 목록 조회
  const fetchReports = async () => {
    const token = getJwtToken();
    if (!token) {
      setError('JWT 토큰 없음');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(REPORT_STATE_URL, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      setReports(data);
    } catch (err) {
      console.error(err);
      setError('신고 목록 불러오기 실패');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  // ✅ 검색 필터
  const filteredReports = reports.filter(report => {
    const term = searchTerm.toLowerCase();
    if (!term) return true;

    const value = report[searchType];
    return value && value.toString().toLowerCase().includes(term);
  });

  const offset = currentPage * ITEMS_PER_PAGE;
  const currentItems = filteredReports.slice(offset, offset + ITEMS_PER_PAGE);
  const pageCount = Math.ceil(filteredReports.length / ITEMS_PER_PAGE);
  const emptyRowsCount = ITEMS_PER_PAGE - currentItems.length;

  const getStatusText = (status) => {
    switch (status) {
      case 'P':
        return '대기';
      case 'C':
        return '철회';
      case 'R':
        return '완료';
      default:
        return status;
    }
  };

  const getReportTypeText = (type) => {
    switch (type) {
      case 'payComment':
        return '응원';
      case 'donationPost':
        return '기부게시글';
      default:
        return type;
    }
  };

  if (isLoading) return <div className="user-state-container">로딩 중...</div>;
  if (error) return <div className="user-state-container" style={{ color: 'red' }}>{error}</div>;

  return (
    <div className="user-state-container">
      <h1>신고 관리</h1>

      <div className="search-container">
        <select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
          <option value="reporterNo">신고자 번호</option>
          <option value="reportedNo">피신고자 번호</option>
        </select>
        <input
          type="text"
          placeholder="검색..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(0);
          }}
        />
      </div>

      <table className="user-state-table">
        <thead>
          <tr>
            <th>신고 번호</th>
            <th>신고자</th>
            <th>피신고자</th>
            <th>사유</th>
            <th>관리자</th>
            <th>유형</th>
            <th>상태</th>
            <th>신고일</th>
            <th>처리</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map(report => (
            <tr key={report.reportNo}>
              <td>{report.reportNo}</td>
              <td>{report.reporterId}</td>
              <td>{report.reportedId}</td>
              <td>{report.reportDetails}</td>
              <td>{report.adminNo}</td>
              <td>{getReportTypeText(report.reportType)}</td>
              <td>{getStatusText(report.reportStatus)}</td>
              <td>{report.reportDate}</td>
              <td>
                <button className="state-button change">처리</button>
              </td>
            </tr>
          ))}

          {emptyRowsCount > 0 && currentItems.length > 0 &&
            Array.from({ length: emptyRowsCount }).map((_, i) => (
              <tr key={`empty-${i}`} className="empty-row">
                <td colSpan="9">&nbsp;</td>
              </tr>
            ))
          }
        </tbody>
      </table>

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
    </div>
  );
};

export default Report;
