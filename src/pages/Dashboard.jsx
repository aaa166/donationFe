import React from 'react';
import RankCard from '../components/Dashboard/RankCard';
import ProgressBar from '../components/ProgressBar';
import './Dashboard.css';

function Dashboard() {
  // Mock data for ranking
  const topDonors = [
    { rank: 2, name: '김코딩', amount: 450000, shapeClass: 'shield' },
    { rank: 1, name: '이초코', amount: 820000, shapeClass: 'hexagon' },
    { rank: 3, name: '박비엔', amount: 310000, shapeClass: 'circle' },
  ];

  // Mock data for progress
  const currentDonation = 5230000;
  const targetDonation = 10000000;
  
  // Deadline calculation
  const deadlineDate = new Date();
  deadlineDate.setDate(deadlineDate.getDate() + 14); // 14 days from now
  const daysLeft = Math.ceil((deadlineDate - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">
          <span className="highlight">기부 현황</span> 대시보드
        </h1>
        <p className="dashboard-subtitle">여러분의 따뜻한 마음이 모여 세상을 바꿉니다.</p>
      </div>

      <div className="dashboard-content">
        <section className="ranking-section">
          <h2 className="section-title">🏆 명예의 전당 TOP 3</h2>
          <div className="podium-container">
            {topDonors.map((donor) => (
              <RankCard
                key={donor.rank}
                rank={donor.rank}
                name={donor.name}
                amount={donor.amount}
                shapeClass={donor.shapeClass}
              />
            ))}
          </div>
        </section>

        <section className="progress-section">
          <div className="progress-header">
            <h2 className="section-title">진행 상황</h2>
            <div className="deadline-badge">D-{daysLeft}</div>
          </div>
          
          <div className="progress-card">
            <div className="progress-info-row">
              <div className="progress-stat">
                <span className="stat-label">목표 금액</span>
                <span className="stat-value">{targetDonation.toLocaleString()}원</span>
              </div>
              <div className="progress-stat right">
                <span className="stat-label">달성 금액</span>
                <span className="stat-value highlight">{currentDonation.toLocaleString()}원</span>
              </div>
            </div>
            
            <div className="progress-bar-wrapper">
               <ProgressBar current={currentDonation} target={targetDonation} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
