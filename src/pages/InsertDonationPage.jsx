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
        donationTitle: '',
        donationContent: '',
        donationOrganization: '',
        donationGoalAmount: '',
        donationDeadlineDate: '',
        donationTarget: '',
        donationTargetCount: '',
        donationPlan: '',
        image: null,
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [categories, setCategories] = useState([]);

    const categoryOptions = ["아동/청소년", "노인", "장애인", "가정", "동물", "환경", "기타"];

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            const file = files[0];
            setFormState({ ...formState, [name]: file });
            setImagePreview(file ? URL.createObjectURL(file) : null);
        } else {
            let processedValue = value;
            // DTO 필드명으로 변경해야 함
            if ((name === 'donationTargetCount' || name === 'donationGoalAmount') && processedValue !== '' && Number(processedValue) < 0) {
                processedValue = '0';
            }
            setFormState({ ...formState, [name]: processedValue });
        }
    };

    const handleCategoryChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            setCategories([...categories, value]);
        } else {
            setCategories(categories.filter(category => category !== value));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('donationTitle', formState.donationTitle);
        formData.append('donationContent', formState.donationContent);
        formData.append('donationOrganization', formState.donationOrganization);
        formData.append('donationGoalAmount', formState.donationGoalAmount);
        formData.append('donationDeadlineDate', formState.donationDeadlineDate);
        formData.append('donationTarget', formState.donationTarget);
        formData.append('donationTargetCount', formState.donationTargetCount);
        formData.append('donationPlan', formState.donationPlan);
        formData.append('categories', JSON.stringify(categories));
        if (formState.image) {
            formData.append('image', formState.image);
        }
        try {
            const token = localStorage.getItem("jwtToken");
            if (!token) {
                alert("로그인이 필요합니다.");
                navigate("/login");
                return;
            }

            const response = await axios.post('http://localhost:8081/api/public/insertDonation', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                alert('기부 캠페인이 성공적으로 등록되었습니다.');
                navigate('/'); 
            }
        } catch (error) {
            console.error("캠페인 등록 오류:", error);
            alert('캠페인 등록에 실패했습니다. 다시 시도해주세요.');
        }
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
                    <input type="text" id="donationTitle" name="donationTitle" value={formState.donationTitle} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="content">내용</label>
                    <textarea id="donationContent" name="donationContent" value={formState.donationContent} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="organization">기관명</label>
                    <input type="text" id="donationOrganization" name="donationOrganization" value={formState.donationOrganization} onChange={handleChange} required />
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="goalAmount">목표금액</label>
                        <input type="number" id="donationGoalAmount" name="donationGoalAmount" min="0" value={formState.donationGoalAmount} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="deadlineDate">캠페인 종료날짜</label>
                        <input type="date" id="donationDeadlineDate" name="donationDeadlineDate" value={formState.donationDeadlineDate} onChange={handleChange} required />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="target">기부대상</label>
                        <input type="text" id="donationTarget" name="donationTarget" value={formState.donationTarget} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="targetCount">대상 수</label>
                        <input type="number" id="donationTargetCount" name="donationTargetCount" min="0" value={formState.donationTargetCount} onChange={handleChange} required />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="usagePlan">사용계획</label>
                    <textarea id="donationPlan" name="donationPlan" value={formState.donationPlan} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>카테고리</label>
                    <div className="category-checkbox-group">
                        {categoryOptions.map(option => (
                            <label key={option} className="category-checkbox-label">
                                <input
                                    type="checkbox"
                                    value={option}
                                    checked={categories.includes(option)}
                                    onChange={handleCategoryChange}
                                />
                                {option}
                            </label>
                        ))}
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="image">대표 이미지</label>
                    <input type="file" id="image" name="image" accept="image/*" onChange={handleChange} />
                    {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}
                </div>
                <button type="submit" className="submit-btn">캠페인 등록 요청</button>
            </form>
        </div>
    );
};

export default InsertDonationPage;
