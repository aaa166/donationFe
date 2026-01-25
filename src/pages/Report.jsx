import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import api from '../api/axiosInstance';
import ReportModal from '../components/ReportModal/ReportModal';
import './Report.css';

const Report = () => {
    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('reporterId');
    const [showPendingOnly, setShowPendingOnly] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);

    const ITEMS_PER_PAGE = 10;

    const fetchReports = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/api/admin/findReportState');
            setReports(res.data);
        } catch (err) { console.error(err); }
        finally { setIsLoading(false); }
    };

    useEffect(() => { fetchReports(); }, []);

    const filteredReports = reports.filter(r => {
        if (showPendingOnly && r.reportStatus !== 'P') return false;
        const value = r[searchType]?.toLowerCase();
        return value?.includes(searchTerm.toLowerCase());
    });

    const currentItems = filteredReports.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);
    const pageCount = Math.ceil(filteredReports.length / ITEMS_PER_PAGE);

    const stats = {
        total: reports.length,
        pending: reports.filter(r => r.reportStatus === 'P').length,
        resolved: reports.filter(r => r.reportStatus === 'R').length
    };

    const getStatusText = s => ({ P: '대기', C: '반려', R: '완료' }[s] || s);
    const getReportTypeText = t => ({ payComment: '응원글', donationPost: '기부게시글' }[t] || t);

    return (
        <div className="admin-layout">
            <header className="admin-header">
                <div className="header-title">
                    <h1>신고 관리</h1>
                    <p>커뮤니티 내 접수된 신고 내역을 검토하고 처리합니다.</p>
                </div>
                <div className="header-actions">
                    <label className="toggle-pending">
                        <input type="checkbox" checked={showPendingOnly} onChange={e => setShowPendingOnly(e.target.checked)} />
                        <span>대기 중인 신고만</span>
                    </label>
                    <div className="search-group">
                        <select value={searchType} onChange={e => setSearchType(e.target.value)}>
                            <option value="reporterId">신고자 ID</option>
                            <option value="reportedId">피신고자 ID</option>
                        </select>
                        <input 
                            type="text" 
                            placeholder="검색어 입력..." 
                            value={searchTerm} 
                            onChange={e => setSearchTerm(e.target.value)} 
                        />
                    </div>
                </div>
            </header>

            <div className="stats-container">
                <div className="stat-card">
                    <span className="label">누적 신고 건수</span>
                    <span className="value">{stats.total}</span>
                </div>
                <div className="stat-card pending">
                    <span className="label">미처리 신고</span>
                    <span className="value">{stats.pending}</span>
                </div>
                <div className="stat-card resolved">
                    <span className="label">처리 완료</span>
                    <span className="value">{stats.resolved}</span>
                </div>
            </div>

            <main className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th className="report-no">No</th>
                            <th className="report-repoter">신고자</th>
                            <th className="report-repoted">피신고자</th>
                            <th className="report-manager">관리자</th>
                            <th className="report-details">신고 내용</th>
                            <th className="report-type">유형</th>
                            <th className="report-state">상태</th>
                            <th className="report-date">신고일</th>
                            <th className="report-view">관리</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan="8" className="loading">데이터 로드 중...</td></tr>
                        ) : currentItems.map(r => (
                            <tr key={r.reportNo}>
                                <td>{r.reportNo}</td>
                                <td className="font-bold">{r.reporterId}</td>
                                <td className="font-bold text-danger">{r.reportedId}</td>
                                <td>{r.adminNo}</td>
                                <td className="report-details-cell">{r.reportDetails}</td>
                                <td><span className="type-tag">{getReportTypeText(r.reportType)}</span></td>
                                <td>
                                    <span className={`state-badge report-state-${r.reportStatus}`}>
                                        {getStatusText(r.reportStatus)}
                                    </span>
                                </td>
                                <td className="text-sub">{r.reportDate}</td>
                                <td>
                                    <button className="view-btn" onClick={() => { setSelectedReport(r); setIsModalOpen(true); }}>
                                        검토
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <ReactPaginate
                    previousLabel="이전" nextLabel="다음"
                    pageCount={pageCount}
                    onPageChange={({ selected }) => setCurrentPage(selected)}
                    containerClassName="pagination-bar"
                    activeClassName="active"
                />
            </main>

            {isModalOpen && selectedReport && (
                <ReportModal 
                    report={selectedReport} 
                    onClose={() => setIsModalOpen(false)} 
                    onConfirm={() => { fetchReports(); setIsModalOpen(false); }} 
                />
            )}
        </div>
    );
};

export default Report;