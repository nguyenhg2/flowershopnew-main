import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

export default function Header() {
  const { navigate, cartCount, user, setShowLogin, setUser, showToast, isAdmin } = useContext(AppContext);
  const [search, setSearch] = useState('');

  const doSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate('search', { q: search });
      setSearch('');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('flowershop_token');
    localStorage.removeItem('flowershop_user');
    showToast('Đã đăng xuất');
    navigate('home');
  };

  return (
    <header style={{ background: '#fff', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 100 }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 0' }}>
          <div
            onClick={() => navigate('home')}
            style={{ cursor: 'pointer', fontFamily: 'Playfair Display,serif', fontSize: 22, fontWeight: 600, color: 'var(--rose)', whiteSpace: 'nowrap' }}>
            Mộng Lan
          </div>
          <nav style={{ display: 'flex', gap: 4, flex: 1 }}>
            <button className="btn btn-ghost" style={{ fontSize: 13 }}
              onClick={() => navigate('contact')}>Liên hệ</button>
            <button className="btn btn-ghost" style={{ fontSize: 13 }}
              onClick={() => navigate('category', { catId: null, catName: 'Tất cả sản phẩm' })}>
              Tất cả sản phẩm
            </button>
          </nav>
          <form onSubmit={doSearch} style={{ display: 'flex', gap: 0, maxWidth: 240 }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Tìm hoa..."
              style={{ borderRadius: '20px 0 0 20px', paddingRight: 8 }} />
            <button type="submit" className="btn btn-primary" style={{ borderRadius: '0 20px 20px 0', padding: '8px 14px' }}>
              Tìm
            </button>
          </form>
          <button className="btn btn-ghost" onClick={() => navigate('cart')} style={{ position: 'relative', padding: '8px 12px' }}>
            Giỏ hàng
            {cartCount > 0 && (
              <span style={{
                position: 'absolute', top: 0, right: 0, background: 'var(--rose)', color: '#fff',
                borderRadius: '50%', width: 18, height: 18, fontSize: 10, fontWeight: 800,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>{cartCount}</span>
            )}
          </button>
          {user ? (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {isAdmin && (
                <a href="/admin" target="_blank" rel="noopener noreferrer"
                  className="btn btn-ghost" style={{ fontSize: 13, color: 'var(--rose)' }}>
                  Quản trị
                </a>
              )}
              <button className="btn btn-ghost" onClick={() => navigate('profile')} style={{ fontSize: 13 }}>
                {user.fullName ? user.fullName.split(' ').pop() : 'Tài khoản'}
              </button>
              <button className="btn btn-ghost" style={{ fontSize: 13 }} onClick={handleLogout}>Đăng xuất</button>
            </div>
          ) : (
            <button className="btn btn-outline" onClick={() => setShowLogin(true)} style={{ whiteSpace: 'nowrap' }}>Đăng nhập</button>
          )}
        </div>
      </div>
    </header>
  );
}
