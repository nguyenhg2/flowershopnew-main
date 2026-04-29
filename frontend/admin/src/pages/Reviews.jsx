import React, { useState, useEffect } from 'react';
import { reviewApi } from '../services/api';

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [keyword, setKeyword] = useState('');
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const pageSize = 20;

    useEffect(() => { load(); }, [page]);

    const load = (p = page) => {
        setLoading(true);
        const params = { page: p, pageSize };
        if (keyword) params.keyword = keyword;
        reviewApi.getAll(params)
            .then(res => { setReviews(res.data.items || []); setTotalCount(res.data.totalCount || 0); })
            .catch(() => { setReviews([]); setTotalCount(0); })
            .finally(() => setLoading(false));
    };

    const handleSearch = () => { setPage(1); load(1); };

    const remove = async (id) => {
        if (!window.confirm('Xac nhan xoa danh gia nay?')) return;
        try { await reviewApi.remove(id); load(); } catch { }
    };

    const totalPages = Math.ceil(totalCount / pageSize);

    return (
        <div>
            <div className="content-header"><h1>Quan ly danh gia ({totalCount})</h1></div>
            <div className="card">
                <div className="card-header">
                    <div className="input-group" style={{ maxWidth: 400 }}>
                        <input className="form-control" value={keyword} onChange={e => setKeyword(e.target.value)}
                            placeholder="Tim theo san pham, nguoi danh gia..." onKeyDown={e => e.key === 'Enter' && handleSearch()} />
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
                            <thead><tr><th>ID</th><th>San pham</th><th>Nguoi danh gia</th><th>Sao</th><th>Noi dung</th><th>Ngay</th><th>Hanh dong</th></tr></thead>
                            <tbody>
                                {reviews.map(r => (
                                    <tr key={r.id}>
                                        <td>{r.id}</td>
                                        <td>{r.productName || '-'}</td>
                                        <td>{r.userName || '-'}</td>
                                        <td>{'*'.repeat(r.stars)}</td>
                                        <td>{r.comment || '-'}</td>
                                        <td>{new Date(r.createdAt).toLocaleDateString('vi-VN')}</td>
                                        <td><button className="btn btn-sm btn-danger" onClick={() => remove(r.id)}><i className="fas fa-trash"></i> Xoa</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
                {totalPages > 1 && (
                    <div className="card-footer d-flex justify-content-between align-items-center">
                        <span>Tong: {totalCount} danh gia</span>
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

export default Reviews;
