import { useState } from 'react';
import axiosClient from '../api/axiosClient';

export function ContactPage() {
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.fullName || !form.email || !form.message) return;
    setLoading(true);
    try {
      await axiosClient.post('/api/contacts', form);
      setSent(true);
    } catch {
      alert('Gui that bai, vui long thu lai');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="page" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Cam on ban!</div>
          <div style={{ color: 'var(--muted)' }}>
            Chung toi da nhan duoc tin nhan va se phan hoi trong thoi gian som nhat.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div style={{ background: 'var(--warm)', padding: '28px 0', marginBottom: 28 }}>
        <div className="container">
          <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 28 }}>Lien he</div>
        </div>
      </div>
      <div className="container" style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: 40, maxWidth: 900, margin: '0 auto'
      }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 16 }}>Thong tin cua hang</div>
          <div style={{ lineHeight: 2, fontSize: 15, color: '#555' }}>
            <div>Mong Lan Flower</div>
            <div>123 Nguyen Hue, Quan 1, TP.HCM</div>
            <div>Hotline: 0901 234 567</div>
            <div>Email: info@monglanflower.vn</div>
            <div>Gio lam viec: 7:00 - 21:00 moi ngay</div>
          </div>
        </div>
        <div style={{
          background: '#fff', borderRadius: 16,
          border: '1px solid var(--border)', padding: 28
        }}>
          <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 16 }}>Gui lien he</div>
          <div className="form-group">
            <label>Ho ten *</label>
            <input value={form.fullName} onChange={e => set('fullName', e.target.value)} placeholder="Nguyen Van A" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label>Email *</label>
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@example.com" />
            </div>
            <div className="form-group">
              <label>So dien thoai</label>
              <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="0901234567" />
            </div>
          </div>
          <div className="form-group">
            <label>Noi dung *</label>
            <textarea value={form.message} onChange={e => set('message', e.target.value)}
              rows={4} placeholder="Noi dung can lien he..." />
          </div>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Dang gui...' : 'Gui lien he'}
          </button>
        </div>
      </div>
    </div>
  );
}
