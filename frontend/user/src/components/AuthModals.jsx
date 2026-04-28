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
    if (!email || !pass) { setErr('Vui lòng nhập email và mật khẩu'); return; }
    setLoading(true);
    try {
      const res = await authApi.login(email, pass);
      localStorage.setItem('flowershop_token', res.data.token);
      setUser(res.data.user);
      setShowLogin(false);
      showToast('Đăng nhập thành công');
    } catch (error) {
      setErr(error.response?.data?.message || 'Email hoặc mật khẩu không đúng');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={() => setShowLogin(false)}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 24, marginBottom: 4 }}>Đăng nhập</div>
          <div style={{ color: 'var(--muted)', fontSize: 14 }}>Chào mừng trở lại Mộng Lan Flower</div>
        </div>
        {err && <div className="alert alert-error" style={{ marginBottom: 16 }}>{err}</div>}
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com" />
        </div>
        <div className="form-group">
          <label>Mật khẩu</label>
          <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="Mật khẩu"
            onKeyDown={e => e.key === 'Enter' && login()} />
        </div>
        <button className="btn btn-primary"
          style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: 16, marginTop: 8 }}
          onClick={login} disabled={loading}>
          {loading ? 'Đang xử lý...' : 'Đăng nhập'}
        </button>
        <div style={{ textAlign: 'center', marginTop: 16, fontSize: 14, color: 'var(--muted)' }}>
          Chưa có tài khoản?{' '}
          <span style={{ color: 'var(--rose)', cursor: 'pointer', fontWeight: 700 }}
            onClick={() => { setShowLogin(false); setShowRegister(true); }}>
            Đăng ký ngay
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
      setErr('Vui lòng điền đầy đủ thông tin'); return;
    }
    if (form.password !== form.confirm) {
      setErr('Mật khẩu xác nhận không khớp'); return;
    }
    if (form.password.length < 6) {
      setErr('Mật khẩu phải có ít nhất 6 ký tự'); return;
    }
    setLoading(true);
    try {
      await authApi.register({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        password: form.password
      });
      showToast('Đăng ký thành công! Vui lòng đăng nhập.');
      setShowRegister(false);
      setShowLogin(true);
    } catch (error) {
      setErr(error.response?.data?.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={() => setShowRegister(false)}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 24, marginBottom: 4 }}>Tạo tài khoản</div>
        </div>
        {err && <div className="alert alert-error" style={{ marginBottom: 16 }}>{err}</div>}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-group"><label>Họ tên *</label>
            <input value={form.fullName} onChange={e => set('fullName', e.target.value)} placeholder="Nguyễn Văn A" /></div>
          <div className="form-group"><label>Số điện thoại *</label>
            <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="0901234567" /></div>
        </div>
        <div className="form-group"><label>Email *</label>
          <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@example.com" /></div>
        <div className="form-group"><label>Mật khẩu *</label>
          <input type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="Tối thiểu 6 ký tự" /></div>
        <div className="form-group"><label>Xác nhận mật khẩu *</label>
          <input type="password" value={form.confirm} onChange={e => set('confirm', e.target.value)} placeholder="Nhập lại mật khẩu" /></div>
        <button className="btn btn-primary"
          style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: 16, marginTop: 4 }}
          onClick={register} disabled={loading}>
          {loading ? 'Đang xử lý...' : 'Đăng ký'}
        </button>
        <div style={{ textAlign: 'center', marginTop: 16, fontSize: 14, color: 'var(--muted)' }}>
          Đã có tài khoản?{' '}
          <span style={{ color: 'var(--rose)', cursor: 'pointer', fontWeight: 700 }}
            onClick={() => { setShowRegister(false); setShowLogin(true); }}>
            Đăng nhập
          </span>
        </div>
      </div>
    </div>
  );
}
