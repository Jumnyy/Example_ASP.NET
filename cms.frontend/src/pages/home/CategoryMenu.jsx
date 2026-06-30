import React, { useState, useEffect } from 'react';
import categoryProductService from '../../services/categoryProductService';

const CategoryMenu = ({ onCategorySelect, activeCategoryId }) => {
    const [categoryProducts, setCategoryProducts] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await categoryProductService.getAllCategoryProducts();
                let categoryList = [];
                let rawCategoryData = response.data || response;

                // Đồng bộ bọc kiểm tra $values phòng hờ API trả về định dạng JSON C# Object
                if (rawCategoryData && rawCategoryData.$values) {
                    categoryList = rawCategoryData.$values;
                } else if (Array.isArray(rawCategoryData)) {
                    categoryList = rawCategoryData;
                }

                setCategoryProducts(categoryList);
            } catch (error) {
                console.error("Lỗi khi fetch danh mục sản phẩm:", error);
            }
        };

        fetchCategories();
    }, []);

    return (
        <div className="category-menu-wrapper pt-5 mb-5" style={{ fontFamily: '"Courier New", Courier, Georgia, serif' }}>
            <ul
                className="nav nav-pills justify-content-md-center flex-nowrap overflow-auto pb-3"
                style={{
                    whiteSpace: 'nowrap',
                    WebkitOverflowScrolling: 'touch',
                    scrollbarWidth: 'none'
                }}
            >
                {/* Nút: Tất cả */}
                <li className="nav-item mr-3 mb-2">
                    <button
                        className="retro-btn"
                        style={{
                            backgroundColor: activeCategoryId === null ? '#2c5d63' : '#f4ebd0',
                            color: activeCategoryId === null ? '#fff' : '#433422',
                            boxShadow: activeCategoryId === null ? '2px 2px 0px #122326' : '3px 3px 0px #433422',
                            transform: activeCategoryId === null ? 'translate(1px, 1px)' : 'none'
                        }}
                        onClick={() => onCategorySelect(null)}
                    >
                        Tất cả
                    </button>
                </li>

                {/* Các nút: Danh mục sản phẩm */}
                {categoryProducts.map((item) => {
                    // Phòng ngự lỗi chữ Hoa / Thường từ endpoint API .NET
                    const itemId = item.id !== undefined ? item.id : item.Id;
                    const itemName = item.name !== undefined ? item.name : item.Name;

                    // Ép về string để so sánh thuộc tính active chính xác tuyệt đối
                    const isItemActive = activeCategoryId !== null && String(activeCategoryId) === String(itemId);

                    return (
                        <li className="nav-item mr-3 mb-2" key={itemId}>
                            <button
                                onClick={() => onCategorySelect(itemId)}
                                className="retro-btn"
                                style={{
                                    backgroundColor: isItemActive ? '#2c5d63' : '#f4ebd0',
                                    color: isItemActive ? '#fff' : '#433422',
                                    boxShadow: isItemActive ? '2px 2px 0px #122326' : '3px 3px 0px #433422',
                                    transform: isItemActive ? 'translate(1px, 1px)' : 'none'
                                }}
                            >
                                {itemName}
                            </button>
                        </li>
                    );
                })}
            </ul>

            <style jsx="true">{`
                .category-menu-wrapper ul::-webkit-scrollbar {
                    display: none;
                }
                .retro-btn {
                    padding: 10px 24px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    border: 2px solid #433422;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: all 0.2s ease-in-out;
                    font-size: 0.95rem;
                }
                .retro-btn:hover {
                    background-color: #ecdcb9 !important;
                    color: #433422 !important;
                }
            `}</style>
        </div>
    );
};

export default CategoryMenu;