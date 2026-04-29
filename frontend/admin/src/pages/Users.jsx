import React, { useState, useEffect } from 'react';
import { userApi } from '../services/api';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(1);
    const [keyword, setKeyword] = useState('');
    const pageSize = 10;

    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ fullName: '', email: '', phone: '', role: 'Customer', password: '' });
    const [formError, setFormError] = useState('');

    useEffect(() => { load(); }, [page]);

    const load = (p = page) => {
        setLoading(true);
        const params = { page: p, pageSize };
        if (keyword) params.keyword = keyword;
        userApi.getAll(params)
            .then(res => { setUsers(res.data.items || []); setTotalCount(res.data.totalCount || 0); })
            .catch(() => setUsers([]))
            .finally(() => setLoading(false));
    };

    const handleSearch = () => { setPage(1); load(1); };

    const openAdd = () => {
        setEditing(null);
        setForm({ fullName: '', email: '', phone: '', role: 'Customer', password: '' });
        setFormError('');
        setShowModal(true);
    };

    const openEdit = (u) => {
        setEditing(u);
        setForm({ fullName: u.fullName || '', email: u.email || '', phone: u.phone || '', role: u.role || 'Customer', password: '' });
        setFormError('');
        setShowModal(true);
    };

    const save = async () => {
        if (!editing && (!form.email || !form.password)) {
            setFormError('Email va mat khau la bat buoc');
            return;
        }
        setLoading(true);
        try {
            if (editing) {
                const data = { fullName: form.fullName, phone: form.phone, role: form.role };
                if (form.password) data.password = form.password;
                await userApi.update(editing.id, data);
            } else {
                await userApi.create(form);
            }
            setShowModal(false);
            load();
        } catch (err) {
            setFormError(err.response?.data?.message || 'Luu that bai');
        } finally { setLoading(false); }
    };

    const removeUser = async (id) => {
        if (!window.confirm('Xac nhan xoa nguoi dung nay?')) return;
        try { await userApi.remove(id); load(); } catch { }
    };

    const toggleUser = async (id) => {
        try { await userApi.toggle(id); load(); } catch { }
    };

    const totalPages = Math.ceil(totalCount / pageSize);

    return (
        <div>
            <div className="content-header d-flex justify-content-between align-items-center">
                <h1>Quan ly nguoi dung ({totalCount})</h1>
                <button className="btn btn-primary" onClick={openAdd}><i className="fas fa-plus mr-1"></i> Them moi</button>
            </div>
            <div className="card">
                <div className="card-header">
                    <div className="input-group" style={{ maxWidth: 400 }}>
                        <input className="form-control" value={keyword} onChange={e => setKeyword(e.target.value)}
                            placeholder="Tim kiem nguoi dung..." onKeyDown={e => e.key === 'Enter' && handleSearch()} />
                        <div className="input-group-append">
                            <button className="btn btn-primary" onClick={handleSearch}>Tim</button>
                        </div>
                    </div>
                </div>
                <div className="card-body table-responsive p-0">
                    {loading ? (
                        <div className="text-center p-4"><div className="spinner-border text-primary"></div></div>
                    ) : (
                        <table className="table table-hover">
                            <thead><tr><th>ID</th><th>Ho ten</th><th>Email</th><th>SDT</th><th>Vai tro</th><th>Trang thai</th><th>Ngay tao</th><th>Hanh dong</th></tr></thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.id}>
                                        <td>{u.id}</td>
                                        <td>{u.fullName}</td>
                                        <td>{u.email}</td>
                                        <td>{u.phone || '-'}</td>
                                        <td><span className={`badge ${u.role === 'Admin' ? 'badge-danger' : 'badge-primary'}`}>{u.role}</span></td>
                                        <td><span className={`badge ${u.isActive ? 'badge-success' : 'badge-secondary'}`}>{u.isActive ? 'Hoat dong' : 'Da khoa'}</span></td>
                                        <td>{new Date(u.createdAt).toLocaleDateString('vi-VN')}</td>
                                        <td>
                                            <button className="btn btn-sm btn-info mr-1" onClick={() => openEdit(u)}><i className="fas fa-edit"></i></button>
                                            <button className={`btn btn-sm ${u.isActive ? 'btn-warning' : 'btn-success'} mr-1`} onClick={() => toggleUser(u.id)}>
                                                {u.isActive ? 'Khoa' : 'Mo'}
                                            </button>
                                            <button className="btn btn-sm btn-danger" onClick={() => removeUser(u.id)}><i className="fas fa-trash"></i></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
                {totalPages > 1 && (
                    <div className="card-footer d-flex justify-content-between align-items-center">
                        <span>Tong: {totalCount} nguoi dung</span>
                        <div>
                            <button className="btn btn-sm btn-outline-secondary mr-1" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Truoc</button>
                            <span className="mx-2">Trang {page}/{totalPages}</span>
                            <button className="btn btn-sm btn-outline-secondary ml-1" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Sau</button>
                        </div>
                    </div>
                )}
            </div>

            {showModal && (
                <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{editing ? 'Sua nguoi dung' : 'Them nguoi dung'}</h5>
                                <button type="button" className="close" onClick={() => setShowModal(false)}><span>&times;</span></button>
                            </div>
                            <div className="modal-body">
                                {formError && <div className="alert alert-danger">{formError}</div>}
                                <div className="form-group">
                                    <label>Ho ten</label>
                                    <input className="form-control" value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label>Email {!editing && '*'}</label>
                                    <input className="form-control" value={form.email} disabled={!!editing}
                                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label>SDT</label>
                                    <input className="form-control" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label>Vai tro</label>
                                    <select className="form-control" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                                        <option value="Customer">Customer</option>
                                        <option value="Admin">Admin</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>{editing ? 'Mat khau moi (bo trong neu khong doi)' : 'Mat khau *'}</label>
                                    <input type="password" className="form-control" value={form.password}
                                        onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-default" onClick={() => setShowModal(false)}>Huy</button>
                                <button className="btn btn-primary" onClick={save} disabled={loading}>{loading ? 'Dang luu...' : 'Luu'}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;
