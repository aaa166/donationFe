import React from 'react';
import './ReportModal.css';

const ReportModal = ({ report, onClose, onConfirm }) => {
  if (!report) {
    return null;
  }

  const getReportTypeText = (type) => {
    switch (type) {
      case 'payComment':
        return '응원글';
      case 'donationPost':
        return '기부게시글';
      default:
        return type;
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <button onClick={onClose} className="btn-close">&times;</button>
        <h2>신고 처리</h2>
        <div className="report-details">
          <p><strong>유형:</strong> {getReportTypeText(report.reportType)}</p>
          <p><strong>현재 상태:</strong> {report.reportStatus}</p>
          <p><strong>신고 내용:</strong> {report.reportDetails}</p>
        </div>
        <div className="modal-actions">
          <button
            onClick={() => onConfirm(report, 'C')}
            className="btn-cancel"
          >
            반려
          </button>

          <button
            onClick={() => onConfirm(report, 'R')}
            className="btn-confirm"
          >
            신고
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
