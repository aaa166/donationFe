import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ChocobeanSignup.css';

const ChocobeanSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    userId: '',
    password: '',
    confirmPassword: '',
    email: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [agreements, setAgreements] = useState({
    all: false,
    required1: false,
    required2: false,
    required3: false,
    marketing: false
  });
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    content: ''
  });
  const navigate = useNavigate();

  const validateUserId = (userId) => {
    const regex = /^[a-z0-9]{6,12}$/;
    return regex.test(userId);
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/;
    return regex.test(password);
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePhone = (phone) => {
    const regex = /^010-?\d{4}-?\d{4}$/;
    return regex.test(phone);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    let newErrors = { ...errors };
    
    switch (name) {
      case 'name':
        if (value && value.trim().length < 2) {
          newErrors.name = '이름은 2자 이상 입력해주세요.';
        } else {
          delete newErrors.name;
        }
        break;
      case 'userId':
        if (value /*&&  !validateUserId(value) */) {
          // newErrors.userId = '6-12자의 영문 소문자, 숫자만 사용 가능합니다.';
        } else {
          delete newErrors.userId;
        }
        break;
      case 'password':
        if (value /* && !validatePassword(value) */) {
          // newErrors.password = '8-15자의 영문, 숫자, 특수문자를 포함해야 합니다.';
        } else {
          delete newErrors.password;
        }
        if (formData.confirmPassword && value !== formData.confirmPassword) {
          newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
        } else if (formData.confirmPassword) {
          delete newErrors.confirmPassword;
        }
        break;
      case 'confirmPassword':
        if (value && value !== formData.password) {
          newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
        } else {
          delete newErrors.confirmPassword;
        }
        break;
      case 'email':
        if (value /* && !validateEmail(value) */) {
          // newErrors.email = '올바른 이메일 형식을 입력해주세요.';
        } else {
          delete newErrors.email;
        }
        break;
      case 'phone':
        if (value /* && !validatePhone(value) */) {
          // newErrors.phone = '올바른 휴대폰 번호를 입력해주세요. (예: 010-1234-5678)';
        } else {
          delete newErrors.phone;
        }
        break;
      default:
        break;
    }
    
    setErrors(newErrors);
  };

  const handleAgreementChange = (type) => {
    if (type === 'all') {
      const newValue = !agreements.all;
      setAgreements({
        all: newValue,
        required1: newValue,
        required2: newValue,
        required3: newValue,
        marketing: newValue
      });
    } else {
      const newAgreements = {
        ...agreements,
        [type]: !agreements[type]
      };
      newAgreements.all = newAgreements.required1 && newAgreements.required2 && 
                          newAgreements.required3 && newAgreements.marketing;
      setAgreements(newAgreements);
    }
  };

  const isFormValid = () => {
    return (
      formData.name &&
      formData.userId &&
      formData.password &&
      formData.confirmPassword &&
      formData.email &&
      formData.phone &&
      Object.keys(errors).length === 0 &&
      agreements.required1 &&
      agreements.required2 &&
      agreements.required3
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // if (!isFormValid()) {
    //   alert('모든 필수 항목을 올바르게 입력해주세요.');
    //   return;
    // }

    try {
      const response = await fetch('http://localhost:8081/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: formData.name,
          userId: formData.userId,
          userPassword: formData.password,
          userEmail: formData.email,
          userPhone: formData.phone,
          marketingConsent: agreements.marketing
        }),
      });

      if (response.ok) {
        alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
        navigate('/login/chocobean');
      } else {
        const errorMessage = await response.text();
        alert(errorMessage || '회원가입에 실패했습니다.');
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleBackToLogin = () => {
    navigate('/login/chocobean');
  };

  const openModal = (title, content) => {
    setModalState({
      isOpen: true,
      title,
      content
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      title: '',
      content: ''
    });
  };

  const termsContent = {
    service: `제1조 (목적)
이 약관은 초코빈(이하 "회사"라 함)이 제공하는 서비스의 이용조건 및 절차에 관한 사항과 기타 필요한 사항을 규정함을 목적으로 합니다.

제2조 (정의)
1. "서비스"란 회사가 제공하는 모든 서비스를 의미합니다.
2. "회원"이란 회사의 약관에 동의하고 개인정보를 제공하여 회원등록을 한 자로서, 회사의 서비스를 지속적으로 이용할 수 있는 자를 말합니다.
3. "아이디(ID)"란 회원의 식별 및 서비스 이용을 위하여 회원이 정하고 회사가 승인하는 문자 및 숫자의 조합을 의미합니다.

제3조 (약관의 효력 및 변경)
1. 이 약관은 서비스 화면에 게시하거나 기타의 방법으로 회원에게 공지함으로써 효력을 발생합니다.
2. 회사는 합리적인 사유가 발생할 경우에는 이 약관을 변경할 수 있으며, 약관을 변경하고자 하는 경우에는 적용일자 및 개정사유를 명시하여 현행약관과 함께 서비스의 초기화면에 그 적용일자 7일 이전부터 적용일자 전일까지 공지합니다.`,

    privacy: `제1조 (개인정보의 처리 목적)
초코빈(이하 "회사"라 함)은 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며 이용 목적이 변경되는 경우에는 개인정보 보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.

1. 회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증, 회원자격 유지·관리, 서비스 부정이용 방지, 만14세 미만 아동 개인정보 수집 시 법정대리인 동의여부 확인, 각종 고지·통지, 고충처리 목적으로 개인정보를 처리합니다.

2. 재화 또는 서비스 제공
서비스 제공, 계약서·청구서 발송, 콘텐츠 제공, 맞춤서비스 제공, 본인인증, 연령인증, 요금결제·정산을 목적으로 개인정보를 처리합니다.

제2조 (개인정보의 처리 및 보유 기간)
① 회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.

② 각각의 개인정보 처리 및 보유 기간은 다음과 같습니다.
- 회원 가입 및 관리 : 회원 탈퇴시까지
- 재화 또는 서비스 제공 : 재화·서비스 공급완료 및 요금결제·정산 완료시까지`,

    age: `만 14세 이상 가입 확인

초코빈 서비스는 만 14세 이상만 가입할 수 있습니다.

관련 법령:
- 개인정보보호법 제22조
- 정보통신망 이용촉진 및 정보보호 등에 관한 법률 제31조

만 14세 미만 아동의 경우 법정대리인의 동의가 필요하며, 본 서비스는 만 14세 이상만을 대상으로 제공됩니다.

가입 시 제공한 정보가 허위인 경우 서비스 이용이 제한될 수 있습니다.`
  };

  return (
    <div className="chocobean-signup-container">
      <div className="chocobean-signup-box">
        <button className="back-button" onClick={handleBackToLogin}>
          ← 뒤로
        </button>
        
        <div className="chocobean-header">
          <div className="chocobean-logo">
            <span className="chocobean-icon">🍫</span>
            <h1>초코빈 회원가입</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="chocobean-form">
          <div className="input-group">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="이름"
              required
              className={`chocobean-input ${errors.name ? 'error' : ''}`}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="input-group">
            <input
              type="text"
              name="userId"
              value={formData.userId}
              onChange={handleInputChange}
              placeholder="아이디 (6-12자의 영문 소문자, 숫자)"
              required
              className={`chocobean-input ${errors.userId ? 'error' : ''}`}
            />
            {errors.userId && <span className="error-message">{errors.userId}</span>}
          </div>
          
          <div className="input-group">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="비밀번호 (8-15자의 영문, 숫자, 특수문자 포함)"
              required
              className={`chocobean-input ${errors.password ? 'error' : ''}`}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="input-group">
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="비밀번호 확인"
              required
              className={`chocobean-input ${errors.confirmPassword ? 'error' : ''}`}
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>

          <div className="input-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="이메일"
              required
              className={`chocobean-input ${errors.email ? 'error' : ''}`}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="input-group">
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="휴대폰 번호 (010-1234-5678)"
              required
              className={`chocobean-input ${errors.phone ? 'error' : ''}`}
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>

          <div className="agreement-section">
            <div className="agreement-item all-agreement">
              <label className="agreement-checkbox">
                <input
                  type="checkbox"
                  checked={agreements.all}
                  onChange={() => handleAgreementChange('all')}
                />
                <span className="checkmark"></span>
                전체 동의
              </label>
            </div>

            <div className="agreement-list">
              <div className="agreement-item">
                <label className="agreement-checkbox">
                  <input
                    type="checkbox"
                    checked={agreements.required1}
                    onChange={() => handleAgreementChange('required1')}
                  />
                  <span className="checkmark"></span>
                  [필수] 만 14세 이상입니다
                </label>
                <button 
                  type="button" 
                  className="terms-detail-btn"
                  onClick={() => openModal('만 14세 이상 확인', termsContent.age)}
                >
                  자세히보기
                </button>
              </div>

              <div className="agreement-item">
                <label className="agreement-checkbox">
                  <input
                    type="checkbox"
                    checked={agreements.required2}
                    onChange={() => handleAgreementChange('required2')}
                  />
                  <span className="checkmark"></span>
                  [필수] 서비스 이용약관 동의
                </label>
                <button 
                  type="button" 
                  className="terms-detail-btn"
                  onClick={() => openModal('서비스 이용약관', termsContent.service)}
                >
                  자세히보기
                </button>
              </div>

              <div className="agreement-item">
                <label className="agreement-checkbox">
                  <input
                    type="checkbox"
                    checked={agreements.required3}
                    onChange={() => handleAgreementChange('required3')}
                  />
                  <span className="checkmark"></span>
                  [필수] 개인정보 처리방침 동의
                </label>
                <button 
                  type="button" 
                  className="terms-detail-btn"
                  onClick={() => openModal('개인정보 처리방침', termsContent.privacy)}
                >
                  자세히보기
                </button>
              </div>

              <div className="agreement-item">
                <label className="agreement-checkbox">
                  <input
                    type="checkbox"
                    checked={agreements.marketing}
                    onChange={() => handleAgreementChange('marketing')}
                  />
                  <span className="checkmark"></span>
                  [선택] 마케팅 정보 수신 동의
                </label>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className={`chocobean-signup-button active /* ${isFormValid() ? 'active' : 'disabled'} */`}
            /* disabled={!isFormValid()} */
          >
            회원가입
          </button>
        </form>

        <div className="help-links">
          <span>이미 계정이 있으신가요?</span>
          <Link to="/login/chocobean" className="help-link">로그인하기</Link>
        </div>
      </div>

      {modalState.isOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modalState.title}</h2>
              <button className="modal-close-btn" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              <pre>{modalState.content}</pre>
            </div>
            <div className="modal-footer">
              <button className="modal-confirm-btn" onClick={closeModal}>확인</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChocobeanSignup;