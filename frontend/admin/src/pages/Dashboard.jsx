import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productApi, categoryApi, orderApi, contactApi, userApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const fmt = (n) => n != null ? Number(n).toLocaleString('vi-VN') + 'd' : '0d';

const Dashboard = () => {
    const [stats, setStats] = useState({ products: 0, categories: 0, orders: 0, contacts: 0, users: 0 });
    const [revenue, setRevenue] = useState(null);
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

                try {
                    const revRes = await orderApi.getRevenue();
                    setRevenue(revRes.data);
                } catch { }
            } catch { }
            setLoading(false);
        };
        load();
    }, [isAdmin]);

    if (loading) {
        return (
            <div className="text-center p-5">
                <div className="spinner-border text-primary" role="status"><span className="sr-only">Dang tai...</span></div>
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

    const maxRevenue = revenue?.monthlyData?.length > 0
        ? Math.max(...revenue.monthlyData.map(m => m.revenue))
        : 0;

    return (
        <div>
            <div className="content-header"><h1>Bang dieu khien</h1></div>

            <div className="row">
                {boxes.map(b => (
                    <div className="col-lg-3 col-6" key={b.label}>
                        <div className={`small-box ${b.bg}`}>
                            <div className="inner"><h3>{b.value}</h3><p>{b.label}</p></div>
                            <div className="icon"><i className={b.icon}></i></div>
                            <a href="#" className="small-box-footer" onClick={e => { e.preventDefault(); navigate(b.path); }}>
                                Xem chi tiet <i className="fas fa-arrow-circle-right"></i>
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            {revenue && (
                <>
                    <div className="row">
                        <div className="col-lg-3 col-6">
                            <div className="small-box bg-gradient-success">
                                <div className="inner"><h3>{fmt(revenue.today?.revenue)}</h3><p>Doanh thu hom nay ({revenue.today?.count} don)</p></div>
                                <div className="icon"><i className="fas fa-calendar-day"></i></div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-6">
                            <div className="small-box bg-gradient-info">
                                <div className="inner"><h3>{fmt(revenue.month?.revenue)}</h3><p>Doanh thu thang {revenue.month?.monthNum} ({revenue.month?.count} don)</p></div>
                                <div className="icon"><i className="fas fa-calendar-alt"></i></div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-6">
                            <div className="small-box bg-gradient-warning">
                                <div className="inner"><h3>{fmt(revenue.year?.revenue)}</h3><p>Doanh thu nam {revenue.year?.yearNum} ({revenue.year?.count} don)</p></div>
                                <div className="icon"><i className="fas fa-chart-line"></i></div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-6">
                            <div className="small-box bg-gradient-danger">
                                <div className="inner"><h3>{fmt(revenue.total?.revenue)}</h3><p>Tong doanh thu ({revenue.total?.count} don)</p></div>
                                <div className="icon"><i className="fas fa-coins"></i></div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-8">
                            <div className="card">
                                <div className="card-header"><h3 className="card-title">Doanh thu theo thang ({revenue.year?.yearNum})</h3></div>
                                <div className="card-body">
                                    <div style={{ display: 'flex', alignItems: 'flex-end', height: 200, gap: 4 }}>
                                        {Array.from({ length: 12 }, (_, i) => {
                                            const m = revenue.monthlyData?.find(x => x.month === i + 1);
                                            const val = m?.revenue || 0;
                                            const h = maxRevenue > 0 ? (val / maxRevenue) * 180 : 0;
                                            return (
                                                <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                                                    <div style={{ background: val > 0 ? '#17a2b8' : '#e9ecef', height: Math.max(h, 2), borderRadius: '4px 4px 0 0', transition: 'height .3s' }}
                                                        title={`T${i + 1}: ${Number(val).toLocaleString('vi-VN')}d - ${m?.count || 0} don`}></div>
                                                    <div style={{ fontSize: 11, marginTop: 4, color: '#888' }}>T{i + 1}</div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="card">
                                <div className="card-header"><h3 className="card-title">Trang thai don hang</h3></div>
                                <div className="card-body p-0">
                                    <table className="table table-sm">
                                        <tbody>
                                            {revenue.statusCounts?.map(s => (
                                                <tr key={s.status}>
                                                    <td>{s.status}</td>
                                                    <td className="text-right"><strong>{s.count}</strong></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    {revenue.topProducts?.length > 0 && (
                        <div className="card">
                            <div className="card-header"><h3 className="card-title">Top 10 san pham ban chay</h3></div>
                            <div className="card-body table-responsive p-0">
                                <table className="table table-hover">
                                    <thead><tr><th>#</th><th>San pham</th><th>So luong ban</th><th>Doanh thu</th></tr></thead>
                                    <tbody>
                                        {revenue.topProducts.map((p, i) => (
                                            <tr key={p.productId}>
                                                <td>{i + 1}</td>
                                                <td>{p.productName}</td>
                                                <td>{p.totalQty}</td>
                                                <td>{fmt(p.totalRevenue)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Dashboard;
