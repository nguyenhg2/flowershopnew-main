import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { fmt } from '../components/fmt';
import orderApi from '../api/orderApi';

export function CheckoutPage() {
  const { cart, cartTotal, clearCart, navigate, showToast, user, setShowLogin } = useContext(AppContext);
  const [form, setForm] = useState({
    name: user?.fullName || '',
    phone: user?.phone || '',
    address: '',
    note: '',
    payment: 'COD'
  });
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Vui lòng nhập tên người nhận';
    if (!/^(0|\+84)\d{9}$/.test(form.phone)) e.phone = 'Số điện thoại không hợp lệ';
    if (!form.address.trim()) e.address = 'Vui lòng nhập địa chỉ giao hàng';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const placeOrder = async () => {
    if (!user) {
      showToast('Vui lòng đăng nhập để đặt hàng');
      setShowLogin(true);
      return;
    }
    if (!validate()) return;

    setLoading(true);
    try {
      await orderApi.create({
        receiverName: form.name,
        receiverPhone: form.phone,
        shippingAddress: form.address,
        note: form.note,
        paymentMethod: form.payment,
        items: cart.map(item => ({
          productId: item.id,
          quantity: item.qty
        }))
      });
      clearCart();
      setStep(3);
    } catch (error) {
      showToast(error.response?.data?.message || 'Đặt hàng thất bại');
    } finally {
      setLoading(false);
    }
  };

  const shipping = cartTotal >= 500000 ? 0 : 30000;
  const grandTotal = cartTotal + shipping;

  if (step === 3) {
    return (
      <div className="page" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh'
      }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{ fontSize: 60, marginBottom: 16, color: '#4a7c59' }}>OK</div>
          <div style={{
            fontFamily: 'Playfair Display,serif',
            fontSize: 28, marginBottom: 8
          }}>Đặt hàng thành công!</div>
          <div style={{ color: 'var(--muted)', marginBottom: 8 }}>
            Cảm ơn bạn đã tin tưởng Mộng Lan Flower
          </div>
          <div style={{ color: 'var(--muted)', marginBottom: 24, fontSize: 14 }}>
            Chúng tôi sẽ liên hệ xác nhận và giao hàng trong 2-4 giờ
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={() => navigate('home')}>Về trang chủ</button>
            <button className="btn btn-outline" onClick={() => navigate('profile')}>Xem đơn hàng</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div style={{ background: 'var(--warm)', padding: '28px 0', marginBottom: 28 }}>
        <div className="container">
          <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 28 }}>Đặt hàng</div>
        </div>
      </div>
      <div className="container" style={{
        display: 'grid', gridTemplateColumns: '1fr 340px',
        gap: 28, alignItems: 'start'
      }}>
        <div>
          <div style={{ display: 'flex', gap: 0, marginBottom: 32 }}>
            {['Thông tin giao hàng', 'Thanh toán'].map((s, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: step >= i + 1 ? 'var(--rose)' : 'var(--border)',
                  color: step >= i + 1 ? '#fff' : 'var(--muted)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 14, flexShrink: 0
                }}>{i + 1}</div>
                <span style={{
                  fontSize: 14,
                  fontWeight: step === i + 1 ? 700 : 400,
                  color: step === i + 1 ? 'var(--text)' : 'var(--muted)'
                }}>{s}</span>
                {i < 1 && <div style={{ flex: 1, height: 2, background: 'var(--border)', marginLeft: 8 }} />}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div style={{
              background: '#fff', borderRadius: 16,
              border: '1px solid var(--border)', padding: 28
            }}>
              <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 20 }}>Thông tin người nhận</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div className="form-group">
                  <label>Tên người nhận *</label>
                  <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nguyễn Văn A" />
                  {errors.name && <div style={{ color: 'var(--rose)', fontSize: 12, marginTop: 4 }}>{errors.name}</div>}
                </div>
                <div className="form-group">
                  <label>Số điện thoại *</label>
                  <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="0901 234 567" />
                  {errors.phone && <div style={{ color: 'var(--rose)', fontSize: 12, marginTop: 4 }}>{errors.phone}</div>}
                </div>
              </div>
              <div className="form-group">
                <label>Địa chỉ giao hàng *</label>
                <input value={form.address} onChange={e => set('address', e.target.value)}
                  placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố" />
                {errors.address && <div style={{ color: 'var(--rose)', fontSize: 12, marginTop: 4 }}>{errors.address}</div>}
              </div>
              <div className="form-group">
                <label>Ghi chú đơn hàng</label>
                <textarea value={form.note} onChange={e => set('note', e.target.value)}
                  rows={3} placeholder="Ví dụ: giao giờ hành chính..." />
              </div>
              <button className="btn btn-primary" style={{ padding: '12px 32px', fontSize: 15 }}
                onClick={() => { if (validate()) setStep(2); }}>
                Tiếp tục - Thanh toán
              </button>
            </div>
          )}

          {step === 2 && (
            <div style={{
              background: '#fff', borderRadius: 16,
              border: '1px solid var(--border)', padding: 28
            }}>
              <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 20 }}>Phương thức thanh toán</div>
              {[
                ['COD', 'Thanh toán khi nhận hàng (COD)', 'Trả tiền mặt cho shipper khi nhận hàng'],
                ['Transfer', 'Chuyển khoản ngân hàng', 'Chuyển khoản trước, xác nhận qua SMS']
              ].map(([v, l, sub]) => (
                <div key={v} onClick={() => set('payment', v)} style={{
                  border: `2px solid ${form.payment === v ? 'var(--rose)' : 'var(--border)'}`,
                  borderRadius: 12, padding: 16, marginBottom: 12, cursor: 'pointer',
                  background: form.payment === v ? '#fde8ee' : '#fff', transition: 'all .2s'
                }}>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{l}</div>
                  <div style={{ fontSize: 13, color: 'var(--muted)' }}>{sub}</div>
                  {v === 'Transfer' && form.payment === 'Transfer' && (
                    <div style={{
                      marginTop: 12, padding: 12, background: '#fff',
                      borderRadius: 8, fontSize: 13
                    }}>
                      <div style={{ fontWeight: 700, marginBottom: 4 }}>Thông tin tài khoản:</div>
                      <div>Ngân hàng: Vietcombank</div>
                      <div>Số TK: 1234 5678 9012</div>
                      <div>Chủ TK: CÔNG TY MỘNG LAN FLOWER</div>
                      <div>Nội dung: Tên + SĐT + Đặt hoa</div>
                    </div>
                  )}
                </div>
              ))}
              <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                <button className="btn btn-ghost" onClick={() => setStep(1)}>Quay lại</button>
                <button className="btn btn-primary"
                  style={{ padding: '12px 32px', fontSize: 15 }}
                  onClick={placeOrder} disabled={loading}>
                  {loading ? 'Đang xử lý...' : 'Xác nhận đặt hàng'}
                </button>
              </div>
            </div>
          )}
        </div>

        <div style={{
          background: '#fff', borderRadius: 16,
          border: '1px solid var(--border)',
          padding: 24, position: 'sticky', top: 80
        }}>
          <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 16 }}>Đơn hàng của bạn</div>
          {cart.map(i => {
            const imgSrc = i.img || '';
            return (
              <div key={i.id} style={{
                display: 'flex', gap: 10,
                alignItems: 'center', marginBottom: 12
              }}>
                <div style={{
                  width: 40, height: 40, background: 'var(--warm)',
                  borderRadius: 8, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', flexShrink: 0, fontSize: 18, overflow: 'hidden'
                }}>
                  {imgSrc && (imgSrc.startsWith('http') || imgSrc.startsWith('/')) ? (
                    <img src={imgSrc} alt={i.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span>{i.name?.charAt(0) || 'H'}</span>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>{i.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>x{i.qty}</div>
                </div>
                <span style={{ fontWeight: 700, fontSize: 14 }}>
                  {fmt((i.salePrice || i.sale || i.price) * i.qty)}
                </span>
              </div>
            );
          })}
          <div className="divider" />
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            fontSize: 14, marginBottom: 8, color: 'var(--muted)'
          }}>
            <span>Tạm tính</span><span>{fmt(cartTotal)}</span>
          </div>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            fontSize: 14, marginBottom: 12, color: '#4a7c59'
          }}>
            <span>Phí giao</span>
            <span>{shipping === 0 ? 'Miễn phí' : fmt(shipping)}</span>
          </div>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            fontSize: 18, fontWeight: 800, color: 'var(--rose)'
          }}>
            <span>Tổng</span><span>{fmt(grandTotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
