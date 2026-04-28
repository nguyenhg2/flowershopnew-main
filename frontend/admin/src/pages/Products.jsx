import React, { useState, useEffect } from 'react';
import { productApi, categoryApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const fmt = (n) => n != null ? n.toLocaleString('vi-VN') + 'd' : '';

const Products = () => {
    const { isAdmin } = useAuth();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(1);
    const pageSize = 10;

    const [keyword, setKeyword] = useState('');
    const [filterCat, setFilterCat] = useState('');
    const [sort, setSort] = useState('newest');

    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({
        name: '', code: '', price: '', salePrice: '', stock: '',
        categoryId: '', description: '', imageUrl: '', isNew: false
    });
    const [formError, setFormError] = useState('');

    useEffect(() => {
        categoryApi.getAll().then(res => setCategories(res.data || [])).catch(() => { });
    }, []);

    useEffect(() => { fetchProducts(); }, [page]);

    const fetchProducts = (p = page) => {
        setLoading(true);
        const params = { page: p, pageSize, sort };
        if (keyword) params.keyword = keyword;
        if (filterCat) params.categoryId = filterCat;
        productApi.getAll(params)
            .then(res => {
                setProducts(res.data.items || []);
                setTotalCount(res.data.totalCount || 0);
            })
            .catch(() => setProducts([]))
            .finally(() => setLoading(false));
    };

    const handleSearch = () => { setPage(1); fetchProducts(1); };

    const openAdd = () => {
        setEditing(null);
        setForm({ name: '', code: '', price: '', salePrice: '', stock: '', categoryId: categories[0]?.id || '', description: '', imageUrl: '', isNew: false });
        setFormError('');
        setShowModal(true);
    };

    const openEdit = (p) => {
        setEditing(p);
        setForm({
            name: p.name || '', code: p.code || '', price: p.price || '', salePrice: p.salePrice || '',
            stock: p.stock || '', categoryId: p.categoryId || '', description: p.description || '',
            imageUrl: p.imageUrl || '', isNew: p.isNew || false
        });
        setFormError('');
        setShowModal(true);
    };

    const saveProduct = async () => {
        if (!form.name || !form.price || !form.categoryId) {
            setFormError('Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
        }
        setLoading(true);
        try {
            const data = {
                ...form,
                price: parseFloat(form.price),
                salePrice: form.salePrice ? parseFloat(form.salePrice) : null,
                stock: parseInt(form.stock) || 0,
                categoryId: parseInt(form.categoryId)
            };
            if (editing) {
                await productApi.update(editing.id, data);
            } else {
                await productApi.create(data);
            }
            setShowModal(false);
            fetchProducts();
        } catch (err) {
            setFormError(err.response?.data?.message || 'Lưu thất bại');
        } finally {
            setLoading(false);
        }
    };

    const deleteProduct = async (id) => {
        if (!window.confirm('Xác nhận xóa sản phẩm này?')) return;
        try {
            await productApi.remove(id);
            fetchProducts();
        } catch { /* bo qua */ }
    };

    const totalPages = Math.ceil(totalCount / pageSize);

    return (
        <div>
            <div className="content-header d-flex justify-content-between align-items-center">
                <h1>Quản lý sản phẩm</h1>
                {isAdmin && <button className="btn btn-primary" onClick={openAdd}><i className="fas fa-plus mr-1"></i> Thêm mới</button>}
            </div>

            <div className="card">
                <div className="card-header">
                    <div className="row">
                        <div className="col-md-4">
                            <div className="input-group">
                                <input className="form-control" value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="Tìm kiếm sản phẩm..." />
                                <div className="input-group-append">
                                    <button className="btn btn-primary" onClick={handleSearch}>Tìm</button>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <select className="form-control" value={filterCat} onChange={e => { setFilterCat(e.target.value); }}>
                                <option value="">Tất cả danh mục</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className="col-md-2">
                            <select className="form-control" value={sort} onChange={e => setSort(e.target.value)}>
                                <option value="newest">Mới nhất</option>
                                <option value="price_asc">Giá tăng</option>
                                <option value="price_desc">Giá giảm</option>
                                <option value="sold">Bán chạy</option>
                            </select>
                        </div>
                        <div className="col-md-1">
                            <button className="btn btn-outline-secondary btn-block" onClick={handleSearch}>Lọc</button>
                        </div>
                    </div>
                </div>
                <div className="card-body table-responsive p-0">
                    {loading ? (
                        <div className="text-center p-4"><div className="spinner-border text-primary"></div></div>
                    ) : (
                        <table className="table table-hover text-nowrap">
                            <thead>
                                <tr>
                                    <th>ID</th><th>Ảnh</th><th>Tên sản phẩm</th><th>Danh mục</th>
                                    <th>Giá</th><th>Giảm giá</th><th>Kho</th><th>Đã bán</th>
                                    {isAdmin && <th>Hành động</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(p => (
                                    <tr key={p.id}>
                                        <td>{p.id}</td>
                                        <td>
                                            {p.imageUrl && (p.imageUrl.startsWith('http') || p.imageUrl.startsWith('/')) ? (
                                                <img src={p.imageUrl} alt={p.name} style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }} />
                                            ) : (
                                                <span style={{ display: 'inline-block', width: 50, height: 50, background: '#f0f0f0', borderRadius: 4, textAlign: 'center', lineHeight: '50px' }}>
                                                    {p.name?.charAt(0) || 'H'}
                                                </span>
                                            )}
                                        </td>
                                        <td>{p.name}</td>
                                        <td>{p.category?.name || '-'}</td>
                                        <td>{fmt(p.price)}</td>
                                        <td>{p.salePrice ? fmt(p.salePrice) : '-'}</td>
                                        <td>{p.stock}</td>
                                        <td>{p.soldCount}</td>
                                        {isAdmin && (
                                            <td>
                                                <button className="btn btn-sm btn-info mr-1" onClick={() => openEdit(p)}>
                                                    <i className="fas fa-edit"></i> Sửa
                                                </button>
                                                <button className="btn btn-sm btn-danger" onClick={() => deleteProduct(p.id)}>
                                                    <i className="fas fa-trash"></i> Xóa
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
                {totalPages > 1 && (
                    <div className="card-footer d-flex justify-content-between align-items-center">
                        <span>Tổng: {totalCount} sản phẩm</span>
                        <div>
                            <button className="btn btn-sm btn-outline-secondary mr-1" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Trước</button>
                            <span className="mx-2">Trang {page}/{totalPages}</span>
                            <button className="btn btn-sm btn-outline-secondary ml-1" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Sau</button>
                        </div>
                    </div>
                )}
            </div>

            {showModal && (
                <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{editing ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h5>
                                <button type="button" className="close" onClick={() => setShowModal(false)}><span>&times;</span></button>
                            </div>
                            <div className="modal-body">
                                {formError && <div className="alert alert-danger">{formError}</div>}
                                <div className="row">
                                    <div className="col-md-6 form-group">
                                        <label>Tên sản phẩm *</label>
                                        <input className="form-control" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                                    </div>
                                    <div className="col-md-6 form-group">
                                        <label>Mã sản phẩm</label>
                                        <input className="form-control" value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 form-group">
                                        <label>Đơn giá *</label>
                                        <input type="number" className="form-control" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
                                    </div>
                                    <div className="col-md-6 form-group">
                                        <label>Giá khuyến mãi</label>
                                        <input type="number" className="form-control" value={form.salePrice} onChange={e => setForm(f => ({ ...f, salePrice: e.target.value }))} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 form-group">
                                        <label>Số lượng kho *</label>
                                        <input type="number" className="form-control" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} />
                                    </div>
                                    <div className="col-md-6 form-group">
                                        <label>Danh mục *</label>
                                        <select className="form-control" value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}>
                                            <option value="">Chọn danh mục</option>
                                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>URL ảnh đại diện</label>
                                    <input className="form-control" value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} placeholder="https://..." />
                                    {form.imageUrl && form.imageUrl.startsWith('http') && (
                                        <img src={form.imageUrl} alt="Xem trước" style={{ maxHeight: 120, marginTop: 8, borderRadius: 4 }} />
                                    )}
                                </div>
                                <div className="form-group">
                                    <label>Mô tả</label>
                                    <textarea className="form-control" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                                </div>
                                <div className="form-check">
                                    <input type="checkbox" className="form-check-input" id="isNew" checked={form.isNew} onChange={e => setForm(f => ({ ...f, isNew: e.target.checked }))} />
                                    <label className="form-check-label" htmlFor="isNew">Sản phẩm mới</label>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-default" onClick={() => setShowModal(false)}>Hủy</button>
                                <button className="btn btn-primary" onClick={saveProduct} disabled={loading}>
                                    {loading ? 'Đang lưu...' : 'Lưu'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products;
