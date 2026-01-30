import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import { Upload, Link as LinkIcon, Calendar, X } from 'lucide-react';
import './InsertBanner.css';

const InsertBanner = () => {
    const navigate = useNavigate();
    const [preview, setPreview] = useState(null);
    const [bannerForm, setBannerForm] = useState({
        bannerImg: null,
        bannerURL: '',
        bannerDate: new Date().toISOString().split('T')[0],
        bannerDeadlineDate: ''
    });

    // 이미지 업로드 및 미리보기 핸들러
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
        
        // FormData 객체 생성 (이미지 포함 시 필수)
        const formData = new FormData();
        formData.append('bannerImg', bannerForm.bannerImg);
        formData.append('bannerURL', bannerForm.bannerURL);
        formData.append('bannerDate', bannerForm.bannerDate);
        formData.append('bannerDeadlineDate', bannerForm.bannerDeadlineDate);

        try {
            await api.post('/api/admin/banners', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('배너가 성공적으로 등록되었습니다.');
            navigate('/admin/banners'); // 배너 목록 페이지로 이동
        } catch (err) {
            alert('배너 등록 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="admin-layout">
            <header className="admin-header">
                <div className="header-title">
                    <h1>배너 추가</h1>
                    <p>메인 화면에 노출될 새로운 홍보 배너를 등록합니다.</p>
                </div>
            </header>

            <main className="banner-add-container">
                <form onSubmit={handleSubmit} className="banner-form-card">
                    {/* 이미지 업로드 섹션 */}
                    <div className="form-section">
                        <label className="section-label">배너 이미지</label>
                        <div className={`upload-area ${preview ? 'has-preview' : ''}`}>
                            {preview ? (
                                <div className="image-preview-wrapper">
                                    <img src={preview} alt="Banner Preview" className="image-preview" />
                                    <button type="button" className="remove-img" onClick={() => setPreview(null)}>
                                        <X size={20} />
                                    </button>
                                </div>
                            ) : (
                                <label className="upload-placeholder">
                                    <input type="file" accept="image/*" onChange={handleImageChange} hidden />
                                    <Upload size={40} />
                                    <span>이미지 파일을 클릭하거나 끌어다 놓으세요</span>
                                    <p>추천 사이즈: 1920x450 (JPG, PNG)</p>
                                </label>
                            )}
                        </div>
                    </div>

                    {/* 배너 상세 정보 섹션 */}
                    <div className="form-grid">
                        <div className="form-group">
                            <label><LinkIcon size={16} /> 연결 URL</label>
                            <input 
                                type="url" 
                                placeholder="https://example.com"
                                value={bannerForm.bannerURL}
                                onChange={(e) => setBannerForm({...bannerForm, bannerURL: e.target.value})}
                                required
                            />
                        </div>
                        <div className="date-group">
                            <div className="form-group">
                                <label><Calendar size={16} /> 시작 날짜</label>
                                <input 
                                    type="date" 
                                    value={bannerForm.bannerDate}
                                    onChange={(e) => setBannerForm({...bannerForm, bannerDate: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label><Calendar size={16} /> 마감 날짜</label>
                                <input 
                                    type="date" 
                                    value={bannerForm.bannerDeadlineDate}
                                    onChange={(e) => setBannerForm({...bannerForm, bannerDeadlineDate: e.target.value})}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn-cancel" onClick={() => navigate(-1)}>취소</button>
                        <button type="submit" className="btn-submit">배너 등록하기</button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default InsertBanner;