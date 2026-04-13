import './styles/global.css';
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { TokenProvider } from './contexts/TokenContext';
import AppLayout from './components/AppLayout';
import HomePage from './pages/HomePage';
import AuctionsPage from './pages/AuctionsPage';
import AdminDashboard from './pages/AdminDashboard';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <AuthProvider>
      <TokenProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/auctions" element={<AuctionsPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TokenProvider>
    </AuthProvider>
  );
}
