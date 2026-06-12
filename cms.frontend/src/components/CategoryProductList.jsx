import React, { useState, useEffect } from 'react';
import categoryProductService from '../services/categoryProductService';

const CategoryProductList = () => {
    // 1. State luu tru danh sach danh muc san pham nhan tu API
    const [categoryProducts, setCategoryProducts] = useState([]);

    // 2. State quan ly trang thai hien thi waiting/loading
    const [loading, setLoading] = useState(true);

    // 3. Tu dong goi API m?t lan duy nhat sau khi component render
    useEffect(() => {
        const fetchCategoryProducts = async () => {
            try {
                setLoading(true);
                // Goi service thuc hien request HTTP GET den API
                const data = await categoryProductService.getAllCategoryProducts();

                // Cap nhat mang du lieu vao state
                setCategoryProducts(data || []);
            } catch (error) {
                console.error("Loi khi tai danh muc san pham:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryProducts();
    }, []);

    // 4. Giao dien tam thoi khi dang cho API phan hoi
    if (loading) {
        return <div className="text-center my-4 fst-italic text-muted">?ang t?i danh m?c s?n ph?m...</div>;
    }

    // 5. Render cau truc giao dien ra HTML chu?n UTF-8
    return (
        <div className="card shadow-sm border-0 rounded-lg">
            {/* Tieu de hop Danh muc */}
            <div className="card-header bg-white border-bottom-0 pt-4 pb-2 px-4">
                <h5 className="card-title text-uppercase fw-bold text-dark d-flex align-items-center mb-0" style={{ letterSpacing: '0.5px', fontSize: '1.1rem' }}>
                    <i className="bi bi-boxes text-success me-2" style={{ fontSize: '1.3rem' }}></i> Danh m?c s?n ph?m
                </h5>
            </div>

            {/* Danh sach cac hang danh muc */}
            <div className="card-body p-0">
                <div className="list-group list-group-flush">
                    {categoryProducts.length === 0 ? (
                        <div className="p-4 text-center text-muted fst-italic">Không có danh m?c nào hi?n d?ng.</div>
                    ) : (
                        categoryProducts.map((item) => (
                            <button
                                key={item.id} // item.id vi?t thuong theo format chuoi JSON tra ve
                                type="button"
                                className="list-group-item list-group-item-action d-flex justify-content-between align-items-center px-4 py-3 transition-all"
                                style={{ fontSize: '0.95rem', color: '#495057' }}
                            >
                                <span className="fw-normal">{item.name}</span>
                                <i className="bi bi-chevron-right text-muted" style={{ fontSize: '0.8rem', opacity: 0.5 }}></i>
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategoryProductList;