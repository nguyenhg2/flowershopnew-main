import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productApi, categoryApi, orderApi, contactApi, userApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
    const [stats, setStats] = useState({ products: 0, categories: 0, orders: 0, contacts: 0, users: 0 });
    const [loading, setLoading] = useState(true);
    const { isAdmin } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const load = async () => {
            try {
                const [prodRes, catRes, orderRes, contactRes] = await Promise.all([
                    productApi.getAll({ page: 1, pageSize: 1 }),
                    categoryApi.getAll(),
                    orderApi.getAll({ page: 1, pageSize: 1 }),
                    contactApi.getAll({ page: 1, pageSize: 1 }),
                ]);
                const s = {
                    products: prodRes.data?.totalCount || 0,
                    categories: Array.isArray(catRes.data) ? catRes.data.length : 0,
                    orders: orderRes.data?.totalCount || 0,
                    contacts: contactRes.data?.totalCount || 0,
                    users: 0
                };
                if (isAdmin) {
                    try {
                        const userRes = await userApi.getAll({ page: 1, pageSize: 1 });
                        s.users = userRes.data?.totalCount || 0;
                    } catch { }
                }
                setStats(s);
            } catch { }
            setLoading(false);
        };
        load();
    }, [isAdmin]);

    if (loading) {
        return (
            <div className="text-center p-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Dang tai...</span>
                </div>
            </div>
        );
    }

    const boxes = [
        { label: 'San pham', value: stats.products, icon: 'fas fa-box', bg: 'bg-info', path: '/products' },
        { label: 'Danh muc', value: stats.categories, icon: 'fas fa-tags', bg: 'bg-success', path: '/categories' },
        { label: 'Don hang', value: stats.orders, icon: 'fas fa-shopping-cart', bg: 'bg-warning', path: '/orders' },
        { label: 'Lien he', value: stats.contacts, icon: 'fas fa-envelope', bg: 'bg-danger', path: '/contacts' },
    ];

    if (isAdmin) {
        boxes.push({ label: 'Nguoi dung', value: stats.users, icon: 'fas fa-users', bg: 'bg-secondary', path: '/users' });
    }

    return (
        <div>
            <div className="content-header">
                <h1>Bang dieu khien</h1>
            </div>
            <div className="row">
                {boxes.map(b => (
                    <div className="col-lg-3 col-6" key={b.label}>
                        <div className={`small-box ${b.bg}`}>
                            <div className="inner">
                                <h3>{b.value}</h3>
                                <p>{b.label}</p>
                            </div>
                            <div className="icon"><i className={b.icon}></i></div>
                            <a href="#" className="small-box-footer" onClick={(e) => { e.preventDefault(); navigate(b.path); }}>
                                Xem chi tiet <i className="fas fa-arrow-circle-right"></i>
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
