import React, { useState, useEffect } from 'react';
import { userApi } from '../services/api';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(1);
    const [keyword, setKeyword] = useState('');
    const pageSize = 10;

    useEffect(() => { load(); }, [page]);

    const load = (p = page) => {
        setLoading(true);
        const params = { page: p, pageSize };
        if (keyword) params.keyword = keyword;
        userApi.getAll(params)
            .then(res => {
                setUsers(res.data.items || []);
                setTotalCount(res.data.totalCount || 0);
            })
            .catch(() => setUsers([]))
            .finally(() => setLoading(false));
    };

    const handleSearch = () => { setPage(1); load(1); };

    const toggleUser = async (id) => {
        try { await userApi.toggle(id); load(); } catch { /* bo qua */ }
    };

    const totalPages = Math.ceil(totalCount / pageSize);

    return (
        <div>
            <div className="content-header"><h1>Quản lý người dùng</h1></div>
            <div className="card">
                <div className="card-header">
                    <div className="input-group" style={{ maxWidth: 400 }}>
                        <input className="form-control" value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="Tìm kiếm người dùng..." />
                        <div className="input-group-append">
                            <button className="btn btn-primary" onClick={handleSearch}>Tìm</button>
                        </div>
                    </div>
                </div>
                <div className="card-body table-responsive p-0">
                    {loading ? (
                        <div className="text-center p-4"><div className="spinner-border text-primary"></div></div>
                    ) : (
                        <table className="table table-hover">
                            <thead><tr><th>ID</th><th>Họ tên</th><th>Email</th><th>SĐT</th><th>Vai trò</th><th>Trạng thái</th><th>Ngày tạo</th><th>Hành động</th></tr></thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.id}>
                                        <td>{u.id}</td>
                                        <td>{u.fullName}</td>
                                        <td>{u.email}</td>
                                        <td>{u.phone || '-'}</td>
                                        <td><span className={`badge ${u.role === 'Admin' ? 'badge-danger' : 'badge-primary'}`}>{u.role}</span></td>
                                        <td><span className={`badge ${u.isActive ? 'badge-success' : 'badge-secondary'}`}>{u.isActive ? 'Hoạt động' : 'Đã khóa'}</span></td>
                                        <td>{new Date(u.createdAt).toLocaleDateString('vi-VN')}</td>
                                        <td>
                                            <button className={`btn btn-sm ${u.isActive ? 'btn-warning' : 'btn-success'}`} onClick={() => toggleUser(u.id)}>
                                                {u.isActive ? 'Khóa' : 'Mở khóa'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
                {totalPages > 1 && (
                    <div className="card-footer d-flex justify-content-between align-items-center">
                        <span>Tổng: {totalCount} người dùng</span>
                        <div>
                            <button className="btn btn-sm btn-outline-secondary mr-1" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Trước</button>
                            <span className="mx-2">Trang {page}/{totalPages}</span>
                            <button className="btn btn-sm btn-outline-secondary ml-1" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Sau</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Users;
