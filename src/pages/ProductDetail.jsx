import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { fmt } from '../components/fmt';
import Stars from '../components/Stars';
import ProductCard from '../components/ProductCard';
import productApi from '../api/productApi';
import reviewApi from '../api/reviewApi';

export function ProductDetailPage() {
  const { pageParams, navigate, addToCart, user, showToast } = useContext(AppContext);
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [related, setRelated] = useState([]);
  const [qty, setQty] = useState(1);
  const [reviewStars, setReviewStars] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [loading, setLoading] = useState(true);

  const productId = pageParams.id;

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    setQty(1);

    productApi.getById(productId)
      .then(res => {
        setProduct(res.data);
        if (res.data.categoryId) {
          productApi.search({ categoryId: res.data.categoryId, pageSize: 5 })
            .then(r => {
              setRelated((r.data.items || []).filter(p => p.id !== productId));
            })
            .catch(() => { });
        }
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));

    reviewApi.getByProduct(productId)
      .then(res => setReviews(res.data))
      .catch(() => setReviews([]));
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      salePrice: product.salePrice,
      img: product.imageUrl
    }, qty);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('cart');
  };

  const handleSubmitReview = async () => {
    if (!user) {
      showToast('Vui lòng đăng nhập để đánh giá');
      return;
    }
    if (!reviewComment.trim()) {
      showToast('Vui lòng nhập nội dung đánh giá');
      return;
    }
    try {
      await reviewApi.create({
        productId: productId,
        stars: reviewStars,
        comment: reviewComment
      });
      setReviewComment('');
      setReviewStars(5);
      const res = await reviewApi.getByProduct(productId);
      setReviews(res.data);
      showToast('Đã gửi đánh giá');
    } catch {
      showToast('Gửi đánh giá thất bại');
    }
  };

  if (loading) {
    return (
      <div className="page" style={{ textAlign: 'center', padding: 80 }}>
        Đang tải...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page" style={{ textAlign: 'center', padding: 80 }}>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Không tìm thấy sản phẩm</div>
        <button className="btn btn-primary" onClick={() => navigate('home')}>Về trang chủ</button>
      </div>
    );
  }

  const displayPrice = product.salePrice || product.price;
  const avgStars = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.stars, 0) / reviews.length).toFixed(1)
    : 0;
  const imgSrc = product.imageUrl || '';

  const mapProduct = (p) => ({
    id: p.id, name: p.name, price: p.price,
    salePrice: p.salePrice, img: p.imageUrl,
    sold: p.soldCount, isNew: p.isNew
  });

  return (
    <div className="page">
      <div style={{ background: 'var(--warm)', padding: '16px 0', marginBottom: 28 }}>
        <div className="container" style={{ fontSize: 13, color: 'var(--muted)' }}>
          <span style={{ cursor: 'pointer' }} onClick={() => navigate('home')}>Trang chủ</span>
          {' > '}
          {product.category && (
            <>
              <span style={{ cursor: 'pointer' }}
                onClick={() => navigate('category', { catId: product.categoryId, catName: product.category.name })}>
                {product.category.name}
              </span>
              {' > '}
            </>
          )}
          {product.name}
        </div>
      </div>

      <div className="container">
        <div style={{
          display: 'grid', gridTemplateColumns: '400px 1fr',
          gap: 40, marginBottom: 48, alignItems: 'start'
        }}>
          <div style={{
            background: 'var(--warm)', borderRadius: 16,
            height: 400, display: 'flex', alignItems: 'center',
            justifyContent: 'center', overflow: 'hidden'
          }}>
            {imgSrc && (imgSrc.startsWith('http') || imgSrc.startsWith('/')) ? (
              <img src={imgSrc} alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { e.target.style.display = 'none'; }} />
            ) : (
              <span style={{ fontSize: 120, color: '#c84b6b' }}>{product.name?.charAt(0) || 'H'}</span>
            )}
          </div>

          <div>
            <div style={{
              fontFamily: 'Playfair Display,serif',
              fontSize: 28, fontWeight: 600, marginBottom: 8
            }}>
              {product.name}
            </div>

            {product.code && (
              <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 8 }}>
                Mã SP: {product.code}
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <Stars count={Math.round(avgStars)} size={16} />
              <span style={{ fontSize: 14, color: 'var(--muted)' }}>
                {avgStars} ({reviews.length} đánh giá)
              </span>
              <span style={{ fontSize: 14, color: 'var(--muted)' }}>
                Đã bán: {product.soldCount}
              </span>
            </div>

            <div style={{
              display: 'flex', alignItems: 'center', gap: 16,
              marginBottom: 20, padding: '16px 20px',
              background: '#fef0f3', borderRadius: 12
            }}>
              <span style={{ fontSize: 28, fontWeight: 800, color: 'var(--rose)' }}>
                {fmt(displayPrice)}
              </span>
              {product.salePrice && (
                <>
                  <span style={{ textDecoration: 'line-through', color: 'var(--muted)', fontSize: 18 }}>
                    {fmt(product.price)}
                  </span>
                  <span style={{
                    background: 'var(--rose)', color: '#fff',
                    padding: '2px 10px', borderRadius: 8,
                    fontSize: 13, fontWeight: 700
                  }}>
                    -{Math.round((1 - product.salePrice / product.price) * 100)}%
                  </span>
                </>
              )}
            </div>

            <div style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 24, color: '#555' }}>
              {product.description}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>Số lượng:</span>
              <div className="qty-ctrl">
                <button className="qty-btn" style={{ borderRadius: '8px 0 0 8px' }}
                  onClick={() => setQty(q => Math.max(1, q - 1))}>-</button>
                <input className="qty-num" value={qty}
                  onChange={e => setQty(Math.max(1, +e.target.value || 1))}
                  style={{ width: 50, textAlign: 'center' }} />
                <button className="qty-btn" style={{ borderRadius: '0 8px 8px 0' }}
                  onClick={() => setQty(q => q + 1)}>+</button>
              </div>
              <span style={{ fontSize: 13, color: 'var(--muted)' }}>
                Còn {product.stock} sản phẩm
              </span>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-primary" style={{ padding: '14px 32px', fontSize: 16 }}
                onClick={handleAddToCart}>
                Thêm vào giỏ
              </button>
              <button className="btn btn-outline" style={{ padding: '14px 32px', fontSize: 16 }}
                onClick={handleBuyNow}>
                Mua ngay
              </button>
            </div>
          </div>
        </div>

        <div style={{
          background: '#fff', borderRadius: 16,
          border: '1px solid var(--border)',
          padding: 28, marginBottom: 48
        }}>
          <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 22, marginBottom: 20 }}>
            Đánh giá sản phẩm ({reviews.length})
          </div>

          {user && (
            <div style={{
              border: '1px solid var(--border)', borderRadius: 12,
              padding: 20, marginBottom: 24
            }}>
              <div style={{ fontWeight: 700, marginBottom: 12 }}>Viết đánh giá của bạn</div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center' }}>
                <span style={{ fontSize: 14 }}>Chấm điểm:</span>
                {[1, 2, 3, 4, 5].map(s => (
                  <span key={s}
                    onClick={() => setReviewStars(s)}
                    style={{
                      cursor: 'pointer', fontSize: 22,
                      color: s <= reviewStars ? '#f5a623' : '#ddd'
                    }}>
                    {s <= reviewStars ? '\u2605' : '\u2606'}
                  </span>
                ))}
              </div>
              <textarea
                value={reviewComment}
                onChange={e => setReviewComment(e.target.value)}
                placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
                rows={3}
                style={{ width: '100%', marginBottom: 12 }} />
              <button className="btn btn-primary" onClick={handleSubmitReview}>
                Gửi đánh giá
              </button>
            </div>
          )}

          {reviews.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 32, color: 'var(--muted)' }}>
              Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá sản phẩm này!
            </div>
          ) : (
            reviews.map(r => (
              <div key={r.id} style={{
                borderBottom: '1px solid var(--border)',
                padding: '16px 0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: 'var(--rose)', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: 14
                  }}>
                    {(r.userName || 'K').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{r.userName || 'Khách hàng'}</div>
                    <Stars count={r.stars} size={12} />
                  </div>
                  <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--muted)' }}>
                    {new Date(r.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                <div style={{ fontSize: 14, color: '#555', paddingLeft: 48 }}>{r.comment}</div>
              </div>
            ))
          )}
        </div>

        {related.length > 0 && (
          <div style={{ marginBottom: 48 }}>
            <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 22, marginBottom: 20 }}>
              Sản phẩm liên quan
            </div>
            <div className="grid-4">
              {related.map(p => <ProductCard key={p.id} p={mapProduct(p)} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
