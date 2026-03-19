import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../api/axiosInstance';
import api from '../api/axiosInstance';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();

  const handleSocialLogin = (provider) => {
    if (provider === 'chocobean') {
      navigate('/login/chocobean');
    } else {
      window.location.href = `${API_BASE_URL}/oauth2/authorization/${provider}`;
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const loginSuccess = params.get('loginSuccess');
    if (loginSuccess === 'true') {
      api.get('/api/auth/me')
        .then(() => {
          localStorage.setItem('isLoggedIn', 'true');
          navigate('/', { replace: true });
        })
        .catch(() => navigate('/login', { replace: true }));
    }
  }, [navigate]);

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">
          반가워요!<br />
          계정을 선택해주세요.
        </h1>
        <div className="social-login-section">
          <div className="social-buttons">
            <button className="social-btn chocobean-btn" onClick={() => handleSocialLogin('chocobean')}>
              <span className="social-icon chocobean-icon">🍫</span>
              초코빈
            </button>
            <button className="social-btn naver-btn" onClick={() => handleSocialLogin('naver')}>
              <span className="social-icon naver-icon">N</span>
              네이버
            </button>
            <button className="social-btn kakao-btn" onClick={() => handleSocialLogin('kakao')}>
              <span className="social-icon kakao-icon">K</span>
              카카오
            </button>
            <button className="social-btn google-btn" onClick={() => handleSocialLogin('google')}>
              <span className="social-icon google-icon">G</span>
              Google
            </button>
          </div>
        </div>
        <div className="forgot-id">
          <Link to="#">아이디를 잊으셨나요?</Link>
        </div>
        <div className="signup-prompt">
          <span>아직 계정이 없으신가요?</span>
          <Link to="/signup/chocobean">회원가입</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
