import React, { useState, useEffect } from 'react';
import { bannerApi } from '../services/api';

const Banners = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ title: '', subtitle: '', buttonText: '', backgroundCss: '', isActive: true });
    const [formError, setFormError] = useState('');

    useEffect(() => { load(); }, []);

    const load = () => {
        setLoading(true);
        bannerApi.getAll().then(res => setBanners(res.data || [])).catch(() => setBanners([])).finally(() => setLoading(false));
    };

    const openAdd = () => { setEditing(null); setForm({ title: '', subtitle: '', buttonText: 'Mua ngay', backgroundCss: 'linear-gradient(135deg,#c84b6b,#8b2d47)', isActive: true }); setFormError(''); setShowModal(true); };
    const openEdit = (b) => { setEditing(b); setForm({ title: b.title, subtitle: b.subtitle || '', buttonText: b.buttonText || '', backgroundCss: b.backgroundCss || '', isActive: b.isActive }); setFormError(''); setShowModal(true); };

    const save = async () => {
        if (!form.title.trim()) { setFormError('Vui lòng nhập tiêu đề'); return; }
        setLoading(true);
        try {
            if (editing) { await bannerApi.update(editing.id, form); }
            else { await bannerApi.create(form); }
            setShowModal(false); load();
        } catch (err) { setFormError(err.response?.data?.message || 'Lưu thất bại'); }
        finally { setLoading(false); }
    };

    const remove = async (id) => {
        if (!window.confirm('Xác nhận xóa banner này?')) return;
        try { await bannerApi.remove(id); load(); } catch { /* bo qua */ }
    };

    return (
        <div>
            <div className="content-header d-flex justify-content-between align-items-center">
                <h1>Quản lý Banner</h1>
                <button className="btn btn-primary" onClick={openAdd}><i className="fas fa-plus mr-1"></i> Thêm mới</button>
            </div>
            <div className="card">
                <div className="card-body table-responsive p-0">
                    {loading ? (
                        <div className="text-center p-4"><div className="spinner-border text-primary"></div></div>
                    ) : (
                        <table className="table table-hover">
                            <thead><tr><th>ID</th><th>Tiêu đề</th><th>Phụ đề</th><th>Trạng thái</th><th>Hành động</th></tr></thead>
                            <tbody>
                                {banners.map(b => (
                                    <tr key={b.id}>
                                        <td>{b.id}</td><td>{b.title}</td><td>{b.subtitle || '-'}</td>
                                        <td><span className={`badge ${b.isActive ? 'badge-success' : 'badge-secondary'}`}>{b.isActive ? 'Hiển thị' : 'Ẩn'}</span></td>
                                        <td>
                                            <button className="btn btn-sm btn-info mr-1" onClick={() => openEdit(b)}><i className="fas fa-edit"></i> Sửa</button>
                                            <button className="btn btn-sm btn-danger" onClick={() => remove(b.id)}><i className="fas fa-trash"></i> Xóa</button>
                                        </td>
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
                                <h5 className="modal-title">{editing ? 'Sửa banner' : 'Thêm banner mới'}</h5>
                                <button type="button" className="close" onClick={() => setShowModal(false)}><span>&times;</span></button>
                            </div>
                            <div className="modal-body">
                                {formError && <div className="alert alert-danger">{formError}</div>}
                                <div className="form-group"><label>Tiêu đề *</label>
                                    <input className="form-control" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
                                <div className="form-group"><label>Phụ đề</label>
                                    <input className="form-control" value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} /></div>
                                <div className="form-group"><label>Nút bấm</label>
                                    <input className="form-control" value={form.buttonText} onChange={e => setForm(f => ({ ...f, buttonText: e.target.value }))} /></div>
                                <div className="form-group"><label>CSS nền</label>
                                    <input className="form-control" value={form.backgroundCss} onChange={e => setForm(f => ({ ...f, backgroundCss: e.target.value }))} />
                                    {form.backgroundCss && <div style={{ background: form.backgroundCss, height: 40, borderRadius: 4, marginTop: 8 }}></div>}
                                </div>
                                <div className="form-check">
                                    <input type="checkbox" className="form-check-input" id="isActive" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} />
                                    <label className="form-check-label" htmlFor="isActive">Hiển thị</label>
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

export default Banners;
