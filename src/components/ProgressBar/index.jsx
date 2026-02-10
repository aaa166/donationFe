// src/components/ProgressBar.js
import React from 'react';
import './style.css';

// props에 기본값 = 0 을 할당합니다.
function ProgressBar({ current = 0, target = 0 }) {
    const percentage = target > 0 ? (current / target) * 100 : 0;

    return (
        <div className="progress_bar_container">
            <div className="progress_bar">
                <div className="progress" style={{ width: `${percentage}%` }}></div>
            </div>
            <div className="amount_info">
                <span className="current_amount">모금 : {current.toLocaleString()}원</span>
                <span className="percentage">{Math.floor(percentage)}%</span>
            </div>
        </div>
    );
}

export default ProgressBar;