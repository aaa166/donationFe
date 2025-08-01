import React from 'react';
import Header from '../components/Header';
import DonationList from '../components/DonationList';

const DonationPage = () => {
  const donations = [
    {
      title: '하루도 쉬지 않고 사고 현장을 지키는 소방관',
      organization: '세이브더칠드런',
      progress: 95,
      amount: 9715324,
      image: 'assets/donation/img/firefighter-1.jpg',
    },
    {
      title: '독거노인을 위한 겨울나기 용품 지원',
      organization: '굿네이버스',
      progress: 50,
      amount: 543210,
      image: 'https://via.placeholder.com/250x150',
    },
    {
      title: '장애아동을 위한 재활치료비 지원',
      organization: '초록우산 어린이재단',
      progress: 90,
      amount: 987654,
      image: 'https://via.placeholder.com/250x150',
    },
    {
      title: '희귀병 환아를 위한 치료비 지원',
      organization: '한국백혈병소아암협회',
      progress: 30,
      amount: 345678,
      image: 'https://via.placeholder.com/250x150',
    },
    {
      title: '미혼모 가정을 위한 자립 지원',
      organization: '한국여성재단',
      progress: 60,
      amount: 654321,
      image: 'https://via.placeholder.com/250x150',
    },
  ];

  return (
    <div>
      <Header />
      <DonationList donations={donations} />
    </div>
  );
};

export default DonationPage;