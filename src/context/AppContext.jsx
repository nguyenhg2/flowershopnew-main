import { createContext, useState, useEffect } from 'react';
import authApi from '../api/authApi';

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [page, setPage] = useState('home');
  const [pageParams, setPageParams] = useState({});
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('flowershop_cart');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('flowershop_user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [orders, setOrders] = useState([]);
  const [toast, setToast] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('flowershop_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('flowershop_user');
      localStorage.removeItem('flowershop_token');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('flowershop_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const token = localStorage.getItem('flowershop_token');
    if (token && !user) {
      authApi.getMe()
        .then(res => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('flowershop_token');
          localStorage.removeItem('flowershop_user');
        });
    }
  }, []);

  const navigate = (p, params = {}) => {
    setPage(p);
    setPageParams(params);
    window.scrollTo(0, 0);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const addToCart = (product, qty = 1) => {
    setCart(c => {
      const ex = c.find(i => i.id === product.id);
      if (ex) return c.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i);
      return [...c, { ...product, qty }];
    });
    showToast('Da them vao gio hang');
  };

  const updateCart = (id, qty) => {
    if (qty <= 0) { setCart(c => c.filter(i => i.id !== id)); return; }
    setCart(c => c.map(i => i.id === id ? { ...i, qty } : i));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((s, i) => s + (i.salePrice || i.price) * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const isAdmin = user && user.role === 'Admin';

  return (
    <AppContext.Provider value={{
      page, navigate, pageParams,
      cart, cartCount, cartTotal, addToCart, updateCart, clearCart,
      user, setUser, isAdmin,
      orders, setOrders,
      showToast, showLogin, setShowLogin, showRegister, setShowRegister
    }}>
      {children}
      {toast && <div className="toast">{toast}</div>}
    </AppContext.Provider>
  );
}
