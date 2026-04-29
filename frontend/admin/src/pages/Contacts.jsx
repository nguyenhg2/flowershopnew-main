import React, { useState, useEffect } from 'react';
import { contactApi } from '../services/api';

const Contacts = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const pageSize = 20;

    useEffect(() => { load(); }, [page]);

    const load = () => {
        setLoading(true);
        contactApi.getAll({ page, pageSize })
            .then(res => {
                const d = res.data;
                setContacts(d.items || []);
                setTotalCount(d.totalCount || 0);
            })
            .catch(() => { setContacts([]); setTotalCount(0); })
            .finally(() => setLoading(false));
    };

    const markRead = async (id) => {
        try { await contactApi.markRead(id); load(); } catch { }
    };

    const remove = async (id) => {
        if (!window.confirm('Xac nhan xoa lien he nay?')) return;
        try { await contactApi.remove(id); load(); } catch { }
    };

    const totalPages = Math.ceil(totalCount / pageSize);

    return (
        <div>
            <div className="content-header"><h1>Quan ly lien he ({totalCount})</h1></div>
            <div className="card">
                <div className="card-body table-responsive p-0">
                    {loading ? (
                        <div className="text-center p-4"><div className="spinner-border text-primary"></div></div>
                    ) : (
                        <table className="table table-hover">
                            <thead><tr><th>ID</th><th>Ho ten</th><th>Email</th><th>SDT</th><th>Noi dung</th><th>Trang thai</th><th>Ngay</th><th>Hanh dong</th></tr></thead>
                            <tbody>
                                {contacts.map(c => (
                                    <tr key={c.id} style={{ background: c.isRead ? '' : '#fff9e6' }}>
                                        <td>{c.id}</td>
                                        <td>{c.fullName}</td>
                                        <td>{c.email}</td>
                                        <td>{c.phone || '-'}</td>
                                        <td style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.message}</td>
                                        <td><span className={`badge ${c.isRead ? 'badge-secondary' : 'badge-warning'}`}>{c.isRead ? 'Da doc' : 'Chua doc'}</span></td>
                                        <td>{new Date(c.createdAt).toLocaleDateString('vi-VN')}</td>
                                        <td>
                                            {!c.isRead && <button className="btn btn-sm btn-info mr-1" onClick={() => markRead(c.id)}><i className="fas fa-check"></i> Da doc</button>}
                                            <button className="btn btn-sm btn-danger" onClick={() => remove(c.id)}><i className="fas fa-trash"></i> Xoa</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
                {totalPages > 1 && (
                    <div className="card-footer d-flex justify-content-between align-items-center">
                        <span>Tong: {totalCount} lien he</span>
                        <div>
                            <button className="btn btn-sm btn-outline-secondary mr-1" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Truoc</button>
                            <span className="mx-2">Trang {page}/{totalPages}</span>
                            <button className="btn btn-sm btn-outline-secondary ml-1" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Sau</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Contacts;
