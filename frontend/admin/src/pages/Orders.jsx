import React, { useState, useEffect } from 'react';
import { orderApi } from '../services/api';

const fmt = (n) => n != null ? n.toLocaleString('vi-VN') + 'd' : '';

const statusMap = {
    Pending: 'Cho xu ly',
    Preparing: 'Dang chuan bi hang',
    Shipping: 'Dang van chuyen',
    Delivered: 'Da giao',
    Completed: 'Hoan thanh',
    Cancelled: 'Da huy'
};

const statusBadge = {
    Pending: 'badge-warning',
    Preparing: 'badge-info',
    Shipping: 'badge-primary',
    Delivered: 'badge-success',
    Completed: 'badge-success',
    Cancelled: 'badge-danger'
};

const statusFlow = {
    Pending: ['Preparing', 'Cancelled'],
    Preparing: ['Shipping', 'Cancelled'],
    Shipping: ['Delivered'],
    Delivered: [],
    Completed: [],
    Cancelled: []
};

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filterStatus, setFilterStatus] = useState('');
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const pageSize = 20;

    useEffect(() => { setPage(1); }, [filterStatus]);
    useEffect(() => { load(); }, [filterStatus, page]);

    const load = () => {
        setLoading(true);
        const params = { page, pageSize };
        if (filterStatus) params.status = filterStatus;
        orderApi.getAll(params)
            .then(res => {
                const d = res.data;
                setOrders(d.items || []);
                setTotalCount(d.totalCount || 0);
            })
            .catch(() => { setOrders([]); setTotalCount(0); })
            .finally(() => setLoading(false));
    };

    const updateStatus = async (id, status) => {
        try { await orderApi.updateStatus(id, status); load(); } catch { }
    };

    const totalPages = Math.ceil(totalCount / pageSize);

    return (
        <div>
            <div className="content-header"><h1>Quan ly don hang ({totalCount})</h1></div>
            <div className="card">
                <div className="card-header">
                    <select className="form-control" style={{ maxWidth: 200 }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                        <option value="">Tat ca trang thai</option>
                        {Object.keys(statusMap).map(k => <option key={k} value={k}>{statusMap[k]}</option>)}
                    </select>
                </div>
                <div className="card-body">
                    {loading ? (
                        <div className="text-center p-4"><div className="spinner-border text-primary"></div></div>
                    ) : orders.length === 0 ? (
                        <p className="text-muted text-center p-4">Khong co don hang</p>
                    ) : (
                        orders.map(order => (
                            <div key={order.id} className="card mb-3">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong>Don #{order.orderCode}</strong>
                                        <small className="text-muted ml-2">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</small>
                                        <br />
                                        <small className="text-muted">
                                            KH: {order.user?.fullName || '-'} | SDT: {order.receiverPhone} | Dia chi: {order.shippingAddress}
                                        </small>
                                    </div>
                                    <span className={`badge ${statusBadge[order.status] || 'badge-secondary'}`}>{statusMap[order.status] || order.status}</span>
                                </div>
                                <div className="card-body p-2">
                                    <table className="table table-sm mb-0">
                                        <tbody>
                                            {order.orderDetails?.map(od => (
                                                <tr key={od.id}>
                                                    <td>{od.product?.name || `SP #${od.productId}`}</td>
                                                    <td>x{od.quantity}</td>
                                                    <td className="text-right">{fmt(od.unitPrice * od.quantity)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="card-footer d-flex justify-content-between align-items-center">
                                    <strong className="text-danger">Tong: {fmt(order.totalAmount)}</strong>
                                    <div>
                                        {(statusFlow[order.status] || []).length > 0 && (
                                            <select
                                                className="form-control form-control-sm d-inline-block"
                                                style={{ width: 'auto' }}
                                                defaultValue=""
                                                onChange={e => { if (e.target.value) updateStatus(order.id, e.target.value); }}
                                            >
                                                <option value="" disabled>Chuyen trang thai</option>
                                                {statusFlow[order.status].map(s => (
                                                    <option key={s} value={s}>{statusMap[s]}</option>
                                                ))}
                                            </select>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                {totalPages > 1 && (
                    <div className="card-footer d-flex justify-content-between align-items-center">
                        <span>Tong: {totalCount} don hang</span>
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

export default Orders;
