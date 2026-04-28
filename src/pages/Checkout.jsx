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
    if (!form.name.trim()) e.name = 'Vui long nhap ten nguoi nhan';
    if (!/^(0|\+84)\d{9}$/.test(form.phone)) e.phone = 'So dien thoai khong hop le';
    if (!form.address.trim()) e.address = 'Vui long nhap dia chi giao hang';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const placeOrder = async () => {
    if (!user) {
      showToast('Vui long dang nhap de dat hang');
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
      showToast(error.response?.data?.message || 'Dat hang that bai');
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
          }}>Dat hang thanh cong!</div>
          <div style={{ color: 'var(--muted)', marginBottom: 8 }}>
            Cam on ban da tin tuong Mong Lan Flower
          </div>
          <div style={{ color: 'var(--muted)', marginBottom: 24, fontSize: 14 }}>
            Chung toi se lien he xac nhan va giao hang trong 2-4 gio
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={() => navigate('home')}>Ve trang chu</button>
            <button className="btn btn-outline" onClick={() => navigate('profile')}>Xem don hang</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div style={{ background: 'var(--warm)', padding: '28px 0', marginBottom: 28 }}>
        <div className="container">
          <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 28 }}>Dat hang</div>
        </div>
      </div>
      <div className="container" style={{
        display: 'grid', gridTemplateColumns: '1fr 340px',
        gap: 28, alignItems: 'start'
      }}>
        <div>
          <div style={{ display: 'flex', gap: 0, marginBottom: 32 }}>
            {['Thong tin giao hang', 'Thanh toan'].map((s, i) => (
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
              <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 20 }}>Thong tin nguoi nhan</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div className="form-group">
                  <label>Ten nguoi nhan *</label>
                  <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nguyen Van A" />
                  {errors.name && <div style={{ color: 'var(--rose)', fontSize: 12, marginTop: 4 }}>{errors.name}</div>}
                </div>
                <div className="form-group">
                  <label>So dien thoai *</label>
                  <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="0901 234 567" />
                  {errors.phone && <div style={{ color: 'var(--rose)', fontSize: 12, marginTop: 4 }}>{errors.phone}</div>}
                </div>
              </div>
              <div className="form-group">
                <label>Dia chi giao hang *</label>
                <input value={form.address} onChange={e => set('address', e.target.value)}
                  placeholder="So nha, duong, phuong/xa, quan/huyen, tinh/thanh pho" />
                {errors.address && <div style={{ color: 'var(--rose)', fontSize: 12, marginTop: 4 }}>{errors.address}</div>}
              </div>
              <div className="form-group">
                <label>Ghi chu don hang</label>
                <textarea value={form.note} onChange={e => set('note', e.target.value)}
                  rows={3} placeholder="Vi du: giao gio hanh chinh..." />
              </div>
              <button className="btn btn-primary" style={{ padding: '12px 32px', fontSize: 15 }}
                onClick={() => { if (validate()) setStep(2); }}>
                Tiep tuc - Thanh toan
              </button>
            </div>
          )}

          {step === 2 && (
            <div style={{
              background: '#fff', borderRadius: 16,
              border: '1px solid var(--border)', padding: 28
            }}>
              <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 20 }}>Phuong thuc thanh toan</div>
              {[
                ['COD', 'Thanh toan khi nhan hang (COD)', 'Tra tien mat cho shipper khi nhan hang'],
                ['Transfer', 'Chuyen khoan ngan hang', 'Chuyen khoan truoc, xac nhan qua SMS']
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
                      <div style={{ fontWeight: 700, marginBottom: 4 }}>Thong tin tai khoan:</div>
                      <div>Ngan hang: Vietcombank</div>
                      <div>So TK: 1234 5678 9012</div>
                      <div>Chu TK: CONG TY MONG LAN FLOWER</div>
                      <div>Noi dung: Ten + SDT + Dat hoa</div>
                    </div>
                  )}
                </div>
              ))}
              <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                <button className="btn btn-ghost" onClick={() => setStep(1)}>Quay lai</button>
                <button className="btn btn-primary"
                  style={{ padding: '12px 32px', fontSize: 15 }}
                  onClick={placeOrder} disabled={loading}>
                  {loading ? 'Dang xu ly...' : 'Xac nhan dat hang'}
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
          <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 16 }}>Don hang cua ban</div>
          {cart.map(i => (
            <div key={i.id} style={{
              display: 'flex', gap: 10,
              alignItems: 'center', marginBottom: 12
            }}>
              <div style={{
                width: 40, height: 40, background: 'var(--warm)',
                borderRadius: 8, display: 'flex', alignItems: 'center',
                justifyContent: 'center', flexShrink: 0, fontSize: 18
              }}>
                {i.img && !i.img.startsWith('/') ? i.img : (i.name?.charAt(0) || 'H')}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>{i.name}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>x{i.qty}</div>
              </div>
              <span style={{ fontWeight: 700, fontSize: 14 }}>
                {fmt((i.salePrice || i.sale || i.price) * i.qty)}
              </span>
            </div>
          ))}
          <div className="divider" />
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            fontSize: 14, marginBottom: 8, color: 'var(--muted)'
          }}>
            <span>Tam tinh</span><span>{fmt(cartTotal)}</span>
          </div>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            fontSize: 14, marginBottom: 12, color: '#4a7c59'
          }}>
            <span>Phi giao</span>
            <span>{shipping === 0 ? 'Mien phi' : fmt(shipping)}</span>
          </div>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            fontSize: 18, fontWeight: 800, color: 'var(--rose)'
          }}>
            <span>Tong</span><span>{fmt(grandTotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
