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
      alert('Gửi thất bại, vui lòng thử lại');
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
          <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Cảm ơn bạn!</div>
          <div style={{ color: 'var(--muted)' }}>
            Chúng tôi đã nhận được tin nhắn và sẽ phản hồi trong thời gian sớm nhất.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div style={{ background: 'var(--warm)', padding: '28px 0', marginBottom: 28 }}>
        <div className="container">
          <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 28 }}>Liên hệ</div>
        </div>
      </div>
      <div className="container" style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: 40, maxWidth: 900, margin: '0 auto'
      }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 16 }}>Thông tin cửa hàng</div>
          <div style={{ lineHeight: 2, fontSize: 15, color: '#555' }}>
            <div>Mộng Lan Flower</div>
            <div>123 Nguyễn Huệ, Quận 1, TP.HCM</div>
            <div>Hotline: 0901 234 567</div>
            <div>Email: info@monglanflower.vn</div>
            <div>Giờ làm việc: 7:00 - 21:00 mỗi ngày</div>
          </div>
        </div>
        <div style={{
          background: '#fff', borderRadius: 16,
          border: '1px solid var(--border)', padding: 28
        }}>
          <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 16 }}>Gửi liên hệ</div>
          <div className="form-group">
            <label>Họ tên *</label>
            <input value={form.fullName} onChange={e => set('fullName', e.target.value)} placeholder="Nguyễn Văn A" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label>Email *</label>
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@example.com" />
            </div>
            <div className="form-group">
              <label>Số điện thoại</label>
              <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="0901234567" />
            </div>
          </div>
          <div className="form-group">
            <label>Nội dung *</label>
            <textarea value={form.message} onChange={e => set('message', e.target.value)}
              rows={4} placeholder="Nội dung cần liên hệ..." />
          </div>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Đang gửi...' : 'Gửi liên hệ'}
          </button>
        </div>
      </div>
    </div>
  );
}
