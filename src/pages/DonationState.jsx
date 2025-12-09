import React from 'react';
import './DonationState.css';

const DonationState = () => {
  return (
    <div className="donation-state-container">
      <h1>캠페인 상태</h1>
      <table className="donation-state-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>캠페인1</th>
            <th>캠페인2</th>
            <th>상태</th>
          </tr>
        </thead>
        <tbody>
          {[...Array(20)].map((_, rowIndex) => (
            <tr key={rowIndex}>
              <td>{`행 ${rowIndex + 1}, 셀 1`}</td>
              <td>{`행 ${rowIndex + 1}, 셀 2`}</td>
              <td>{`행 ${rowIndex + 1}, 셀 3`}</td>
              <td>{`행 ${rowIndex + 1}, 셀 4`}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DonationState;