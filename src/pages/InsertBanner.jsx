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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBannerForm({ ...bannerForm, bannerImg: file });
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('bannerTitle', bannerForm.bannerTitle);
        formData.append('bannerImg', bannerForm.bannerImg);
        formData.append('bannerURL', bannerForm.bannerURL);
        formData.append('bannerStartDate', bannerForm.bannerStartDate);
        formData.append('bannerDeadlineDate', bannerForm.bannerDeadlineDate);

        try {
            await api.post('/api/admin/banners', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('배너가 등록되었습니다.');
            navigate('/admin/banners');
        } catch (err) {
            alert('등록 실패: ' + (err.response?.data?.message || err.message));
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
                        <label className="field-label"><Type size={18} /> 배너 제목</label>
                        <input 
                            type="text" 
                            placeholder="배너 구분을 위한 제목을 입력하세요"
                            value={bannerForm.bannerTitle}
                            onChange={(e) => setBannerForm({...bannerForm, bannerTitle: e.target.value})}
                            required
                        />
                    </div>

                    {/* 배너 이미지 업로드 */}
                    <div className="form-group full-width">
                        <label className="field-label">배너 이미지</label>
                        <div className={`image-upload-zone ${preview ? 'has-preview' : ''}`}>
                            {preview ? (
                                <div className="preview-container">
                                    <img src={preview} alt="Banner Preview" />
                                    <button type="button" className="remove-btn" onClick={() => setPreview(null)}>
                                        <X size={20} />
                                    </button>
                                </div>
                            ) : (
                                <label className="upload-label">
                                    <input type="file" accept="image/*" onChange={handleImageChange} hidden />
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
                            <label className="field-label"><LinkIcon size={18} /> 연결 URL</label>
                            <input 
                                type="url" 
                                placeholder="https://..."
                                value={bannerForm.bannerURL}
                                onChange={(e) => setBannerForm({...bannerForm, bannerURL: e.target.value})}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        {/* 시작 날짜 */}
                        <div className="form-group flex-1">
                            <label className="field-label"><Calendar size={18} /> 게시 시작일</label>
                            <input 
                                type="date" 
                                value={bannerForm.bannerStartDate}
                                onChange={(e) => setBannerForm({...bannerForm, bannerStartDate: e.target.value})}
                                required
                            />
                        </div>
                        {/* 마감 날짜 */}
                        <div className="form-group flex-1">
                            <label className="field-label"><Calendar size={18} /> 게시 종료일</label>
                            <input 
                                type="date" 
                                value={bannerForm.bannerDeadlineDate}
                                onChange={(e) => setBannerForm({...bannerForm, bannerDeadlineDate: e.target.value})}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-footer-actions">
                        <button type="button" className="btn-cancel" onClick={() => navigate(-1)}>취소</button>
                        <button type="submit" className="btn-save">등록하기</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InsertBanner;