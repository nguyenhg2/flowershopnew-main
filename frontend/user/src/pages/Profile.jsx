import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { fmt } from '../components/fmt';
import authApi from '../api/authApi';
import orderApi from '../api/orderApi';

export function ProfilePage() {
  const { user, setUser, navigate, showToast, setShowLogin } = useContext(AppContext);
  const [tab, setTab] = useState('info');
  const [orders, setOrders] = useState([]);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setEditName(user.fullName || '');
    setEditPhone(user.phone || '');
    loadOrders();
  }, [user]);

  const loadOrders = () => {
    orderApi.getMyOrders()
      .then(res => setOrders(res.data))
      .catch(() => setOrders([]));
  };

  if (!user) {
    return (
      <div className="page" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Vui lòng đăng nhập</div>
          <button className="btn btn-primary" onClick={() => setShowLogin(true)}>Đăng nhập</button>
        </div>
      </div>
    );
  }

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const res = await authApi.updateProfile({ fullName: editName, phone: editPhone });
      setUser(res.data);
      showToast('Cập nhật thông tin thành công');
    } catch {
      showToast('Cập nhật thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPass !== confirmPass) {
      showToast('Mật khẩu xác nhận không khớp');
      return;
    }
    if (newPass.length < 6) {
      showToast('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }
    setLoading(true);
    try {
      await authApi.changePassword(oldPass, newPass);
      setOldPass('');
      setNewPass('');
      setConfirmPass('');
      showToast('Đổi mật khẩu thành công');
    } catch (error) {
      showToast(error.response?.data?.message || 'Đổi mật khẩu thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (id) => {
    if (!confirm('Xác nhận hủy đơn hàng?')) return;
    try {
      await orderApi.cancel(id);
      loadOrders();
      showToast('Đã hủy đơn hàng');
    } catch (error) {
      showToast(error.response?.data?.message || 'Hủy đơn thất bại');
    }
  };

  const handleConfirmReceived = async (id) => {
    if (!confirm('Xác nhận đã nhận hàng?')) return;
    try {
      await orderApi.confirmReceived(id);
      loadOrders();
      showToast('Xác nhận thành công! Bạn có thể đánh giá sản phẩm.');
    } catch (error) {
      showToast(error.response?.data?.message || 'Xác nhận thất bại');
    }
  };

  const statusMap = {
    Pending: 'Chờ xử lý',
    Preparing: 'Đang chuẩn bị hàng',
    Shipping: 'Đang vận chuyển',
    Delivered: 'Đã giao',
    Completed: 'Hoàn thành',
    Cancelled: 'Đã hủy'
  };

  const statusColor = {
    Pending: { bg: '#fff3e0', color: '#e65100' },
    Preparing: { bg: '#e3f2fd', color: '#1565c0' },
    Shipping: { bg: '#f3e5f5', color: '#7b1fa2' },
    Delivered: { bg: '#e8f5e9', color: '#2e7d32' },
    Completed: { bg: '#e8f5e9', color: '#4a7c59' },
    Cancelled: { bg: '#fde8ee', color: '#c2185b' }
  };

  function getDeliveredCountdown(order) {
    if (order.status !== 'Delivered' || !order.deliveredAt) return null;
    var ms = 72 * 60 * 60 * 1000 - (Date.now() - new Date(order.deliveredAt).getTime());
    if (ms <= 0) return 'Sắp tự động hoàn thành';
    var h = Math.floor(ms / 3600000);
    var m = Math.floor((ms % 3600000) / 60000);
    return 'Tự hoàn thành sau ' + h + 'h' + m + 'p nếu không xác nhận';
  }

  return (
    <div className="page">
      <div style={{ background: 'var(--warm)', padding: '28px 0', marginBottom: 28 }}>
        <div className="container">
          <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 28 }}>Tài khoản của tôi</div>
        </div>
      </div>
      <div className="container" style={{
        display: 'grid', gridTemplateColumns: '240px 1fr',
        gap: 28, alignItems: 'start'
      }}>
        <div style={{
          background: '#fff', borderRadius: 16,
          border: '1px solid var(--border)', padding: 20
        }}>
          <div style={{
            textAlign: 'center', marginBottom: 20, padding: '16px 0',
            borderBottom: '1px solid var(--border)'
          }}>
            <div style={{
              width: 60, height: 60, borderRadius: '50%',
              background: 'var(--rose)', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24, fontWeight: 700, margin: '0 auto 8px'
            }}>
              {(user.fullName || 'U').charAt(0).toUpperCase()}
            </div>
            <div style={{ fontWeight: 700 }}>{user.fullName}</div>
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>{user.email}</div>
          </div>
          {[
            ['info', 'Thông tin cá nhân'],
            ['orders', 'Lịch sử đơn hàng'],
            ['password', 'Đổi mật khẩu']
          ].map(([k, v]) => (
            <div key={k} onClick={() => setTab(k)} style={{
              padding: '10px 14px', borderRadius: 8, cursor: 'pointer',
              marginBottom: 4, fontSize: 14,
              background: tab === k ? '#fde8ee' : '',
              color: tab === k ? 'var(--rose)' : 'var(--text)',
              fontWeight: tab === k ? 700 : 400
            }}>{v}</div>
          ))}
        </div>

        <div style={{
          background: '#fff', borderRadius: 16,
          border: '1px solid var(--border)', padding: 28
        }}>
          {tab === 'info' && (
            <div>
              <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 20 }}>Thông tin cá nhân</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div className="form-group">
                  <label>Họ tên</label>
                  <input value={editName} onChange={e => setEditName(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Số điện thoại</label>
                  <input value={editPhone} onChange={e => setEditPhone(e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label>Email</label>
                <input value={user.email} disabled style={{ background: '#f5f5f5' }} />
              </div>
              <button className="btn btn-primary" onClick={handleUpdateProfile} disabled={loading}>
                {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          )}

          {tab === 'password' && (
            <div>
              <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 20 }}>Đổi mật khẩu</div>
              <div className="form-group">
                <label>Mật khẩu cũ</label>
                <input type="password" value={oldPass} onChange={e => setOldPass(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Mật khẩu mới</label>
                <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Xác nhận mật khẩu mới</label>
                <input type="password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} />
              </div>
              <button className="btn btn-primary" onClick={handleChangePassword} disabled={loading}>
                {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
              </button>
            </div>
          )}

          {tab === 'orders' && (
            <div>
              <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 20 }}>
                Lịch sử đơn hàng ({orders.length})
              </div>
              {orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40, color: 'var(--muted)' }}>
                  Bạn chưa có đơn hàng nào
                </div>
              ) : (
                orders.map(order => {
                  const sc = statusColor[order.status] || { bg: '#f5f5f5', color: '#333' };
                  const countdown = getDeliveredCountdown(order);
                  const canCancel = order.status === 'Pending' || order.status === 'Preparing';
                  const canConfirm = order.status === 'Delivered';
                  const canReview = order.status === 'Completed';
                  return (
                    <div key={order.id} style={{
                      border: '1px solid var(--border)', borderRadius: 12,
                      padding: 20, marginBottom: 16
                    }}>
                      <div style={{
                        display: 'flex', justifyContent: 'space-between',
                        alignItems: 'center', marginBottom: 12
                      }}>
                        <div>
                          <span style={{ fontWeight: 700 }}>Đơn #{order.orderCode}</span>
                          <span style={{ fontSize: 13, color: 'var(--muted)', marginLeft: 12 }}>
                            {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{
                            padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                            background: sc.bg, color: sc.color
                          }}>
                            {statusMap[order.status] || order.status}
                          </span>
                          {countdown && (
                            <div style={{ fontSize: 11, color: '#888', marginTop: 4 }}>{countdown}</div>
                          )}
                        </div>
                      </div>

                      {order.orderDetails && order.orderDetails.map(od => (
                        <div key={od.id} style={{
                          display: 'flex', justifyContent: 'space-between',
                          fontSize: 14, padding: '4px 0', color: '#555'
                        }}>
                          <span>{od.product?.name || `SP #${od.productId}`} x{od.quantity}</span>
                          <span>{fmt(od.unitPrice * od.quantity)}</span>
                        </div>
                      ))}

                      <div style={{
                        display: 'flex', justifyContent: 'space-between',
                        alignItems: 'center', marginTop: 12,
                        paddingTop: 12, borderTop: '1px solid var(--border)'
                      }}>
                        <span style={{ fontWeight: 800, color: 'var(--rose)' }}>
                          Tổng: {fmt(order.totalAmount)}
                        </span>
                        <div style={{ display: 'flex', gap: 8 }}>
                          {canCancel && (
                            <button className="btn btn-ghost"
                              style={{ fontSize: 12, color: 'red' }}
                              onClick={() => handleCancelOrder(order.id)}>
                              Hủy đơn
                            </button>
                          )}
                          {canConfirm && (
                            <button className="btn btn-primary"
                              style={{ fontSize: 12, padding: '6px 16px' }}
                              onClick={() => handleConfirmReceived(order.id)}>
                              Đã nhận hàng
                            </button>
                          )}
                          {canReview && order.orderDetails && (
                            <button className="btn btn-outline"
                              style={{ fontSize: 12, padding: '6px 16px' }}
                              onClick={() => navigate('product', { id: order.orderDetails[0]?.productId })}>
                              Đánh giá
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
