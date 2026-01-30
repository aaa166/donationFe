import { Link } from 'react-router-dom';
import './Header.css';
import { User, LogOut, Heart } from 'lucide-react'; // 아이콘 추가

const Header = ({ isLoggedIn, handleLogout }) => {
  return (
    <header className="main-header">
      <div className="header-container">
        {/* 로고 영역 */}
        <div className="logo-section">
          <Link to="/" className="logo">
            <Heart className="logo-icon" fill="#00b894" color="#00b894" />
            <span>ChocoBean</span>
            <ul className="nav-list">
            {/* <li className="nav-item"><Link to="/">홈</Link></li> */}
            <li className="nav-item"><Link to="/support">문의</Link></li>
            <li className="nav-item">
              <Link to="/donationApply" className="donation-apply-btn">
                기부 신청하기
              </Link>
            </li>
          </ul>
          </Link>
        </div>

        
        

        {/* 우측 사용자 액션 영역 */}
        <div className="user-section">
          {isLoggedIn ? (
            <div className="user-menu">
              <Link to="/my" className="mypage-link">
                <div className="user-avatar-mini">
                  <User size={18} />
                </div>
                <span>마이페이지</span>
              </Link>
              <button onClick={() => {
                handleLogout();
                window.location.href = "/";}} 
                className="header-logout-btn">
                <LogOut size={18} />
                <span>로그아웃</span>
              </button>
            </div>
          ) : (
            <Link to="/login" className="login-link">로그인</Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;