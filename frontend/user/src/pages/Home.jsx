import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import productApi from '../api/productApi';
import bannerApi from '../api/bannerApi';
import categoryApi from '../api/categoryApi';

export default function HomePage() {
  const { navigate } = useContext(AppContext);
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [saleProducts, setSaleProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bannerIdx, setBannerIdx] = useState(0);

  useEffect(() => {
    bannerApi.getActive().then(res => setBanners(res.data)).catch(() => { });
    categoryApi.getAll().then(res => setCategories(res.data)).catch(() => { });
    productApi.getOnSale(4).then(res => setSaleProducts(res.data)).catch(() => { });
    productApi.getBestSellers(4).then(res => setBestSellers(res.data)).catch(() => { });
    productApi.getNewArrivals(4).then(res => setNewArrivals(res.data)).catch(() => { });
  }, []);

  useEffect(() => {
    if (banners.length === 0) return;
    const t = setInterval(() => {
      setBannerIdx(i => (i + 1) % banners.length);
    }, 4000);
    return () => clearInterval(t);
  }, [banners]);

  const currentBanner = banners[bannerIdx] || {};

  const mapProduct = (p) => ({
    id: p.id, name: p.name, price: p.price, salePrice: p.salePrice,
    img: p.imageUrl, sold: p.soldCount, isNew: p.isNew,
    category: p.category
  });

  return (
    <div className="page">
      {banners.length > 0 && (
        <div style={{
          background: currentBanner.backgroundCss, transition: 'background 1s',
          padding: '64px 0', textAlign: 'center', color: '#fff', marginBottom: 48
        }}>
          <div className="container">
            <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 42, fontWeight: 600, marginBottom: 12 }}>
              {currentBanner.title}
            </div>
            <div style={{ fontSize: 18, marginBottom: 28, opacity: .9 }}>{currentBanner.subtitle}</div>
            <button className="btn" style={{ background: '#fff', color: 'var(--rose)', padding: '12px 32px', fontSize: 16, borderRadius: 40 }}>
              {currentBanner.buttonText}
            </button>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
              {banners.map((_, i) => (
                <div key={i} onClick={() => setBannerIdx(i)} style={{
                  width: i === bannerIdx ? 28 : 10, height: 10, borderRadius: 5,
                  background: 'rgba(255,255,255,' + (i === bannerIdx ? 1 : .5) + ')',
                  cursor: 'pointer', transition: 'all .3s'
                }} />
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="container" style={{ marginBottom: 48 }}>
        <div className="section-title">Danh mục sản phẩm</div>
        <div className="section-sub">Tìm hoa phù hợp cho mọi dịp</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 16 }}>
          {categories.map(c => (
            <div key={c.id} onClick={() => navigate('category', { catId: c.id, catName: c.name })}
              style={{ background: '#f7f0f5', borderRadius: 16, padding: '20px 14px', textAlign: 'center', cursor: 'pointer', transition: 'transform .2s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform = ''}>
              <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{c.name}</div>
            </div>
          ))}
        </div>
      </div>

      {saleProducts.length > 0 && (
        <div className="container" style={{ marginBottom: 48 }}>
          <div className="section-title">Đang giảm giá</div>
          <div className="grid-4">{saleProducts.map(p => <ProductCard key={p.id} p={mapProduct(p)} />)}</div>
        </div>
      )}

      {bestSellers.length > 0 && (
        <div style={{ background: 'var(--warm)', padding: '48px 0' }}>
          <div className="container">
            <div className="section-title">Bán chạy nhất</div>
            <div className="grid-4">{bestSellers.map(p => <ProductCard key={p.id} p={mapProduct(p)} />)}</div>
          </div>
        </div>
      )}

      {newArrivals.length > 0 && (
        <div className="container" style={{ marginTop: 48 }}>
          <div className="section-title">Hoa mới về</div>
          <div className="grid-4">{newArrivals.map(p => <ProductCard key={p.id} p={mapProduct(p)} />)}</div>
        </div>
      )}
    </div>
  );
}
