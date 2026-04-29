import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function MainLayout({ children }) {
    const { user, logout, isAdmin } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => { logout(); navigate('/login'); };

    const menuItems = [
        { path: '/', label: 'Bang dieu khien', icon: 'fas fa-tachometer-alt' },
        { path: '/products', label: 'San pham', icon: 'fas fa-box' },
        { path: '/categories', label: 'Danh muc', icon: 'fas fa-tags' },
        { path: '/orders', label: 'Don hang', icon: 'fas fa-shopping-cart' },
        { path: '/banners', label: 'Banner', icon: 'fas fa-image' },
        { path: '/reviews', label: 'Danh gia', icon: 'fas fa-star' },
        { path: '/contacts', label: 'Lien he', icon: 'fas fa-envelope' },
    ];

    if (isAdmin) {
        menuItems.push({ path: '/users', label: 'Nguoi dung', icon: 'fas fa-users' });
    }

    return (
        <div className="wrapper">
            <nav className="main-header navbar navbar-expand navbar-white navbar-light">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <a className="nav-link" data-widget="pushmenu" href="#" role="button"><i className="fas fa-bars"></i></a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/" target="_blank" rel="noopener noreferrer">Trang chu</a>
                    </li>
                </ul>
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle" data-toggle="dropdown" href="#">
                            <i className="fas fa-user mr-1"></i> {user?.fullName || 'Quan tri vien'}
                        </a>
                        <div className="dropdown-menu dropdown-menu-right">
                            <span className="dropdown-item disabled">{user?.email}</span>
                            <div className="dropdown-divider"></div>
                            <a className="dropdown-item" href="#" onClick={handleLogout}>
                                <i className="fas fa-sign-out-alt mr-2"></i> Dang xuat
                            </a>
                        </div>
                    </li>
                </ul>
            </nav>
            <aside className="main-sidebar sidebar-dark-primary elevation-4">
                <a href="/" className="brand-link">
                    <span className="brand-text font-weight-light" style={{ marginLeft: 12 }}>Mong Lan Admin</span>
                </a>
                <div className="sidebar">
                    <nav className="mt-2">
                        <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu">
                            {menuItems.map(item => (
                                <li className="nav-item" key={item.path}>
                                    <a href="#"
                                        className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                                        onClick={e => { e.preventDefault(); navigate(item.path); }}>
                                        <i className={`nav-icon ${item.icon}`}></i>
                                        <p>{item.label}</p>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </aside>
            <div className="content-wrapper">
                <div className="content">
                    <div className="container-fluid pt-3">{children}</div>
                </div>
            </div>
            <footer className="main-footer">
                <strong>Mong Lan Flower</strong> - He thong quan tri
                <div className="float-right d-none d-sm-inline-block">Phien ban 1.0.0</div>
            </footer>
        </div>
    );
}
