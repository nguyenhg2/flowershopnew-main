import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { fmt } from '../components/fmt';

export default function CartPage() {
  const { cart, updateCart, cartTotal, navigate } = useContext(AppContext);

  if (cart.length === 0) {
    return (
      <div className="page" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Gio hang trong</div>
          <div style={{ color: 'var(--muted)', marginBottom: 24 }}>Them san pham vao gio de tiep tuc</div>
          <button className="btn btn-primary" onClick={() => navigate('home')}>Mua sam ngay</button>
        </div>
      </div>
    );
  }

  const shipping = cartTotal >= 500000 ? 0 : 30000;
  const grandTotal = cartTotal + shipping;

  return (
    <div className="page">
      <div style={{ background: 'var(--warm)', padding: '28px 0', marginBottom: 28 }}>
        <div className="container">
          <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 28 }}>
            Gio hang ({cart.length} san pham)
          </div>
        </div>
      </div>
      <div className="container" style={{
        display: 'grid', gridTemplateColumns: '1fr 340px',
        gap: 28, alignItems: 'start'
      }}>
        <div style={{
          background: '#fff', borderRadius: 16,
          border: '1px solid var(--border)', overflow: 'hidden'
        }}>
          <table>
            <thead>
              <tr>
                <th>San pham</th><th>Don gia</th>
                <th>So luong</th><th>Thanh tien</th><th></th>
              </tr>
            </thead>
            <tbody>
              {cart.map(item => {
                const price = item.salePrice || item.sale || item.price;
                return (
                  <tr key={item.id}>
                    <td>
                      <div style={{
                        display: 'flex', gap: 12, alignItems: 'center', cursor: 'pointer'
                      }} onClick={() => navigate('product', { id: item.id })}>
                        <div style={{
                          width: 48, height: 48, background: 'var(--warm)',
                          borderRadius: 8, display: 'flex', alignItems: 'center',
                          justifyContent: 'center', fontSize: 24, flexShrink: 0
                        }}>
                          {item.img && !item.img.startsWith('/') ? item.img : (item.name?.charAt(0) || 'H')}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 14 }}>{item.name}</div>
                          {item.salePrice && (
                            <span style={{
                              background: '#fde8ee', color: 'var(--rose)',
                              padding: '1px 6px', borderRadius: 4,
                              fontSize: 11, fontWeight: 600
                            }}>Giam gia</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td style={{ color: 'var(--rose)', fontWeight: 700 }}>{fmt(price)}</td>
                    <td>
                      <div className="qty-ctrl">
                        <button className="qty-btn" style={{ borderRadius: '8px 0 0 8px' }}
                          onClick={() => updateCart(item.id, item.qty - 1)}>-</button>
                        <input className="qty-num" value={item.qty}
                          onChange={e => updateCart(item.id, +e.target.value || 1)}
                          style={{ width: 44, textAlign: 'center' }} />
                        <button className="qty-btn" style={{ borderRadius: '0 8px 8px 0' }}
                          onClick={() => updateCart(item.id, item.qty + 1)}>+</button>
                      </div>
                    </td>
                    <td style={{ fontWeight: 800, fontSize: 15 }}>{fmt(price * item.qty)}</td>
                    <td>
                      <button
                        onClick={() => updateCart(item.id, 0)}
                        style={{
                          border: 'none', background: 'none',
                          cursor: 'pointer', color: 'var(--rose)',
                          fontSize: 18
                        }}>
                        X
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={{
          background: '#fff', borderRadius: 16,
          border: '1px solid var(--border)',
          padding: 24, position: 'sticky', top: 80
        }}>
          <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 20 }}>Tom tat don hang</div>
          {cart.map(i => (
            <div key={i.id} style={{
              display: 'flex', justifyContent: 'space-between',
              fontSize: 14, marginBottom: 8, color: 'var(--muted)'
            }}>
              <span>{i.name} x{i.qty}</span>
              <span style={{ fontWeight: 600, color: 'var(--text)' }}>
                {fmt((i.salePrice || i.sale || i.price) * i.qty)}
              </span>
            </div>
          ))}
          <div className="divider" />
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            marginBottom: 8, fontSize: 14, color: 'var(--muted)'
          }}>
            <span>Tam tinh</span><span>{fmt(cartTotal)}</span>
          </div>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            marginBottom: 16, fontSize: 14, color: '#4a7c59'
          }}>
            <span>Phi giao hang</span>
            <span style={{ fontWeight: 700 }}>{shipping === 0 ? 'Mien phi' : fmt(shipping)}</span>
          </div>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            fontSize: 18, fontWeight: 800, color: 'var(--rose)', marginBottom: 20
          }}>
            <span>Tong cong</span><span>{fmt(grandTotal)}</span>
          </div>
          {cartTotal < 500000 && (
            <div style={{
              background: '#e8f5e9', color: '#4a7c59',
              borderRadius: 10, padding: '10px 14px',
              fontSize: 13, marginBottom: 16
            }}>
              Mua them {fmt(500000 - cartTotal)} de duoc mien phi ship!
            </div>
          )}
          <button className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', fontSize: 16, padding: '14px' }}
            onClick={() => navigate('checkout')}>
            Dat hang
          </button>
          <button className="btn btn-ghost"
            style={{ width: '100%', justifyContent: 'center', marginTop: 10 }}
            onClick={() => navigate('home')}>
            Tiep tuc mua sam
          </button>
        </div>
      </div>
    </div>
  );
}
