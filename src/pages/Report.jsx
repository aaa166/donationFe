import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';
import './Report.css';

const Report = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const ITEMS_PER_PAGE = 10;

  // Dummy data for the report table
  const reports = [
    { reportId: 1, reporter: 'user123', reportedUser: 'user456', reason: 'Inappropriate content in review', date: '2025-12-30' },
    { reportId: 2, reporter: 'user789', reportedUser: 'user123', reason: 'Spamming', date: '2025-12-29' },
    { reportId: 3, reporter: 'user101', reportedUser: 'user202', reason: 'Fake account', date: '2025-12-28' },
    { reportId: 4, reporter: 'user303', reportedUser: 'user404', reason: 'Harassment', date: '2025-12-27' },
    { reportId: 5, reporter: 'user505', reportedUser: 'user606', reason: 'Inappropriate content in review', date: '2025-12-26' },
    { reportId: 6, reporter: 'user707', reportedUser: 'user808', reason: 'Spamming', date: '2025-12-25' },
    { reportId: 7, reporter: 'user909', reportedUser: 'user101', reason: 'Fake account', date: '2025-12-24' },
    { reportId: 8, reporter: 'user112', reportedUser: 'user113', reason: 'Harassment', date: '2025-12-23' },
    { reportId: 9, reporter: 'user114', reportedUser: 'user115', reason: 'Inappropriate content in review', date: '2025-12-22' },
    { reportId: 10, reporter: 'user116', reportedUser: 'user117', reason: 'Spamming', date: '2025-12-21' },
    { reportId: 11, reporter: 'user118', reportedUser: 'user119', reason: 'Fake account', date: '2025-12-20' },
  ];

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const offset = currentPage * ITEMS_PER_PAGE;
  const currentItems = reports.slice(offset, offset + ITEMS_PER_PAGE);
  const pageCount = Math.ceil(reports.length / ITEMS_PER_PAGE);
  const emptyRowsCount = ITEMS_PER_PAGE - currentItems.length;

  return (
    <div className="user-state-container">
      <h1>신고 관리</h1>
      <table className="user-state-table">
        <thead>
          <tr>
            <th>신고 ID</th>
            <th>신고자</th>
            <th>신고된 사용자</th>
            <th>사유</th>
            <th>신고일</th>
            <th>처리</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((report) => (
            <tr key={report.reportId}>
              <td>{report.reportId}</td>
              <td>{report.reporter}</td>
              <td>{report.reportedUser}</td>
              <td>{report.reason}</td>
              <td>{report.date}</td>
              <td>
                <button className="state-button change">처리</button>
              </td>
            </tr>
          ))}
          {emptyRowsCount > 0 && Array.from({ length: emptyRowsCount }).map((_, index) => (
            <tr key={`empty-${index}`} className="empty-row">
              <td colSpan="6">&nbsp;</td>
            </tr>
          ))}
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
