import React, { useState } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import api from '../api/axiosInstance';
import './ChocobeanLogin.css';

const ChocobeanLogin = () => {
  const { setIsLoggedIn, setIsAdmin } = useOutletContext();

  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [autoLogin, setAutoLogin] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const data = (await api.post('/api/auth/login', { id, password })).data;

      // ✅ 쿠키가 자동으로 저장되므로 토큰을 localStorage에 저장하지 않습니다.
      localStorage.setItem('isLoggedIn', 'true');

      // 로그인 직후 내 정보 조회하여 role 획득
      const mypageRes = await api.get('/api/mypage');
      const role = mypageRes.data.userRole;

      // 상태 업데이트
      setIsLoggedIn(true);
      setIsAdmin(role === 'ROLE_ADMIN' || role === 0 || role === 'admin');

      console.log('Login successful:', data);

      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      alert('로그인 실패: 아이디와 비밀번호를 확인해주세요.');
    }
  };

  const handleBackToSocialLogin = () => {
    navigate('/login');
  };

  return (
    <div className="chocobean-login-container">
      <div className="chocobean-login-box">
        <button className="back-button" onClick={handleBackToSocialLogin}>
          ← 뒤로
        </button>

        <div className="chocobean-header">
          <div className="chocobean-logo">
            <span className="chocobean-icon1">🍫</span>
            <h1>초코빈 ID 로그인</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="chocobean-form">
          <div className="input-group">
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="아이디"
              required
              className="chocobean-input"
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              required
              className="chocobean-input"
            />
          </div>

          <div className="auto-login-section">
            <label className="auto-login-checkbox">
              <input
                type="checkbox"
                checked={autoLogin}
                onChange={(e) => setAutoLogin(e.target.checked)}
              />
              <span className="checkmark"></span>
              자동 로그인
            </label>
          </div>

          <button type="submit" className="chocobean-login-button">
            로그인
          </button>
        </form>

        <div className="help-links">
          <Link to="#" className="help-link">아이디 찾기</Link>
          <span className="separator">|</span>
          <Link to="#" className="help-link">비밀번호 찾기</Link>
          <span className="separator">|</span>
          <Link to="/signup/chocobean" className="help-link">회원가입</Link>
        </div>
      </div>
    </div>
  );
};

export default ChocobeanLogin;
