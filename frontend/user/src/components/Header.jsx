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
    <header style={{ background: '#fff', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '14px 0', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <div
              onClick={() => navigate('home')}
              style={{ cursor: 'pointer', fontFamily: 'Playfair Display,serif', fontSize: 26, fontWeight: 700, color: 'var(--rose)', whiteSpace: 'nowrap', letterSpacing: '-0.5px' }}>
              Mộng Lan
            </div>
            <nav className="hide-mobile" style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-ghost" style={{ fontSize: 14, fontWeight: 600 }}
                onClick={() => navigate('home')}>Trang chủ</button>
              <button className="btn btn-ghost" style={{ fontSize: 14, fontWeight: 600 }}
                onClick={() => navigate('category', { catId: null, catName: 'Tất cả sản phẩm' })}>
                Sản phẩm
              </button>
              <button className="btn btn-ghost" style={{ fontSize: 14, fontWeight: 600 }}
                onClick={() => navigate('contact')}>Liên hệ</button>
            </nav>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, justifyContent: 'flex-end' }}>
            <form onSubmit={doSearch} style={{ display: 'flex', gap: 0, maxWidth: 300, flex: 1 }}>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Tìm hoa..."
                style={{ borderRadius: '20px 0 0 20px', paddingRight: 8, background: 'var(--warm)', border: 'none', paddingLeft: 16 }} />
              <button type="submit" className="btn btn-primary" style={{ borderRadius: '0 20px 20px 0', padding: '8px 16px' }}>
                Tìm
              </button>
            </form>

            <div className="hide-mobile" style={{ width: 1, height: 24, background: 'var(--border)', margin: '0 4px' }}></div>

            <button className="btn btn-ghost" onClick={() => navigate('cart')} style={{ position: 'relative', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute', top: -4, right: -4, background: 'var(--rose)', color: '#fff',
                  borderRadius: '50%', width: 20, height: 20, fontSize: 11, fontWeight: 800,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff'
                }}>{cartCount}</span>
              )}
            </button>
            
            {user ? (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {isAdmin && (
                  <a href="/admin" target="_blank" rel="noopener noreferrer"
                    className="btn btn-outline hide-mobile" style={{ fontSize: 13, color: 'var(--rose)', borderColor: 'var(--rose)', padding: '6px 12px' }}>
                    Quản trị
                  </a>
                )}
                <button className="btn btn-ghost" onClick={() => navigate('profile')} style={{ fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  <span className="hide-mobile">{user.fullName ? user.fullName.split(' ').pop() : 'Tài khoản'}</span>
                </button>
                <button className="btn btn-ghost" style={{ fontSize: 14, padding: '8px', color: 'var(--muted)' }} onClick={handleLogout} title="Đăng xuất">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                </button>
              </div>
            ) : (
              <button className="btn btn-primary" onClick={() => setShowLogin(true)} style={{ whiteSpace: 'nowrap', padding: '8px 20px', borderRadius: 20 }}>Đăng nhập</button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
