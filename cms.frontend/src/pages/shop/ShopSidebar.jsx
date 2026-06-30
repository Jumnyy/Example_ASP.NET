/*import React, { useState, useEffect } from 'react';
import categoryProductService from '../../services/categoryProductService';

export default function ShopSidebar({ selectedCategory, setSelectedCategory, priceRange, setPriceRange }) {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await categoryProductService.getAllCategoryProducts();
                const data = response.data || response;

                if (Array.isArray(data)) {
                    setCategories(data);
                }
            } catch (error) {
                console.error("Lỗi khi fetch danh mục tại Sidebar:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return (
        <div className="text-[#433422]" style={{ fontFamily: '"Courier New", Courier, Georgia, serif' }}>

            {*//* Góc Phân Loại *//*}
            <div className="mb-8">
                <h3 className="font-black text-base mb-4 uppercase tracking-widest pb-2 border-b-2 border-[#433422]">
                    🗂️ Góc Phân Loại
                </h3>

                {loading ? (
                    <p className="text-xs italic opacity-70 animate-pulse">Đang lật sổ xem danh mục...</p>
                ) : (
                    <div className="flex flex-col gap-3.5">
                        {*//* Nút mặc định: Tất cả *//*}
                        <button
                            className="retro-sidebar-btn"
                            style={{
                                backgroundColor: selectedCategory === null ? '#2c5d63' : '#f4ebd0',
                                color: selectedCategory === null ? '#ffffff' : '#433422',
                                boxShadow: selectedCategory === null ? '2px 2px 0px #122326' : '4px 4px 0px #433422',
                                transform: selectedCategory === null ? 'translate(2px, 2px)' : 'none',
                                borderColor: '#433422'
                            }}
                            onClick={() => setSelectedCategory(null)}
                        >
                            Tất cả tuyển chọn
                        </button>

                        {*//* Danh sách nút động từ DB *//*}
                        {categories.map((cat) => {
                            const catId = cat.id ?? cat.Id;
                            const catName = cat.name ?? cat.Name;
                            const isSelected = String(selectedCategory) === String(catId);

                            return (
                                <button
                                    key={catId}
                                    className="retro-sidebar-btn"
                                    style={{
                                        backgroundColor: isSelected ? '#2c5d63' : '#f4ebd0',
                                        color: isSelected ? '#ffffff' : '#433422',
                                        boxShadow: isSelected ? '2px 2px 0px #122326' : '4px 4px 0px #433422',
                                        transform: isSelected ? 'translate(2px, 2px)' : 'none',
                                        borderColor: '#433422'
                                    }}
                                    onClick={() => setSelectedCategory(catId)}
                                >
                                    {catName}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {*//* Túi Tiền Ghé Chơi *//*}
            <div>
                <h3 className="font-black text-base mb-4 uppercase tracking-widest pb-2 border-b-2 border-[#433422]">
                    💰 Túi Tiền Ghé Chơi
                </h3>

                <div className="bg-[#fbf9f4] p-3 border-2 border-[#433422] rounded shadow-[2px_2px_0px_#433422] mb-2">
                    <input
                        type="range"
                        min="50000"
                        max="2000000"
                        step="50000"
                        value={priceRange}
                        onChange={(e) => setPriceRange(Number(e.target.value))}
                        className="w-full cursor-pointer custom-range"
                    />
                </div>

                <div className="flex justify-between text-[11px] font-black uppercase tracking-wider mt-1 px-1">
                    <span>50k</span>
                    <span className="text-[#a64b3d] bg-[#a64b3d]/10 px-2 py-0.5 rounded border border-[#a64b3d]/20 text-xs">
                        Dưới {priceRange.toLocaleString('vi-VN')}đ
                    </span>
                    <span>2 Triệu</span>
                </div>
            </div>

            {*//* Cấu trúc nút bẹt khối CSS cứng cáp *//*}
            <style jsx="true">{`
                .retro-sidebar-btn {
                    width: 100%;
                    text-align: left;
                    padding: 12px 16px;
                    font-weight: 900;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    border: 2px solid #433422;
                    border-radius: 2px;
                    cursor: pointer;
                    transition: background-color 0.1s ease, transform 0.1s ease, box-shadow 0.1s ease;
                    font-size: 0.8rem;
                }

                .retro-sidebar-btn:hover {
                    background-color: #2c5d63 !important;
                    color: #ffffff !important;
                    box-shadow: 2px 2px 0px #122326 !important;
                    transform: translate(2px, 2px);
                }

                /* Tinh chỉnh thanh kéo slider vintage *//*
                .custom-range {
                    -webkit-appearance: none;
                    appearance: none;
                    height: 6px;
                    background: #eadeca;
                    outline: none;
                    border: 1px solid #433422;
                }
                .custom-range::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 16px;
                    height: 16px;
                    background: #2c5d63;
                    border: 2px solid #433422;
                    cursor: pointer;
                    border-radius: 0px;
                }
                .custom-range::-moz-range-thumb {
                    width: 16px;
                    height: 16px;
                    background: #2c5d63;
                    border: 2px solid #433422;
                    cursor: pointer;
                    border-radius: 0px;
                }
            `}</style>
        </div>
    );
}*/