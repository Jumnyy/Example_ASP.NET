// src/pages/home/CategoryMenu.jsx
import React, { useState, useEffect } from 'react';
import categoriesProductService from '../../services/categoriesProductService';

const CategoryMenu = ({ onCategorySelect, activeCategoryId }) => {
    // 1. Luôn luôn khởi tạo state là một mảng rỗng [] thay vì để trống
    const [categoryProducts, setCategoryProducts] = useState([]);

    useEffect(() => {
        // Sử dụng hàm getMenuCategories mới để lấy Id và Name nhanh nhất
        categoriesProductService.getMenuCategories()
            .then(response => {
                // 2. Kiểm tra kỹ lưỡng, nếu có dữ liệu dạng mảng thì mới set, không thì đưa về mảng rỗng
                if (response && response.data && Array.isArray(response.data)) {
                    setCategoryProducts(response.data);
                } else {
                    setCategoryProducts([]);
                }
            })
            .catch(error => {
                console.error("Lỗi lấy dữ liệu danh mục:", error);
                setCategoryProducts([]); // Gặp lỗi API thì đưa về mảng rỗng để không sập giao diện
            });
    }, []);

    return (
        <div className="category-menu-wrapper mb-5">
            <ul
                className="nav nav-pills justify-content-md-center flex-nowrap overflow-auto pb-3"
                style={{
                    whiteSpace: 'nowrap',
                    WebkitOverflowScrolling: 'touch',
                    scrollbarWidth: 'none'
                }}
            >
                {/* Nút: Tất cả */}
                <li className="nav-item me-3 mb-2">
                    <button
                        className={`nav-link rounded-pill px-4 py-2 font-weight-bold border ${activeCategoryId === null
                                ? 'active bg-dark border-dark text-white shadow-sm'
                                : 'bg-white text-secondary border-light'
                            }`}
                        onClick={() => onCategorySelect(null)}
                        style={{ transition: 'all 0.3s ease', fontWeight: 'bold' }}
                    >
                        Tất cả
                    </button>
                </li>

                {/* 3. PHÒNG VỆ CHẮC CHẮN: Chỉ map khi categoryProducts tồn tại và có độ dài */}
                {categoryProducts && categoryProducts.length > 0 && categoryProducts.map((item) => (
                    <li className="nav-item me-3 mb-2" key={item.id}>
                        <button
                            onClick={() => onCategorySelect(item.id)}
                            className={`nav-link rounded-pill px-4 py-2 font-weight-bold border ${activeCategoryId === item.id
                                    ? 'active bg-dark border-dark text-white shadow-sm'
                                    : 'bg-white text-secondary border-light'
                                }`}
                            style={{ transition: 'all 0.3s ease', fontWeight: 'bold' }}
                        >
                            {item.name}
                        </button>
                    </li>
                ))}
            </ul>

            <style>{`
                .category-menu-wrapper ul::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
};

export default CategoryMenu;