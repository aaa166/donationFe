import React, { useState } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import './ChocobeanLoginPage.css';

const ChocobeanLoginPage = () => {
  const { isLoggedIn, setIsLoggedIn } = useOutletContext();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [autoLogin, setAutoLogin] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:8081/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: email,
          password: password
        }),
      });


      if (response.ok) {
        const data = await response.json();
        const token = data.token;
        localStorage.setItem('jwt', token);
        
        setIsLoggedIn(true);
        console.log('Login successful:', data);

        navigate('/');
      } else {
        console.error('Login failed:', response.statusText);
        alert('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.');
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
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
            <span className="chocobean-icon">🍫</span>
            <h1>초코빈 ID 로그인</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="chocobean-form">
          <div className="input-group">
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="아이디"
              required
              className="chocobean-input"
            />
          </div>
          
          <div className="input-group">
            <input
              type="password"
              id="password"
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

export default ChocobeanLoginPage;