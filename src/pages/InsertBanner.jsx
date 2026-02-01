import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import { Upload, Link as LinkIcon, Calendar, X, Type } from 'lucide-react';
import './InsertBanner.css';

const InsertBanner = () => {
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
  const [bannerForm, setBannerForm] = useState({
    bannerTitle: '',
    bannerImg: null,
    bannerURL: '',
    bannerStartDate: '',
    bannerDeadlineDate: ''
  });

  // 🔹 이미지 파일 처리 (input + drag&drop 공용)
  const handleImageFile = (file) => {
    if (!file) return;

    // 이미지 파일만 허용
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    setBannerForm({ ...bannerForm, bannerImg: file });

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  // 🔹 input 선택 시
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    handleImageFile(file);
  };

  // 🔹 폼 제출
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // JSON 데이터를 Blob으로 변환 후 FormData에 추가
    const bannerData = {
      bannerTitle: bannerForm.bannerTitle,
      bannerURL: bannerForm.bannerURL,
      bannerStartDate: bannerForm.bannerStartDate,
      bannerDeadlineDate: bannerForm.bannerDeadlineDate
    };
    formData.append(
      'banner',
      new Blob([JSON.stringify(bannerData)], { type: 'application/json' })
    );

    // 이미지가 있을 경우 추가
    if (bannerForm.bannerImg) {
      formData.append('bannerImg', bannerForm.bannerImg);
    }

    try {
      await api.post('/api/admin/insertBanner', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      alert('배너가 등록되었습니다.');
      navigate('/bannerState');
    } catch (err) {
      alert('등록 실패: ' + (err.response?.data || err.message));
    }
  };

  return (
    <div className="insert-banner-page">
      <div className="insert-banner-container">
        <header className="page-header">
          <div className="breadcrumb">홈 &gt; 배너 관리 &gt; 배너 추가</div>
          <h1>배너 추가</h1>
          <p>메인 페이지에 노출될 새로운 홍보 배너 정보를 입력해주세요.</p>
        </header>

        <form onSubmit={handleSubmit} className="banner-insert-form">
          {/* 배너 제목 */}
          <div className="form-group full-width">
            <label className="field-label">
              <Type size={18} /> 배너 제목
            </label>
            <input
              type="text"
              placeholder="배너 구분을 위한 제목을 입력하세요"
              value={bannerForm.bannerTitle}
              onChange={(e) =>
                setBannerForm({ ...bannerForm, bannerTitle: e.target.value })
              }
              required
            />
          </div>

          {/* 배너 이미지 업로드 */}
          <div className="form-group full-width">
            <label className="field-label">배너 이미지</label>
            <div
              className={`image-upload-zone ${preview ? 'has-preview' : ''}`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                handleImageFile(file);
              }}
            >
              {preview ? (
                <div className="preview-container">
                  <img src={preview} alt="Banner Preview" />
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => {
                      setPreview(null);
                      setBannerForm({ ...bannerForm, bannerImg: null });
                    }}
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <label className="upload-label">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    hidden
                  />
                  <Upload size={48} />
                  <span>이미지 파일을 업로드하거나 드래그하세요</span>
                  <p>권장 사이즈: 1920 x 400 (JPG, PNG)</p>
                </label>
              )}
            </div>
          </div>

          <div className="form-row">
            {/* 연결 URL */}
            <div className="form-group flex-1">
              <label className="field-label">
                <LinkIcon size={18} /> 연결 URL
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={bannerForm.bannerURL}
                onChange={(e) =>
                  setBannerForm({ ...bannerForm, bannerURL: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="form-row">
            {/* 시작 날짜 */}
            <div className="form-group flex-1">
              <label className="field-label">
                <Calendar size={18} /> 게시 시작일
              </label>
              <input
                type="date"
                value={bannerForm.bannerStartDate}
                onChange={(e) =>
                  setBannerForm({
                    ...bannerForm,
                    bannerStartDate: e.target.value
                  })
                }
                required
              />
            </div>

            {/* 종료 날짜 */}
            <div className="form-group flex-1">
              <label className="field-label">
                <Calendar size={18} /> 게시 종료일
              </label>
              <input
                type="date"
                value={bannerForm.bannerDeadlineDate}
                onChange={(e) =>
                  setBannerForm({
                    ...bannerForm,
                    bannerDeadlineDate: e.target.value
                  })
                }
                required
              />
            </div>
          </div>

          <div className="form-footer-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate(-1)}
            >
              취소
            </button>
            <button type="submit" className="btn-save">
              등록하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InsertBanner;
