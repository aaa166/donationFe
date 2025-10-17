// src/components/ProgressBar.js
import React from 'react';

// props에 기본값 = 0 을 할당합니다.
function ProgressBar({ current = 0, target = 0 }) {
    const percentage = target > 0 ? (current / target) * 100 : 0;

    return (
        <div className="progress-bar-container">
            {/* ... progress bar UI ... */}
            <div className="amounts">
                {/* 이제 current와 target이 undefined여도 0으로 안전하게 표시됩니다. */}
                <span className="current-amount">{current.toLocaleString()}원</span>
                <span className="target-amount">{target.toLocaleString()}원</span>
            </div>
        </div>
    );
}

export default ProgressBar;