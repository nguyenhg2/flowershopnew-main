import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import productApi from '../api/productApi';
import orderApi from '../api/orderApi';
import categoryApi from '../api/categoryApi';
import { fmt } from '../components/fmt';

export function AdminPage() {
  const { navigate, showToast, isAdmin } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchCategoryId, setSearchCategoryId] = useState('');
  const [searchMinPrice, setSearchMinPrice] = useState('');
  const [searchMaxPrice, setSearchMaxPrice] = useState('');
  const [searchSort, setSearchSort] = useState('newest');

  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '', code: '', price: '', salePrice: '', stock: '',
    categoryId: '', description: '', imageUrl: '', isNew: false
  });

  useEffect(() => {
    if (!isAdmin) {
      showToast('Ban khong co quyen truy cap');
      navigate('home');
      return;
    }
    loadDashboard();
  }, [isAdmin]);

  useEffect(() => {
    if (activeTab === 'products') {
      fetchProducts(1);
    } else if (activeTab === 'orders') {
      fetchOrders();
    } else if (activeTab === 'categories') {
      fetchCategories();
    }
  }, [activeTab, page]);

  const loadDashboard = async () => {
    try {
      const [prodRes, orderRes, catRes] = await Promise.all([
        productApi.search({ page: 1, pageSize: 1 }),
        orderApi.getAllOrders(),
        categoryApi.getAll()
      ]);
      setTotalCount(prodRes.data.totalCount || 0);
      setOrders(orderRes.data || []);
      setCategories(catRes.data || []);
    } catch (error) {
      showToast('Khong tai duoc du lieu');
    }
  };

  const fetchProducts = (p) => {
    setLoading(true);
    const params = {
      page: p,
      pageSize,
      sort: searchSort
    };
    if (searchKeyword) params.keyword = searchKeyword;
    if (searchCategoryId) params.categoryId = searchCategoryId;
    if (searchMinPrice) params.minPrice = searchMinPrice;
    if (searchMaxPrice) params.maxPrice = searchMaxPrice;

    productApi.search(params)
      .then(res => {
        setProducts(res.data.items || []);
        setTotalCount(res.data.totalCount || 0);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  };

  const fetchOrders = () => {
    setLoading(true);
    orderApi.getAllOrders()
      .then(res => setOrders(res.data || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  };

  const fetchCategories = () => {
    setLoading(true);
    categoryApi.getAll()
      .then(res => setCategories(res.data || []))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  };

  const handleSearch = () => {
    setPage(1);
    fetchProducts(1);
  };

  const openAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '', code: '', price: '', salePrice: '', stock: '',
      categoryId: categories[0]?.id || '', description: '', imageUrl: '', isNew: false
    });
    setShowProductModal(true);
  };

  const openEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name || '',
      code: product.code || '',
      price: product.price || '',
      salePrice: product.salePrice || '',
      stock: product.stock || '',
      categoryId: product.categoryId || '',
      description: product.description || '',
      imageUrl: product.imageUrl || '',
      isNew: product.isNew || false
    });
    setShowProductModal(true);
  };

  const saveProduct = async () => {
    if (!productForm.name || !productForm.price || !productForm.categoryId) {
      showToast('Vui long dien day du thong tin');
      return;
    }

    setLoading(true);
    try {
      const data = {
        ...productForm,
        price: parseFloat(productForm.price),
        salePrice: productForm.salePrice ? parseFloat(productForm.salePrice) : null,
        stock: parseInt(productForm.stock) || 0,
        categoryId: parseInt(productForm.categoryId)
      };

      if (editingProduct) {
        await productApi.update(editingProduct.id, data);
        showToast('Cap nhat san pham thanh cong');
      } else {
        await productApi.create(data);
        showToast('Them san pham thanh cong');
      }
      setShowProductModal(false);
      fetchProducts(page);
    } catch (error) {
      showToast(error.response?.data?.message || 'Luu that bai');
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm('Xac nhan xoa san pham?')) return;
    try {
      await productApi.remove(id);
      showToast('Da xoa san pham');
      fetchProducts(page);
    } catch (error) {
      showToast('Xoa that bai');
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await orderApi.updateStatus(orderId, status);
      showToast('Cap nhat trang thai don hang thanh cong');
      fetchOrders();
    } catch (error) {
      showToast('Cap nhat that bai');
    }
  };

  const statusMap = {
    Pending: 'Cho xu ly',
    Confirmed: 'Da xac nhan',
    Processing: 'Dang xu ly',
    Shipping: 'Dang van chuyen',
    Delivered: 'Da van chuyen',
    Completed: 'Hoan thanh',
    Cancelled: 'Da huy'
  };

  const statusColors = {
    Pending: '#fff3e0',
    Confirmed: '#e3f2fd',
    Processing: '#fff8e1',
    Shipping: '#e8f5e9',
    Delivered: '#c8e6c9',
    Completed: '#4a7c59',
    Cancelled: '#fde8ee'
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="page">
      <div style={{ background: 'var(--warm)', padding: '28px 0', marginBottom: 28 }}>
        <div className="container">
          <div style={{ fontFamily: 'Playfair Display,serif', fontSize: 28 }}>Quan tri he thong</div>
        </div>
      </div>

      <div className="container" style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 28, alignItems: 'start' }}>
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid var(--border)', padding: 20 }}>
          {[
            ['dashboard', 'Tong quan'],
            ['products', 'San pham'],
            ['orders', 'Don hang'],
            ['categories', 'Danh muc']
          ].map(([k, v]) => (
            <div key={k} onClick={() => setActiveTab(k)} style={{
              padding: '12px 16px', borderRadius: 8, cursor: 'pointer',
              marginBottom: 4, fontSize: 14,
              background: activeTab === k ? '#fde8ee' : '',
              color: activeTab === k ? 'var(--rose)' : 'var(--text)',
              fontWeight: activeTab === k ? 700 : 400
            }}>{v}</div>
          ))}
        </div>

        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid var(--border)', padding: 28 }}>
          {activeTab === 'dashboard' && (
            <div>
              <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 20 }}>Tong quan</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
                <div style={{ padding: 24, background: '#fde8ee', borderRadius: 12 }}>
                  <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 8 }}>Tong san pham</div>
                  <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--rose)' }}>{totalCount}</div>
                </div>
                <div style={{ padding: 24, background: '#e8f5e9', borderRadius: 12 }}>
                  <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 8 }}>Tong don hang</div>
                  <div style={{ fontSize: 32, fontWeight: 800, color: '#4a7c59' }}>{orders.length}</div>
                </div>
                <div style={{ padding: 24, background: '#e3f2fd', borderRadius: 12 }}>
                  <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 8 }}>Danh muc</div>
                  <div style={{ fontSize: 32, fontWeight: 800, color: '#1976d2' }}>{categories.length}</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div style={{ fontWeight: 800, fontSize: 18 }}>Quan ly san pham</div>
                <button className="btn btn-primary" onClick={openAddProduct}>+ Them moi</button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr) 100px', gap: 12, marginBottom: 16 }}>
                <input
                  value={searchKeyword}
                  onChange={e => setSearchKeyword(e.target.value)}
                  placeholder="Tu khoa"
                  style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)' }}
                />
                <select
                  value={searchCategoryId}
                  onChange={e => setSearchCategoryId(e.target.value)}
                  style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)' }}
                >
                  <option value="">Tat ca danh muc</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <input
                  type="number"
                  value={searchMinPrice}
                  onChange={e => setSearchMinPrice(e.target.value)}
                  placeholder="Gia tu"
                  style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)' }}
                />
                <input
                  type="number"
                  value={searchMaxPrice}
                  onChange={e => setSearchMaxPrice(e.target.value)}
                  placeholder="Gia den"
                  style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)' }}
                />
              </div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                <select
                  value={searchSort}
                  onChange={e => setSearchSort(e.target.value)}
                  style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)' }}
                >
                  <option value="newest">Moi nhat</option>
                  <option value="price_asc">Gia tang</option>
                  <option value="price_desc">Gia giam</option>
                  <option value="sold">Ban chay</option>
                </select>
                <button className="btn btn-primary" onClick={handleSearch}>Loc</button>
              </div>

              {loading ? (
                <div style={{ textAlign: 'center', padding: 40 }}>Dang tai...</div>
              ) : (
                <>
                  <table style={{ width: '100%', marginBottom: 16 }}>
                    <thead>
                      <tr>
                        <th>ID</th><th>Ten</th><th>Danh muc</th><th>Gia</th><th>Giam gia</th><th>Kho</th><th>Da ban</th><th>Hanh dong</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(p => (
                        <tr key={p.id}>
                          <td>{p.id}</td>
                          <td>{p.name}</td>
                          <td>{p.category?.name || '-'}</td>
                          <td>{fmt(p.price)}</td>
                          <td>{p.salePrice ? fmt(p.salePrice) : '-'}</td>
                          <td>{p.stock}</td>
                          <td>{p.soldCount}</td>
                          <td>
                            <button className="btn btn-ghost" style={{ fontSize: 12, padding: '4px 8px' }}
                              onClick={() => openEditProduct(p)}>Sua</button>
                            <button className="btn btn-ghost" style={{ fontSize: 12, padding: '4px 8px', color: 'red' }}
                              onClick={() => deleteProduct(p.id)}>Xoa</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
                    <button className="btn btn-ghost" disabled={page <= 1} onClick={() => { setPage(p => p - 1); fetchProducts(page - 1); }}>Truoc</button>
                    <span style={{ padding: '8px 16px' }}>Trang {page}/{totalPages || 1}</span>
                    <button className="btn btn-ghost" disabled={page >= totalPages} onClick={() => { setPage(p => p + 1); fetchProducts(page + 1); }}>Sau</button>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 20 }}>Quan ly don hang ({orders.length})</div>
              {loading ? (
                <div style={{ textAlign: 'center', padding: 40 }}>Dang tai...</div>
              ) : orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40, color: 'var(--muted)' }}>Khong co don hang</div>
              ) : (
                orders.map(order => (
                  <div key={order.id} style={{
                    border: '1px solid var(--border)', borderRadius: 12,
                    padding: 20, marginBottom: 16
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                      <div>
                        <span style={{ fontWeight: 700 }}>Don #{order.orderCode}</span>
                        <span style={{ fontSize: 13, color: 'var(--muted)', marginLeft: 12 }}>
                          {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                        <div style={{ fontSize: 13, color: 'var(--muted)' }}>
                          KH: {order.user?.fullName || 'Unknown'} | SDT: {order.receiverPhone}
                        </div>
                        <div style={{ fontSize: 13, color: 'var(--muted)' }}>Dia chi: {order.shippingAddress}</div>
                      </div>
                      <span style={{
                        padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                        background: statusColors[order.status] || '#f5f5f5',
                        color: order.status === 'Completed' ? '#fff' : 'var(--text)'
                      }}>
                        {statusMap[order.status] || order.status}
                      </span>
                    </div>

                    {order.orderDetails && order.orderDetails.map(od => (
                      <div key={od.id} style={{
                        display: 'flex', justifyContent: 'space-between',
                        fontSize: 14, padding: '4px 0', color: '#555'
                      }}>
                        <span>{od.product?.name || `SP #${od.productId}`} x{od.quantity}</span>
                        <span>{fmt(od.unitPrice * od.quantity)}</span>
                      </div>
                    ))}

                    <div style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)'
                    }}>
                      <span style={{ fontWeight: 800, color: 'var(--rose)' }}>
                        Tong: {fmt(order.totalAmount)}
                      </span>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {order.status === 'Pending' && (
                          <>
                            <button className="btn btn-outline" style={{ fontSize: 12 }}
                              onClick={() => updateOrderStatus(order.id, 'Confirmed')}>Xac nhan</button>
                            <button className="btn btn-ghost" style={{ fontSize: 12, color: 'red' }}
                              onClick={() => updateOrderStatus(order.id, 'Cancelled')}>Huy</button>
                          </>
                        )}
                        {order.status === 'Confirmed' && (
                          <button className="btn btn-outline" style={{ fontSize: 12 }}
                            onClick={() => updateOrderStatus(order.id, 'Processing')}>Bat dau xu ly</button>
                        )}
                        {order.status === 'Processing' && (
                          <button className="btn btn-outline" style={{ fontSize: 12 }}
                            onClick={() => updateOrderStatus(order.id, 'Shipping')}>Dang van chuyen</button>
                        )}
                        {order.status === 'Shipping' && (
                          <button className="btn btn-outline" style={{ fontSize: 12 }}
                            onClick={() => updateOrderStatus(order.id, 'Delivered')}>Da giao</button>
                        )}
                        {order.status === 'Delivered' && (
                          <button className="btn btn-outline" style={{ fontSize: 12 }}
                            onClick={() => updateOrderStatus(order.id, 'Completed')}>Hoan thanh</button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'categories' && (
            <div>
              <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 20 }}>Danh sach danh muc</div>
              {loading ? (
                <div style={{ textAlign: 'center', padding: 40 }}>Dang tai...</div>
              ) : (
                <table style={{ width: '100%' }}>
                  <thead>
                    <tr>
                      <th>ID</th><th>Ten danh muc</th><th>Mo ta</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map(c => (
                      <tr key={c.id}>
                        <td>{c.id}</td>
                        <td>{c.name}</td>
                        <td>{c.description || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>

      {showProductModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            background: '#fff', borderRadius: 16, padding: 28, width: '100%', maxWidth: 600,
            maxHeight: '90vh', overflow: 'auto'
          }}>
            <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 20 }}>
              {editingProduct ? 'Sua san pham' : 'Them san pham moi'}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div className="form-group">
                <label>Ten san pham *</label>
                <input value={productForm.name} onChange={e => setProductForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Ma san pham</label>
                <input value={productForm.code} onChange={e => setProductForm(f => ({ ...f, code: e.target.value }))} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div className="form-group">
                <label>Don gia *</label>
                <input type="number" value={productForm.price} onChange={e => setProductForm(f => ({ ...f, price: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Gia khuyen mai</label>
                <input type="number" value={productForm.salePrice} onChange={e => setProductForm(f => ({ ...f, salePrice: e.target.value }))} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div className="form-group">
                <label>So luong kho *</label>
                <input type="number" value={productForm.stock} onChange={e => setProductForm(f => ({ ...f, stock: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Danh muc *</label>
                <select value={productForm.categoryId} onChange={e => setProductForm(f => ({ ...f, categoryId: e.target.value }))}>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label>URL anh dai dien</label>
              <input value={productForm.imageUrl} onChange={e => setProductForm(f => ({ ...f, imageUrl: e.target.value }))} />
            </div>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label>Mo ta</label>
              <textarea value={productForm.description} onChange={e => setProductForm(f => ({ ...f, description: e.target.value }))} rows={3} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" checked={productForm.isNew} onChange={e => setProductForm(f => ({ ...f, isNew: e.target.checked }))} />
                <span>Son pham moi</span>
              </label>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost" onClick={() => setShowProductModal(false)}>Huy</button>
              <button className="btn btn-primary" onClick={saveProduct} disabled={loading}>
                {loading ? 'Dang luu...' : 'Luu'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
