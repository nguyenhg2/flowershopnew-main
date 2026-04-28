import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import productApi from '../api/productApi';
import categoryApi from '../api/categoryApi';

export function SearchPage() {
  const { pageParams } = useContext(AppContext);
  const q = pageParams.q || '';
  const [sort, setSort] = useState('newest');
  const [categoryId, setCategoryId] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    categoryApi.getAll().then(res => setCategories(res.data)).catch(() => { });
  }, []);

  useEffect(() => {
    setPage(1);
    fetchProducts(1);
  }, [q, sort, categoryId, minPrice, maxPrice]);

  const fetchProducts = (p) => {
    setLoading(true);
    const params = { keyword: q, sort, page: p, pageSize: 12 };
    if (categoryId) params.categoryId = categoryId;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;

    productApi.search(params)
      .then(res => {
        setProducts(res.data.items || []);
        setTotalCount(res.data.totalCount || 0);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  };

  const mapProduct = (p) => ({
    id: p.id, name: p.name, price: p.price, salePrice: p.salePrice,
    img: p.imageUrl, sold: p.soldCount, isNew: p.isNew
  });

  return (
    <div className="page">
      <div style={{ background: 'var(--warm)', padding: '28px 0', marginBottom: 28 }}>
        <div className="container">
          <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 24, marginBottom: 4 }}>
            Kết quả tìm kiếm: "{q}"
          </div>
          <div style={{ color: 'var(--muted)', fontSize: 14 }}>Tìm thấy {totalCount} sản phẩm</div>
        </div>
      </div>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 28, alignItems: 'start' }}>
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid var(--border)', padding: 20, position: 'sticky', top: 80 }}>
          <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 16 }}>Bộ lọc</div>
          <div style={{ marginBottom: 16 }}>
            <div className="form-group"><label>Danh mục</label></div>
            <select value={categoryId} onChange={e => setCategoryId(e.target.value)}
              style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid var(--border)' }}>
              <option value="">Tất cả</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div className="form-group"><label>Khoảng giá</label></div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input type="number" value={minPrice} onChange={e => setMinPrice(e.target.value)} placeholder="Từ" style={{ fontSize: 13 }} />
              <input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} placeholder="Đến" style={{ fontSize: 13 }} />
            </div>
          </div>
        </div>
        <div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            {[['newest', 'Mới nhất'], ['price_asc', 'Giá tăng'], ['price_desc', 'Giá giảm'], ['sold', 'Bán chạy']].map(([v, l]) => (
              <button key={v} onClick={() => setSort(v)} style={{
                background: sort === v ? 'var(--rose)' : 'var(--warm)',
                color: sort === v ? '#fff' : 'var(--muted)',
                padding: '6px 14px', border: 'none', borderRadius: 20, cursor: 'pointer', fontSize: 13, fontWeight: 600
              }}>{l}</button>
            ))}
          </div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 60 }}>Đang tải...</div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 60, color: 'var(--muted)' }}>Không tìm thấy sản phẩm phù hợp</div>
          ) : (
            <div className="grid-4">{products.map(p => <ProductCard key={p.id} p={mapProduct(p)} />)}</div>
          )}
        </div>
      </div>
    </div>
  );
}
