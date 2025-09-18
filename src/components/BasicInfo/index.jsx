// src/components/BasicInfo.js
const BasicInfo = ({ organization }) => (
    <div>
        <h3>모금단체 정보</h3>
        <p><strong>단체명:</strong> {organization}</p>
        <p><strong>모금기간:</strong> 2024.01.01 ~ 2024.12.31</p>
        <h3>모금액 사용 계획</h3>
        <p>모금된 금액은 전액 지진 피해 아동을 위한 식수, 위생, 의료 용품 지원에 사용됩니다.</p>
    </div>
);
export default BasicInfo;