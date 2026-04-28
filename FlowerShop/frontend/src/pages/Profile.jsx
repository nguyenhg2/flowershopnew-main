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
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Vui long dang nhap</div>
          <button className="btn btn-primary" onClick={() => setShowLogin(true)}>Dang nhap</button>
        </div>
      </div>
    );
  }

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const res = await authApi.updateProfile({ fullName: editName, phone: editPhone });
      setUser(res.data);
      showToast('Cap nhat thong tin thanh cong');
    } catch {
      showToast('Cap nhat that bai');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPass !== confirmPass) {
      showToast('Mat khau xac nhan khong khop');
      return;
    }
    if (newPass.length < 6) {
      showToast('Mat khau moi phai co it nhat 6 ky tu');
      return;
    }
    setLoading(true);
    try {
      await authApi.changePassword(oldPass, newPass);
      setOldPass('');
      setNewPass('');
      setConfirmPass('');
      showToast('Doi mat khau thanh cong');
    } catch (error) {
      showToast(error.response?.data?.message || 'Doi mat khau that bai');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (id) => {
    if (!confirm('Xac nhan huy don hang?')) return;
    try {
      await orderApi.cancel(id);
      loadOrders();
      showToast('Da huy don hang');
    } catch (error) {
      showToast(error.response?.data?.message || 'Huy don that bai');
    }
  };

  const statusMap = {
    Pending: 'Cho xu ly',
    Confirmed: 'Da xac nhan',
    Shipping: 'Dang giao',
    Completed: 'Hoan thanh',
    Cancelled: 'Da huy'
  };

  return (
    <div className="page">
      <div style={{ background: 'var(--warm)', padding: '28px 0', marginBottom: 28 }}>
        <div className="container">
          <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 28 }}>Tai khoan cua toi</div>
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
            ['info', 'Thong tin ca nhan'],
            ['orders', 'Lich su don hang'],
            ['password', 'Doi mat khau']
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
              <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 20 }}>Thong tin ca nhan</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div className="form-group">
                  <label>Ho ten</label>
                  <input value={editName} onChange={e => setEditName(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>So dien thoai</label>
                  <input value={editPhone} onChange={e => setEditPhone(e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label>Email</label>
                <input value={user.email} disabled style={{ background: '#f5f5f5' }} />
              </div>
              <button className="btn btn-primary" onClick={handleUpdateProfile} disabled={loading}>
                {loading ? 'Dang luu...' : 'Luu thay doi'}
              </button>
            </div>
          )}

          {tab === 'password' && (
            <div>
              <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 20 }}>Doi mat khau</div>
              <div className="form-group">
                <label>Mat khau cu</label>
                <input type="password" value={oldPass} onChange={e => setOldPass(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Mat khau moi</label>
                <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Xac nhan mat khau moi</label>
                <input type="password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} />
              </div>
              <button className="btn btn-primary" onClick={handleChangePassword} disabled={loading}>
                {loading ? 'Dang xu ly...' : 'Doi mat khau'}
              </button>
            </div>
          )}

          {tab === 'orders' && (
            <div>
              <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 20 }}>
                Lich su don hang ({orders.length})
              </div>
              {orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40, color: 'var(--muted)' }}>
                  Ban chua co don hang nao
                </div>
              ) : (
                orders.map(order => (
                  <div key={order.id} style={{
                    border: '1px solid var(--border)', borderRadius: 12,
                    padding: 20, marginBottom: 16
                  }}>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between',
                      alignItems: 'center', marginBottom: 12
                    }}>
                      <div>
                        <span style={{ fontWeight: 700 }}>Don #{order.orderCode}</span>
                        <span style={{ fontSize: 13, color: 'var(--muted)', marginLeft: 12 }}>
                          {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      <span style={{
                        padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                        background: order.status === 'Completed' ? '#e8f5e9' :
                          order.status === 'Cancelled' ? '#fde8ee' : '#fff3e0',
                        color: order.status === 'Completed' ? '#4a7c59' :
                          order.status === 'Cancelled' ? 'var(--rose)' : '#e65100'
                      }}>
                        {statusMap[order.status] || order.status}
                      </span>
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
                        Tong: {fmt(order.totalAmount)}
                      </span>
                      {(order.status === 'Pending' || order.status === 'Confirmed') && (
                        <button className="btn btn-ghost"
                          style={{ fontSize: 12, color: 'red' }}
                          onClick={() => handleCancelOrder(order.id)}>
                          Huy don
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
