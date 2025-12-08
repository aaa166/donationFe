import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [loginMethod, setLoginMethod] = useState('social');

  const navigate = useNavigate();

  const handleSocialLogin = (provider) => {
    if (provider === 'chocobean') {
      navigate('/login/chocobean');
    } else {
      console.log(`Login with ${provider}`);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">반가워요!<br />계정을 선택해주세요.</h1>
        
        <div className="social-login-section">
          <div className="social-buttons">
            <button 
              className="social-btn chocobean-btn"
              onClick={() => handleSocialLogin('chocobean')}
            >
              <span className="social-icon chocobean-icon">🍫</span>
              초코빈
            </button>
            
            <button 
              className="social-btn naver-btn"
              onClick={() => handleSocialLogin('naver')}
            >
              <span className="social-icon naver-icon">N</span>
              네이버
            </button>
            
            <button 
              className="social-btn kakao-btn"
              onClick={() => handleSocialLogin('kakao')}
            >
              <span className="social-icon kakao-icon">K</span>
              카카오
            </button>
            
            <button 
              className="social-btn google-btn"
              onClick={() => handleSocialLogin('google')}
            >
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
          <Link to="/signup">회원가입</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
