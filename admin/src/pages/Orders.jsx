import React, { useState, useEffect } from 'react';
import { orderApi } from '../services/api';

const fmt = (n) => n != null ? n.toLocaleString('vi-VN') + 'd' : '';

const statusMap = {
    Pending: 'Chờ xử lý', Confirmed: 'Đã xác nhận', Processing: 'Đang xử lý',
    Shipping: 'Đang vận chuyển', Delivered: 'Đã giao', Completed: 'Hoàn thành', Cancelled: 'Đã hủy'
};

const statusBadge = {
    Pending: 'badge-warning', Confirmed: 'badge-info', Processing: 'badge-primary',
    Shipping: 'badge-secondary', Delivered: 'badge-success', Completed: 'badge-success', Cancelled: 'badge-danger'
};

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filterStatus, setFilterStatus] = useState('');

    useEffect(() => { load(); }, [filterStatus]);

    const load = () => {
        setLoading(true);
        orderApi.getAll(filterStatus || undefined)
            .then(res => setOrders(res.data || []))
            .catch(() => setOrders([]))
            .finally(() => setLoading(false));
    };

    const updateStatus = async (id, status) => {
        try { await orderApi.updateStatus(id, status); load(); } catch { /* bo qua */ }
    };

    return (
        <div>
            <div className="content-header"><h1>Quản lý đơn hàng ({orders.length})</h1></div>
            <div className="card">
                <div className="card-header">
                    <select className="form-control" style={{ maxWidth: 200 }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                        <option value="">Tất cả trạng thái</option>
                        {Object.keys(statusMap).map(k => <option key={k} value={k}>{statusMap[k]}</option>)}
                    </select>
                </div>
                <div className="card-body">
                    {loading ? (
                        <div className="text-center p-4"><div className="spinner-border text-primary"></div></div>
                    ) : orders.length === 0 ? (
                        <p className="text-muted text-center p-4">Không có đơn hàng</p>
                    ) : (
                        orders.map(order => (
                            <div key={order.id} className="card mb-3">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong>Đơn #{order.orderCode}</strong>
                                        <small className="text-muted ml-2">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</small>
                                        <br />
                                        <small className="text-muted">
                                            KH: {order.user?.fullName || '-'} | SĐT: {order.receiverPhone} | Địa chỉ: {order.shippingAddress}
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
                                    <strong className="text-danger">Tổng: {fmt(order.totalAmount)}</strong>
                                    <div>
                                        {order.status === 'Pending' && (
                                            <>
                                                <button className="btn btn-sm btn-success mr-1" onClick={() => updateStatus(order.id, 'Confirmed')}>Xác nhận</button>
                                                <button className="btn btn-sm btn-danger" onClick={() => updateStatus(order.id, 'Cancelled')}>Hủy</button>
                                            </>
                                        )}
                                        {order.status === 'Confirmed' && <button className="btn btn-sm btn-primary" onClick={() => updateStatus(order.id, 'Processing')}>Bắt đầu xử lý</button>}
                                        {order.status === 'Processing' && <button className="btn btn-sm btn-info" onClick={() => updateStatus(order.id, 'Shipping')}>Đang vận chuyển</button>}
                                        {order.status === 'Shipping' && <button className="btn btn-sm btn-success" onClick={() => updateStatus(order.id, 'Delivered')}>Đã giao</button>}
                                        {order.status === 'Delivered' && <button className="btn btn-sm btn-success" onClick={() => updateStatus(order.id, 'Completed')}>Hoàn thành</button>}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Orders;
