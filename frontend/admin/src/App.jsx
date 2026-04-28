import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Orders from './pages/Orders';
import Banners from './pages/Banners';
import Reviews from './pages/Reviews';
import Contacts from './pages/Contacts';
import Users from './pages/Users';

function PublicRoute({ children }) {
    const token = localStorage.getItem('admin_token');
    if (token) return <Navigate to="/" replace />;
    return children;
}

function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/" element={<ProtectedRoute><MainLayout><Dashboard /></MainLayout></ProtectedRoute>} />
            <Route path="/products" element={<ProtectedRoute><MainLayout><Products /></MainLayout></ProtectedRoute>} />
            <Route path="/categories" element={<ProtectedRoute><MainLayout><Categories /></MainLayout></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><MainLayout><Orders /></MainLayout></ProtectedRoute>} />
            <Route path="/banners" element={<ProtectedRoute><MainLayout><Banners /></MainLayout></ProtectedRoute>} />
            <Route path="/reviews" element={<ProtectedRoute><MainLayout><Reviews /></MainLayout></ProtectedRoute>} />
            <Route path="/contacts" element={<ProtectedRoute><MainLayout><Contacts /></MainLayout></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute adminOnly><MainLayout><Users /></MainLayout></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}

export default function App() {
    return (
        <Router>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </Router>
    );
}
