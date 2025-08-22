import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DonationPage from './pages/DonationPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ChocobeanLoginPage from './pages/ChocobeanLoginPage';
import ChocobeanSignupPage from './pages/ChocobeanSignupPage';
import DonationListPage from './pages/DonationListPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<DonationPage />} />
          <Route path="/donations" element={<DonationListPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login/chocobean" element={<ChocobeanLoginPage />} />
          <Route path="/signup/chocobean" element={<ChocobeanSignupPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;