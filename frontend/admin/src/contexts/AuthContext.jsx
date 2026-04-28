import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('admin_token');
        const saved = localStorage.getItem('admin_user');
        if (token && saved) {
            try { setUser(JSON.parse(saved)); } catch { /* bo qua */ }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const res = await authApi.login(email, password);
            const { token, user: u } = res.data;
            localStorage.setItem('admin_token', token);
            localStorage.setItem('admin_user', JSON.stringify(u));
            setUser(u);
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Đăng nhập thất bại' };
        }
    };

    const logout = () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        setUser(null);
    };

    const isAdmin = user?.role === 'Admin';
    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider value={{ user, login, logout, isAdmin, isAuthenticated, loading }}>
            {children}
        </AuthContext.Provider>
    );
}
