import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import productApi from '../api/productApi';
import categoryApi from '../api/categoryApi';

export function CategoryPage() {
  const { pageParams, navigate } = useContext(AppContext);
  const [sort, setSort] = useState('newest');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const PER_PAGE = 12;

  const catId = pageParams.catId || null;
  const catName = pageParams.catName || 'Tất cả sản phẩm';

  useEffect(() => {
    categoryApi.getAll().then(res => setCategories(res.data)).catch(() => { });
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [catId, sort, priceMin, priceMax]);

  useEffect(() => {
    fetchProducts();
  }, [catId, sort, priceMin, priceMax, currentPage]);

  const fetchProducts = () => {
    setLoading(true);
    const params = { page: currentPage, pageSize: PER_PAGE, sort: sort };
    if (catId) params.categoryId = catId;
    if (priceMin) params.minPrice = priceMin;
    if (priceMax) params.maxPrice = priceMax;

    productApi.search(params)
      .then(res => {
        setProducts(res.data.items || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalCount(res.data.totalCount || 0);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  };

  const mapProduct = (p) => ({
    id: p.id, name: p.name, price: p.price,
    salePrice: p.salePrice, img: p.imageUrl,
    sold: p.soldCount, isNew: p.isNew
  });

  return (
    <div className="page">
      <div style={{ background: 'var(--warm)', padding: '28px 0', marginBottom: 28 }}>
        <div className="container">
          <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('home')}>Trang chủ</span>
            {' > '}{catName}
          </div>
          <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 28 }}>{catName}</div>
          <div style={{ fontSize: 14, color: 'var(--muted)', marginTop: 4 }}>{totalCount} sản phẩm</div>
        </div>
      </div>
      <div className="container" style={{
        display: 'grid', gridTemplateColumns: '240px 1fr',
        gap: 28, alignItems: 'start'
      }}>
        <div style={{
          background: '#fff', borderRadius: 16,
          border: '1px solid var(--border)',
          padding: 20, position: 'sticky', top: 80
        }}>
          <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 16 }}>Bộ lọc</div>
          <div style={{ marginBottom: 20 }}>
            <div className="form-group"><label>Khoảng giá</label></div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input type="number" value={priceMin}
                onChange={e => setPriceMin(e.target.value)}
                placeholder="Từ" style={{ fontSize: 13 }} />
              <input type="number" value={priceMax}
                onChange={e => setPriceMax(e.target.value)}
                placeholder="Đến" style={{ fontSize: 13 }} />
            </div>
          </div>
          <div>
            <div className="form-group"><label>Danh mục</label></div>
            <div
              onClick={() => navigate('category', { catId: null, catName: 'Tất cả sản phẩm' })}
              style={{
                padding: '8px 12px', borderRadius: 8, cursor: 'pointer',
                fontSize: 14, marginBottom: 2,
                background: !catId ? '#fde8ee' : '',
                color: !catId ? 'var(--rose)' : 'var(--text)',
                fontWeight: !catId ? 700 : 400
              }}>
              Tất cả
            </div>
            {categories.map(c => (
              <div key={c.id}
                onClick={() => navigate('category', { catId: c.id, catName: c.name })}
                style={{
                  padding: '8px 12px', borderRadius: 8, cursor: 'pointer',
                  fontSize: 14, marginBottom: 2,
                  background: catId === c.id ? '#fde8ee' : '',
                  color: catId === c.id ? 'var(--rose)' : 'var(--text)',
                  fontWeight: catId === c.id ? 700 : 400
                }}>
                {c.name}
              </div>
            ))}
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, color: 'var(--muted)' }}>Sắp xếp:</span>
            {[
              ['newest', 'Mới nhất'],
              ['price_asc', 'Giá tăng'],
              ['price_desc', 'Giá giảm'],
              ['sold', 'Bán chạy']
            ].map(([v, l]) => (
              <button key={v}
                onClick={() => { setSort(v); setCurrentPage(1); }}
                style={{
                  background: sort === v ? 'var(--rose)' : 'var(--warm)',
                  color: sort === v ? '#fff' : 'var(--muted)',
                  padding: '6px 14px', border: 'none', borderRadius: 20,
                  cursor: 'pointer', fontSize: 13, fontWeight: 600,
                  transition: 'all .2s'
                }}>
                {l}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: 60, color: 'var(--muted)' }}>Đang tải...</div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 60, color: 'var(--muted)' }}>
              Không tìm thấy sản phẩm phù hợp
            </div>
          ) : (
            <div className="grid-4">
              {products.map(p => <ProductCard key={p.id} p={mapProduct(p)} />)}
            </div>
          )}

          {totalPages > 1 && (
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i}
                  className={`page-btn${currentPage === i + 1 ? ' active' : ''}`}
                  onClick={() => setCurrentPage(i + 1)}>
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
