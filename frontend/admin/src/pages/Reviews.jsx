import React, { useState, useEffect } from 'react';
import { reviewApi } from '../services/api';

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => { load(); }, []);

    const load = () => {
        setLoading(true);
        reviewApi.getAll().then(res => setReviews(res.data || [])).catch(() => setReviews([])).finally(() => setLoading(false));
    };

    const remove = async (id) => {
        if (!window.confirm('Xác nhận xóa đánh giá này?')) return;
        try { await reviewApi.remove(id); load(); } catch { /* bo qua */ }
    };

    return (
        <div>
            <div className="content-header"><h1>Quản lý đánh giá ({reviews.length})</h1></div>
            <div className="card">
                <div className="card-body table-responsive p-0">
                    {loading ? (
                        <div className="text-center p-4"><div className="spinner-border text-primary"></div></div>
                    ) : (
                        <table className="table table-hover">
                            <thead><tr><th>ID</th><th>Sản phẩm</th><th>Người đánh giá</th><th>Sao</th><th>Nội dung</th><th>Ngày</th><th>Hành động</th></tr></thead>
                            <tbody>
                                {reviews.map(r => (
                                    <tr key={r.id}>
                                        <td>{r.id}</td>
                                        <td>{r.productName || '-'}</td>
                                        <td>{r.userName || '-'}</td>
                                        <td>{'*'.repeat(r.stars)}</td>
                                        <td>{r.comment || '-'}</td>
                                        <td>{new Date(r.createdAt).toLocaleDateString('vi-VN')}</td>
                                        <td><button className="btn btn-sm btn-danger" onClick={() => remove(r.id)}><i className="fas fa-trash"></i> Xóa</button></td>
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

export default Reviews;
