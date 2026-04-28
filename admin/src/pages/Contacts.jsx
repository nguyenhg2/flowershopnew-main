import React, { useState, useEffect } from 'react';
import { contactApi } from '../services/api';

const Contacts = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => { load(); }, []);

    const load = () => {
        setLoading(true);
        contactApi.getAll().then(res => setContacts(res.data || [])).catch(() => setContacts([])).finally(() => setLoading(false));
    };

    const markRead = async (id) => {
        try { await contactApi.markRead(id); load(); } catch { /* bo qua */ }
    };

    const remove = async (id) => {
        if (!window.confirm('Xác nhận xóa liên hệ này?')) return;
        try { await contactApi.remove(id); load(); } catch { /* bo qua */ }
    };

    return (
        <div>
            <div className="content-header"><h1>Quản lý liên hệ ({contacts.length})</h1></div>
            <div className="card">
                <div className="card-body table-responsive p-0">
                    {loading ? (
                        <div className="text-center p-4"><div className="spinner-border text-primary"></div></div>
                    ) : (
                        <table className="table table-hover">
                            <thead><tr><th>ID</th><th>Họ tên</th><th>Email</th><th>SĐT</th><th>Nội dung</th><th>Trạng thái</th><th>Ngày</th><th>Hành động</th></tr></thead>
                            <tbody>
                                {contacts.map(c => (
                                    <tr key={c.id} style={{ background: c.isRead ? '' : '#fff9e6' }}>
                                        <td>{c.id}</td>
                                        <td>{c.fullName}</td>
                                        <td>{c.email}</td>
                                        <td>{c.phone || '-'}</td>
                                        <td style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.message}</td>
                                        <td><span className={`badge ${c.isRead ? 'badge-secondary' : 'badge-warning'}`}>{c.isRead ? 'Đã đọc' : 'Chưa đọc'}</span></td>
                                        <td>{new Date(c.createdAt).toLocaleDateString('vi-VN')}</td>
                                        <td>
                                            {!c.isRead && <button className="btn btn-sm btn-info mr-1" onClick={() => markRead(c.id)}><i className="fas fa-check"></i> Đã đọc</button>}
                                            <button className="btn btn-sm btn-danger" onClick={() => remove(c.id)}><i className="fas fa-trash"></i> Xóa</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Contacts;
