import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

const fmt = (n) => {
  if (n === null || n === undefined) return '';
  return n.toLocaleString('vi-VN') + 'đ';
};

const placeholderColors = [
  'linear-gradient(135deg,#f8bbd0,#f48fb1)',
  'linear-gradient(135deg,#ce93d8,#ba68c8)',
  'linear-gradient(135deg,#ef9a9a,#e57373)',
  'linear-gradient(135deg,#ffcc80,#ffb74d)',
  'linear-gradient(135deg,#a5d6a7,#81c784)',
  'linear-gradient(135deg,#80cbc4,#4db6ac)',
];

export default function ProductCard({ p }) {
  const { navigate, addToCart } = useContext(AppContext);
  const [imgError, setImgError] = useState(false);

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
  const showImg = imgSrc && !imgError;
  const bgGradient = placeholderColors[(p.id || 0) % placeholderColors.length];

  return (
    <div
      onClick={() => navigate('product', { id: p.id })}
      style={{
        background: '#fff',
        borderRadius: 16,
        border: '1px solid var(--border)',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform .2s, box-shadow .2s',
        display: 'flex',
        flexDirection: 'column'
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
        position: 'relative',
        paddingTop: '100%',
        background: showImg ? 'var(--warm)' : bgGradient,
        overflow: 'hidden'
      }}>
        {showImg ? (
          <img
            src={imgSrc}
            alt={p.name}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            onError={() => setImgError(true)}
          />
        ) : (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          }}>
            <span style={{ fontSize: 48, marginBottom: 4 }}>
              {p.name?.charAt(0) || 'H'}
            </span>
            <span style={{ fontSize: 12, opacity: .8, padding: '0 12px', textAlign: 'center', lineHeight: 1.3 }}>
              {p.name}
            </span>
          </div>
        )}
        {displayPrice && (
          <span style={{
            position: 'absolute', top: 10, left: 10,
            background: 'var(--rose)', color: '#fff',
            padding: '3px 10px', borderRadius: 8,
            fontSize: 12, fontWeight: 700
          }}>
            -{Math.round((1 - displayPrice / originalPrice) * 100)}%
          </span>
        )}
        {p.isNew && (
          <span style={{
            position: 'absolute', top: 10, right: 10,
            background: '#4a7c59', color: '#fff',
            padding: '3px 10px', borderRadius: 8,
            fontSize: 12, fontWeight: 700
          }}>MỚI</span>
        )}
      </div>
      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{
          fontWeight: 700, fontSize: 14, marginBottom: 8,
          lineHeight: 1.4, minHeight: 40,
          overflow: 'hidden', textOverflow: 'ellipsis',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
        }}>
          {p.name}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ color: 'var(--rose)', fontWeight: 800, fontSize: 16 }}>
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
          <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 10 }}>
            Đã bán: {p.sold || p.soldCount || 0}
          </div>
        )}
        <button
          className="btn btn-primary"
          style={{ width: '100%', justifyContent: 'center', fontSize: 13, marginTop: 'auto' }}
          onClick={handleAdd}>
          Thêm vào giỏ
        </button>
      </div>
    </div>
  );
}
