import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App'; 
import Donation from './pages/Donation';
import DonationView from './pages/DonationView';
import DonationList from './pages/DonationList';
import Login from './pages/Login';
import ChocobeanLogin from './pages/ChocobeanLogin';
import ChocobeanSignup from './pages/ChocobeanSignup';
import Signup from './pages/Signup';
import My from './pages/My';
import InsertDonation from './pages/InsertDonation';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [ 
      {
        index: true, 
        element: <Donation />,
      },
      {
        path: '/donations/:donationNo', 
        element: <DonationView />,
      },
      {
        path: '/donations',
        element: <DonationList />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/signup',
        element: <Signup />,
      },
      {
        path: '/login/chocobean',
        element: <ChocobeanLogin />,
      },
      {
        path: '/signup/chocobean',
        element: <ChocobeanSignup />,
      },
      {
        path: '/my',
        element: <My />,
      },
      {
        path: '/donationApply', 
        element: <InsertDonation />,
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