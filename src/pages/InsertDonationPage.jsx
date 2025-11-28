import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom'; 
import axios from 'axios'; 
import './InsertDonationPage.css';

const InsertDonationPage = () => {
    const navigate = useNavigate();
    const { isLoggedIn } = useOutletContext(); 

    useEffect(() => {
        if (!isLoggedIn) {
            alert("기부 캠페인을 등록하려면 로그인이 필요합니다.");
            navigate("/"); 
            return;
        }

        const checkPermission = async () => {
            try {
                const res = await axios.get(`http://localhost:8081/api/public/donationApply`, {
                  headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` }
                });

                if (res.status === 200 && res.data === "ok") {
                    console.log("기부 캠페인 등록 권한 확인 완료.");
                }

            } catch (error) {
                if (error.response && error.response.status === 403) {
                    alert("기부 캠페인 등록 권한이 없습니다.");
                    navigate("/"); 
                } else {
                    console.error("권한 확인 중 오류 발생:", error);
                    alert("API 호출 오류가 발생했습니다.");
                    navigate("/"); 
                }
            }
        };

        checkPermission();

    }, [isLoggedIn, navigate]); 

    // form 상태
    const [formState, setFormState] = useState({
        title: '',
        content: '',
        organization: '',
        target: '',
        targetCount: '',
        usagePlan: '',
        image: null,
    });
    const [imagePreview, setImagePreview] = useState(null);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            const file = files[0];
            setFormState({ ...formState, [name]: file });
            setImagePreview(file ? URL.createObjectURL(file) : null);
        } else {
            let processedValue = value;
            if (name === 'targetCount' && processedValue !== '' && Number(processedValue) < 0) {
                processedValue = '0';
            }
            setFormState({ ...formState, [name]: processedValue });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("제출 데이터:", formState); 
        alert('기부 캠페인이 등록되었습니다. (콘솔 확인)');
        // 실제 등록 API 호출 시 formData에 JWT 포함해서 POST 요청
    };

    useEffect(() => {
        return () => {
            if (imagePreview) URL.revokeObjectURL(imagePreview);
        };
    }, [imagePreview]);

    if (!isLoggedIn) {
        return <div>권한 및 사용자 정보 확인 중...</div>;
    }

    return (
        <div className="insert-donation-container">
            <h1>기부 캠페인 등록</h1>
            <form onSubmit={handleSubmit} className="insert-donation-form">
                <div className="form-group">
                    <label htmlFor="title">제목</label>
                    <input type="text" id="title" name="title" value={formState.title} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="content">내용</label>
                    <textarea id="content" name="content" value={formState.content} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="organization">기관명</label>
                    <input type="text" id="organization" name="organization" value={formState.organization} onChange={handleChange} required />
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="target">기부대상</label>
                        <input type="text" id="target" name="target" value={formState.target} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="targetCount">대상 수</label>
                        <input type="number" id="targetCount" name="targetCount" min="0" value={formState.targetCount} onChange={handleChange} required />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="usagePlan">사용계획</label>
                    <textarea id="usagePlan" name="usagePlan" value={formState.usagePlan} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="image">대표 이미지</label>
                    <input type="file" id="image" name="image" accept="image/*" onChange={handleChange} />
                    {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}
                </div>
                <button type="submit" className="submit-btn">캠페인 등록</button>
            </form>
        </div>
    );
};

export default InsertDonationPage;
