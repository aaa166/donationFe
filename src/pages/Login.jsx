import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();

  // 소셜 로그인 처리
  const handleSocialLogin = (provider) => {
    if (provider === 'chocobean') {
      navigate('/login/chocobean'); 
    } else {
      
      window.location.href = `http://localhost:8081/oauth2/authorization/${provider}`;
      
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('accessToken');
    const refreshToken = params.get('refreshToken');

    if (accessToken) {
      console.log("로그인 성공! 토큰 저장 중...");
      
      // 1. 토큰 저장
      localStorage.setItem('accessToken', accessToken);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }

      // 2. 주소창의 토큰 제거 및 메인 페이지로 이동
      // replace: true를 사용해야 뒤로가기 시 다시 토큰 URL로 돌아오지 않습니다.
      navigate('/', { replace: true });
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
          <Link to="/signup/chocobean">회원가입</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;