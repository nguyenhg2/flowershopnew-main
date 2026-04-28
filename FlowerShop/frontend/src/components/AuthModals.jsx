import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import authApi from '../api/authApi';

export function LoginModal() {
  const { setShowLogin, setShowRegister, setUser, showToast } = useContext(AppContext);
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setErr('');
    if (!email || !pass) { setErr('Vui long nhap email va mat khau'); return; }
    setLoading(true);
    try {
      const res = await authApi.login(email, pass);
      localStorage.setItem('flowershop_token', res.data.token);
      setUser(res.data.user);
      setShowLogin(false);
      showToast('Dang nhap thanh cong');
    } catch (error) {
      setErr(error.response?.data?.message || 'Email hoac mat khau khong dung');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={() => setShowLogin(false)}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 24, marginBottom: 4 }}>Dang nhap</div>
          <div style={{ color: 'var(--muted)', fontSize: 14 }}>Chao mung tro lai Mong Lan Flower</div>
        </div>
        {err && <div className="alert alert-error" style={{ marginBottom: 16 }}>{err}</div>}
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com" />
        </div>
        <div className="form-group">
          <label>Mat khau</label>
          <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="Mat khau"
            onKeyDown={e => e.key === 'Enter' && login()} />
        </div>
        <button className="btn btn-primary"
          style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: 16, marginTop: 8 }}
          onClick={login} disabled={loading}>
          {loading ? 'Dang xu ly...' : 'Dang nhap'}
        </button>
        <div style={{ textAlign: 'center', marginTop: 16, fontSize: 14, color: 'var(--muted)' }}>
          Chua co tai khoan?{' '}
          <span style={{ color: 'var(--rose)', cursor: 'pointer', fontWeight: 700 }}
            onClick={() => { setShowLogin(false); setShowRegister(true); }}>
            Dang ky ngay
          </span>
        </div>
      </div>
    </div>
  );
}

export function RegisterModal() {
  const { setShowRegister, setShowLogin, showToast } = useContext(AppContext);
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '', confirm: '' });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const register = async () => {
    setErr('');
    if (!form.fullName || !form.email || !form.phone || !form.password) {
      setErr('Vui long dien day du thong tin'); return;
    }
    if (form.password !== form.confirm) {
      setErr('Mat khau xac nhan khong khop'); return;
    }
    if (form.password.length < 6) {
      setErr('Mat khau phai co it nhat 6 ky tu'); return;
    }
    setLoading(true);
    try {
      await authApi.register({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        password: form.password
      });
      showToast('Dang ky thanh cong! Vui long dang nhap.');
      setShowRegister(false);
      setShowLogin(true);
    } catch (error) {
      setErr(error.response?.data?.message || 'Dang ky that bai');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={() => setShowRegister(false)}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 24, marginBottom: 4 }}>Tao tai khoan</div>
        </div>
        {err && <div className="alert alert-error" style={{ marginBottom: 16 }}>{err}</div>}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-group"><label>Ho ten *</label>
            <input value={form.fullName} onChange={e => set('fullName', e.target.value)} placeholder="Nguyen Van A" /></div>
          <div className="form-group"><label>So dien thoai *</label>
            <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="0901234567" /></div>
        </div>
        <div className="form-group"><label>Email *</label>
          <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@example.com" /></div>
        <div className="form-group"><label>Mat khau *</label>
          <input type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="Toi thieu 6 ky tu" /></div>
        <div className="form-group"><label>Xac nhan mat khau *</label>
          <input type="password" value={form.confirm} onChange={e => set('confirm', e.target.value)} placeholder="Nhap lai mat khau" /></div>
        <button className="btn btn-primary"
          style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: 16, marginTop: 4 }}
          onClick={register} disabled={loading}>
          {loading ? 'Dang xu ly...' : 'Dang ky'}
        </button>
        <div style={{ textAlign: 'center', marginTop: 16, fontSize: 14, color: 'var(--muted)' }}>
          Da co tai khoan?{' '}
          <span style={{ color: 'var(--rose)', cursor: 'pointer', fontWeight: 700 }}
            onClick={() => { setShowRegister(false); setShowLogin(true); }}>
            Dang nhap
          </span>
        </div>
      </div>
    </div>
  );
}
