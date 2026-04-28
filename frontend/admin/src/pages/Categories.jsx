import React, { useState, useEffect } from 'react';
import { categoryApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Categories = () => {
    const { isAdmin } = useAuth();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: '', description: '' });
    const [formError, setFormError] = useState('');

    useEffect(() => { load(); }, []);

    const load = () => {
        setLoading(true);
        categoryApi.getAll()
            .then(res => setCategories(res.data || []))
            .catch(() => setCategories([]))
            .finally(() => setLoading(false));
    };

    const openAdd = () => { setEditing(null); setForm({ name: '', description: '' }); setFormError(''); setShowModal(true); };
    const openEdit = (c) => { setEditing(c); setForm({ name: c.name, description: c.description || '' }); setFormError(''); setShowModal(true); };

    const save = async () => {
        if (!form.name.trim()) { setFormError('Vui lòng nhập tên danh mục'); return; }
        setLoading(true);
        try {
            if (editing) { await categoryApi.update(editing.id, form); }
            else { await categoryApi.create(form); }
            setShowModal(false);
            load();
        } catch (err) { setFormError(err.response?.data?.message || 'Lưu thất bại'); }
        finally { setLoading(false); }
    };

    const remove = async (id) => {
        if (!window.confirm('Xác nhận xóa danh mục này?')) return;
        try { await categoryApi.remove(id); load(); } catch { /* bo qua */ }
    };

    return (
        <div>
            <div className="content-header d-flex justify-content-between align-items-center">
                <h1>Quản lý danh mục</h1>
                {isAdmin && <button className="btn btn-primary" onClick={openAdd}><i className="fas fa-plus mr-1"></i> Thêm mới</button>}
            </div>
            <div className="card">
                <div className="card-body table-responsive p-0">
                    {loading ? (
                        <div className="text-center p-4"><div className="spinner-border text-primary"></div></div>
                    ) : (
                        <table className="table table-hover">
                            <thead><tr><th>ID</th><th>Tên danh mục</th><th>Mô tả</th>{isAdmin && <th>Hành động</th>}</tr></thead>
                            <tbody>
                                {categories.map(c => (
                                    <tr key={c.id}>
                                        <td>{c.id}</td><td>{c.name}</td><td>{c.description || '-'}</td>
                                        {isAdmin && (
                                            <td>
                                                <button className="btn btn-sm btn-info mr-1" onClick={() => openEdit(c)}><i className="fas fa-edit"></i> Sửa</button>
                                                <button className="btn btn-sm btn-danger" onClick={() => remove(c.id)}><i className="fas fa-trash"></i> Xóa</button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {showModal && (
                <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{editing ? 'Sửa danh mục' : 'Thêm danh mục mới'}</h5>
                                <button type="button" className="close" onClick={() => setShowModal(false)}><span>&times;</span></button>
                            </div>
                            <div className="modal-body">
                                {formError && <div className="alert alert-danger">{formError}</div>}
                                <div className="form-group">
                                    <label>Tên danh mục *</label>
                                    <input className="form-control" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label>Mô tả</label>
                                    <textarea className="form-control" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-default" onClick={() => setShowModal(false)}>Hủy</button>
                                <button className="btn btn-primary" onClick={save} disabled={loading}>{loading ? 'Đang lưu...' : 'Lưu'}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Categories;
