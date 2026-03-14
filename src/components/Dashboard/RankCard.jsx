import React from 'react';
import './RankCard.css';

function RankCard({ rank, name, amount, shapeClass }) {
  // shapeClass can be 'circle', 'hexagon', 'shield' to dictate styling
  return (
    <div className={`rank-card rank-${rank} ${shapeClass}`}>
      <div className="rank-badge">{rank}위</div>
      <div className="rank-avatar">
        <i className="fa-solid fa-user"></i>
      </div>
      <div className="rank-info">
        <h3 className="rank-name">{name}</h3>
        <p className="rank-amount">{amount.toLocaleString()} P</p>
      </div>
    </div>
  );
}

export default RankCard;
