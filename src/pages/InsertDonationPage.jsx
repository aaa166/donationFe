import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom'; 
import axios from 'axios'; 
import './InsertDonationPage.css';

const InsertDonationPage = () => {
    const navigate = useNavigate();
    const { userNo, isLoggedIn } = useOutletContext();

    useEffect(() => {
        if (!isLoggedIn) {
            alert("기부 캠페인을 등록하려면 로그인이 필요합니다.");
            navigate("/"); 
            return;
        }
        
        if (userNo === null || userNo === undefined) {
            console.log("UserNo 로딩 대기 중...");
            return; 
        }

        const checkPermission = async () => {
            try {
                const res = await axios.get(`/donationApply/${userNo}`); 
                
                if (res.status === 200 && res.data === "ok") {
                    console.log(`User ${userNo}: 기부 캠페인 등록 권한 확인 완료.`);
                } 

            } catch (error) {
                if (error.response && error.response.status === 403) {
                    alert("기부 캠페인 등록 권한이 없습니다.");
                    navigate("/donation"); 
                } else {
                    console.error("권한 확인 중 오류 발생:", error);
                    alert("API 호출 오류가 발생했습니다.");
                    navigate("/donation"); 
                }
            }
        };
        
        checkPermission();
        
    }, [userNo, isLoggedIn, navigate]); 


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
            if (file) {
                setImagePreview(URL.createObjectURL(file));
            } else {
                setImagePreview(null);
            }
        } else {
            let processedValue = value;
            if (name === 'targetCount') {
                // Allow empty string to clear the input, otherwise check for negative value
                if (processedValue !== '' && Number(processedValue) < 0) {
                    processedValue = '0';
                }
            }
            setFormState({ ...formState, [name]: processedValue });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("제출 데이터 (userNo 포함):", { ...formState, userNo }); 
        alert('기부 캠페인이 등록되었습니다. (콘솔 확인)');
    };

    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    if (!isLoggedIn || userNo === null) {
        return <div>권한 및 사용자 정보 확인 중...</div>;
    }
    
    return (
        <div className="insert-donation-container">
            <h1>기부 캠페인 등록</h1>
            <form onSubmit={handleSubmit} className="insert-donation-form">
                <div className="form-group">
                    <label htmlFor="title">제목</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formState.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="content">내용</label>
                    <textarea
                        id="content"
                        name="content"
                        value={formState.content}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="organization">기관명</label>
                    <input
                        type="text"
                        id="organization"
                        name="organization"
                        value={formState.organization}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="target">기부대상</label>
                        <input
                            type="text"
                            id="target"
                            name="target"
                            value={formState.target}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="targetCount">대상 수</label>
                        <input
                            type="number"
                            id="targetCount"
                            name="targetCount"
                            min="0"
                            value={formState.targetCount}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="usagePlan">사용계획</label>
                    <textarea
                        id="usagePlan"
                        name="usagePlan"
                        value={formState.usagePlan}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="image">대표 이미지</label>
                    <input
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        onChange={handleChange}
                    />
                    {imagePreview && (
                        <img src={imagePreview} alt="Preview" className="image-preview" />
                    )}
                </div>
                <button type="submit" className="submit-btn">캠페인 등록</button>
            </form>
        </div>
    );
};

export default InsertDonationPage;