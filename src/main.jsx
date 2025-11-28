import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App'; 
import DonationPage from './pages/DonationPage';
import DonationViewPage from './pages/DonationViewPage';
import DonationListPage from './pages/DonationListPage';
import LoginPage from './pages/LoginPage';
import ChocobeanLoginPage from './pages/ChocobeanLoginPage';
import ChocobeanSignupPage from './pages/ChocobeanSignupPage';
import SignupPage from './pages/SignupPage';
import MyPage from './pages/MyPage';
import InsertDonationPage from './pages/InsertDonationPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [ 
      {
        index: true, 
        element: <DonationPage />,
      },
      {
        path: '/donations/:donationNo', 
        element: <DonationViewPage />,
      },
      {
        path: '/donations',
        element: <DonationListPage />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/signup',
        element: <SignupPage />,
      },
      {
        path: '/login/chocobean',
        element: <ChocobeanLoginPage />,
      },
      {
        path: '/signup/chocobean',
        element: <ChocobeanSignupPage />,
      },
      {
        path: '/mypage',
        element: <MyPage />,
      },
      {
        path: '/donationApply', 
        element: <InsertDonationPage />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);