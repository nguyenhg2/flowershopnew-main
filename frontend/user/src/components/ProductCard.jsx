import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const fmt = (n) => {
  if (n === null || n === undefined) return '';
  return n.toLocaleString('vi-VN') + 'd';
};

export default function ProductCard({ p }) {
  const { navigate, addToCart } = useContext(AppContext);

  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart({
      id: p.id,
      name: p.name,
      price: p.price,
      salePrice: p.salePrice || p.sale || null,
      img: p.img || p.imageUrl || ''
    });
  };

  const displayPrice = p.salePrice || p.sale || null;
  const originalPrice = p.price;
  const imgSrc = p.img || p.imageUrl || '';

  return (
    <div
      onClick={() => navigate('product', { id: p.id })}
      style={{
        background: '#fff',
        borderRadius: 16,
        border: '1px solid var(--border)',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform .2s, box-shadow .2s'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,.08)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = '';
      }}>
      <div style={{
        background: 'var(--warm)',
        height: 180,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {imgSrc ? (
          <img src={imgSrc} alt={p.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => { e.target.style.display = 'none'; }} />
        ) : (
          <span style={{ fontSize: 64, color: '#c84b6b' }}>{p.name?.charAt(0) || 'H'}</span>
        )}
        {displayPrice && (
          <span style={{
            position: 'absolute', top: 8, left: 8,
            background: 'var(--rose)', color: '#fff',
            padding: '2px 8px', borderRadius: 8,
            fontSize: 11, fontWeight: 700
          }}>
            -{Math.round((1 - displayPrice / originalPrice) * 100)}%
          </span>
        )}
        {p.isNew && (
          <span style={{
            position: 'absolute', top: 8, right: 8,
            background: '#4a7c59', color: '#fff',
            padding: '2px 8px', borderRadius: 8,
            fontSize: 11, fontWeight: 700
          }}>MỚI</span>
        )}
      </div>
      <div style={{ padding: '14px 16px' }}>
        <div style={{
          fontWeight: 700, fontSize: 14, marginBottom: 6,
          lineHeight: 1.3, minHeight: 36,
          overflow: 'hidden', textOverflow: 'ellipsis',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
        }}>
          {p.name}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ color: 'var(--rose)', fontWeight: 800, fontSize: 15 }}>
            {fmt(displayPrice || originalPrice)}
          </span>
          {displayPrice && (
            <span style={{
              textDecoration: 'line-through',
              color: 'var(--muted)', fontSize: 12
            }}>
              {fmt(originalPrice)}
            </span>
          )}
        </div>
        {(p.sold !== undefined || p.soldCount !== undefined) && (
          <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8 }}>
            Đã bán: {p.sold || p.soldCount || 0}
          </div>
        )}
        <button
          className="btn btn-primary"
          style={{ width: '100%', justifyContent: 'center', fontSize: 13 }}
          onClick={handleAdd}>
          Thêm vào giỏ
        </button>
      </div>
    </div>
  );
}
