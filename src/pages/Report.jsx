import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import './Report.css';
import ReportModal from '../components/ReportModal/ReportModal';
import api from '../api/axiosInstance';

const Report = () => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('reporterId');
  const [showPendingOnly, setShowPendingOnly] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const ITEMS_PER_PAGE = 10;

  const fetchReports = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/admin/findReportState');
      setReports(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || '신고 목록 불러오기 실패');
    } finally { setIsLoading(false); }
  };

  const changeReportState = async (reportNo, type) => {
    try {
      await api.get(type === 'C'
        ? `/api/admin/changeReportStateC?reportNo=${reportNo}`
        : `/api/admin/changeReportStateR?reportNo=${reportNo}`
      );
      alert(type === 'C' ? '신고가 철회되었습니다.' : '신고가 처리되었습니다.');
      fetchReports();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || '상태 변경 중 오류 발생');
    }
  };

  useEffect(() => { fetchReports(); }, []);
  const handlePageClick = e => setCurrentPage(e.selected);

  const filteredReports = reports.filter(report => {
    if (showPendingOnly && report.reportStatus !== 'P') return false;
    if (!searchTerm) return true;
    const value = report[searchType]?.toLowerCase();
    return value?.includes(searchTerm.toLowerCase());
  });

  const offset = currentPage * ITEMS_PER_PAGE;
  const currentItems = filteredReports.slice(offset, offset + ITEMS_PER_PAGE);
  const pageCount = Math.ceil(filteredReports.length / ITEMS_PER_PAGE);
  const emptyRowsCount = ITEMS_PER_PAGE - currentItems.length;

  const getStatusText = s => ({ P: '대기', C: '반려', R: '완료' }[s] || s);
  const getReportTypeText = t => ({ payComment: '응원글', donationPost: '기부게시글' }[t] || t);

  const handleOpenModal = report => { setSelectedReport(report); setIsModalOpen(true); };
  const handleCloseModal = () => { setSelectedReport(null); setIsModalOpen(false); };
  const handleConfirmReport = (report, type) => { changeReportState(report.reportNo, type); handleCloseModal(); };

  const renderReportDetails = report => {
    if (report.reportStatus === 'R') return <a href="#" onClick={e => { e.preventDefault(); alert('게시글 비활성화'); }}>{report.reportDetails}</a>;
    if (report.reportType === 'donationPost' && report.typeNo) return <Link to={`/donations/${report.typeNo}`}>{report.reportDetails}</Link>;
    if (report.reportType === 'payComment' && report.donationNo && report.typeNo) return <Link to={`/donations/${report.donationNo}#comment-${report.typeNo}`}>{report.reportDetails}</Link>;
    return report.reportDetails;
  };

  if (isLoading) return <div className="user-state-container">로딩 중...</div>;
  if (error) return <div className="user-state-container" style={{ color: 'red' }}>{error}</div>;

  return (
    <div className="user-state-container">
      <h1>신고</h1>
      <div className="search-container">
        <select value={searchType} onChange={e => setSearchType(e.target.value)}>
          <option value="reporterId">신고자</option>
          <option value="reportedId">피신고자</option>
        </select>
        <input type="text" placeholder="검색..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
      </div>
      <div className="toggle-container">
        <label>
          <input type="checkbox" checked={showPendingOnly} onChange={e => setShowPendingOnly(e.target.checked)} /> 대기 중인 신고만 보기
        </label>
      </div>

      <table className="user-state-table">
        <thead>
          <tr><th>번호</th><th>신고자</th><th>피신고자</th><th>신고 내용</th><th>관리자</th><th>유형</th><th>상태</th><th>신고일</th><th>확인</th></tr>
        </thead>
        <tbody>
          {currentItems.map(r => (
            <tr key={r.reportNo}>
              <td>{r.reportNo}</td>
              <td>{r.reporterId}</td>
              <td>{r.reportedId}</td>
              <td className="report-details-cell">{renderReportDetails(r)}</td>
              <td>{r.adminNo}</td>
              <td>{getReportTypeText(r.reportType)}</td>
              <td className={`report-state-${r.reportStatus}`}>{getStatusText(r.reportStatus)}</td>
              <td>{r.reportDate}</td>
              <td><button className="state-button change" onClick={() => handleOpenModal(r)}>신고</button></td>
            </tr>
          ))}
          {emptyRowsCount > 0 && currentItems.length > 0 && Array.from({ length: emptyRowsCount }).map((_, i) => (
            <tr key={`empty-${i}`} className="empty-row"><td colSpan="9">&nbsp;</td></tr>
          ))}
        </tbody>
      </table>

      <ReactPaginate previousLabel="이전" nextLabel="다음" breakLabel="..." pageCount={pageCount} marginPagesDisplayed={2} pageRangeDisplayed={5} onPageChange={handlePageClick} containerClassName="pagination" activeClassName="active" />

      {isModalOpen && selectedReport && <ReportModal report={selectedReport} onClose={handleCloseModal} onConfirm={handleConfirmReport} />}
    </div>
  );
};

export default Report;
