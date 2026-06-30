import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import productService from '../../services/productService';
import categoryProductService from '../../services/categoryProductService';

const ShopPage = () => {
    const navigate = useNavigate();

    // State lưu dữ liệu gốc
    const [allProducts, setAllProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // State dùng cho Bộ lọc (Đồng bộ nút Tất cả mặc định là null)
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [priceRange, setPriceRange] = useState({ min: 0, max: 100000000 });

    const BACKEND_URL = "https://localhost:7119";
    const defaultImage = "https://dummyimage.com/600x600/8b7d6b/fff.png&text=Cổ+Điển";

    const vintageStyles = {
        pageBg: { backgroundColor: '#fcf8f2', minHeight: '100vh', color: '#4a3b32', fontFamily: '"Georgia", serif' },
        card: { backgroundColor: '#fffcf7', border: '2px solid #5d4037', boxShadow: '4px 4px 0px #5d4037', borderRadius: '0px' },
        sidebarCard: { backgroundColor: '#f5efe6', border: '2px dashed #8d6e63', borderRadius: '0px' },
        input: { backgroundColor: '#ffffff', color: '#4a3b32', border: '1px solid #8d6e63', borderRadius: '0px' },
        btnActive: { backgroundColor: '#5d4037', color: '#fffcf7', border: '1px solid #5d4037', borderRadius: '0px', fontWeight: 'bold' },
        btnNormal: { backgroundColor: 'transparent', color: '#5d4037', border: '1px solid #8d6e63', borderRadius: '0px' },
        btnReset: { backgroundColor: 'transparent', color: '#b71c1c', border: '2px solid #b71c1c', borderRadius: '0px', fontWeight: 'bold' },
        btnDetail: { backgroundColor: '#8d6e63', color: '#fff', border: 'none', borderRadius: '0px', boxShadow: '2px 2px 0px #4a3b32' }
    };

    // CALL API SONG SONG
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [productRes, categoryRes] = await Promise.all([
                    productService.getAllProducts(),
                    categoryProductService.getAllCategoryProducts()
                ]);

                // --- XỬ LÝ DỮ LIỆU SẢN PHẨM ---
                let productList = [];
                let rawProductData = productRes.data || productRes;
                if (rawProductData && rawProductData.$values) productList = rawProductData.$values;
                else if (Array.isArray(rawProductData)) productList = rawProductData;

                setAllProducts(productList);
                setFilteredProducts(productList);

                // --- XỬ LÝ DỮ LIỆU DANH MỤC ---
                let categoryList = [];
                let rawCategoryData = categoryRes.data || categoryRes;
                if (rawCategoryData && rawCategoryData.$values) categoryList = rawCategoryData.$values;
                else if (Array.isArray(rawCategoryData)) categoryList = rawCategoryData;

                setCategories(categoryList);
            } catch (error) {
                console.error("Lỗi tải dữ liệu cửa hàng:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // LOGIC LỌC SẢN PHẨM PHÒNG THỦ LỖI KHÔNG ĐỒNG BỘ
    useEffect(() => {
        let result = allProducts;

        // 1. Lọc theo tên
        if (searchTerm.trim() !== '') {
            result = result.filter(p => {
                const pName = p.name || p.Name || '';
                return pName.toLowerCase().includes(searchTerm.toLowerCase());
            });
        }

        // 2. Lọc theo danh mục (So sánh an toàn với null và ép kiểu String)
        if (selectedCategory !== null) {
            result = result.filter(p => {
                const pCategoryId = p.categoryId !== undefined ? p.categoryId : p.CategoryId;
                return pCategoryId !== undefined && String(pCategoryId) === String(selectedCategory);
            });
        }

        // 3. Lọc theo khoảng giá
        result = result.filter(p => {
            const pPrice = p.price !== undefined ? p.price : (p.Price || 0);
            return pPrice >= priceRange.min && pPrice <= priceRange.max;
        });

        setFilteredProducts(result);
    }, [searchTerm, selectedCategory, priceRange, allProducts]);

    if (loading) return <div className="container mt-5 pt-5 text-center h4" style={{ color: '#5d4037', fontFamily: 'serif' }}>Blazing... 🕰️ Đang lật mở sổ kho hàng...</div>;

    return (
        <div style={vintageStyles.pageBg}>
            <div className="container pt-5 pb-5">
                <h2 className="font-weight-bold mb-4 text-center text-uppercase" style={{ color: '#4a3b32', letterSpacing: '3px', borderBottom: '3px double #4a3b32', paddingBottom: '15px' }}>
                    <i className="fa-solid fa-camera mr-2"></i> Tạp Hóa Công Nghệ Cổ Điển
                </h2>

                <div className="row mt-4">
                    {/* SIDEBAR BỘ LỌC */}
                    <div className="col-lg-3 mb-4">
                        <div className="p-4 sticky-top" style={{ ...vintageStyles.sidebarCard, top: '90px' }}>
                            <h5 className="font-weight-bold mb-4 text-center" style={{ color: '#4a3b32', borderBottom: '1px solid #8d6e63', paddingBottom: '10px', letterSpacing: '1px' }}>
                                <i className="fa-solid fa-sliders mr-2"></i> SỔ SÀNG LỌC
                            </h5>

                            {/* Tìm theo tên */}
                            <div className="mb-4">
                                <label className="small font-weight-bold" style={{ color: '#5d4037' }}>TÌM THEO TÊN</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    style={vintageStyles.input}
                                    placeholder="Tìm thiết bị cổ..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {/* Danh mục phân loại phong cách đồng bộ */}
                            <div className="mb-4">
                                <label className="small font-weight-bold mb-2" style={{ color: '#5d4037' }}>DANH MỤC PHÂN LOẠI</label>
                                <div className="d-flex flex-column gap-2">
                                    <button
                                        className="btn btn-sm text-left mb-2"
                                        style={selectedCategory === null ? vintageStyles.btnActive : vintageStyles.btnNormal}
                                        onClick={() => setSelectedCategory(null)}
                                    >
                                        📜 Tất cả thiết bị
                                    </button>

                                    {categories.map(cat => {
                                        const catId = cat.id !== undefined ? cat.id : cat.Id;
                                        const catName = cat.name !== undefined ? cat.name : cat.Name;

                                        return (
                                            <button
                                                key={catId}
                                                className="btn btn-sm text-left mb-2"
                                                style={selectedCategory !== null && String(selectedCategory) === String(catId) ? vintageStyles.btnActive : vintageStyles.btnNormal}
                                                onClick={() => setSelectedCategory(catId)}
                                            >
                                                📁 {catName}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Lọc theo giá */}
                            <div className="mb-4">
                                <label className="small font-weight-bold" style={{ color: '#5d4037' }}>MỨC GIÁ (đ)</label>
                                <div className="d-flex align-items-center mb-2">
                                    <input
                                        type="number"
                                        className="form-control form-control-sm mr-2"
                                        style={vintageStyles.input}
                                        placeholder="Từ..."
                                        value={priceRange.min}
                                        onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) || 0 })}
                                    />
                                    <span style={{ color: '#8d6e63' }}>-</span>
                                    <input
                                        type="number"
                                        className="form-control form-control-sm ml-2"
                                        style={vintageStyles.input}
                                        placeholder="Đến..."
                                        value={priceRange.max === 100000000 ? '' : priceRange.max}
                                        onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) || 100000000 })}
                                    />
                                </div>
                            </div>

                            <button
                                className="btn btn-sm w-100 mt-2"
                                style={vintageStyles.btnReset}
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedCategory(null);
                                    setPriceRange({ min: 0, max: 100000000 });
                                }}
                            >
                                <i className="fa-solid fa-arrow-rotate-left mr-1"></i> Thiết lập lại từ đầu
                            </button>
                        </div>
                    </div>

                    {/* LƯỚI SẢN PHẨM */}
                    <div className="col-lg-9">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <span style={{ fontStyle: 'italic', color: '#7d6652' }}>
                                Tìm thấy <strong style={{ color: '#4a3b32' }}>{filteredProducts.length}</strong> cổ vật phù hợp
                            </span>
                        </div>

                        {filteredProducts.length === 0 ? (
                            <div className="p-5 text-center" style={vintageStyles.card}>
                                <i className="fa-solid fa-box-open fa-3x mb-3" style={{ color: '#8d6e63' }}></i>
                                <h5 style={{ fontWeight: 'bold' }}>Kho lưu trữ trống rỗng!</h5>
                                <p style={{ fontStyle: 'italic' }}>Không tìm thấy sản phẩm nào khớp với bộ lọc trên.</p>
                            </div>
                        ) : (
                            <div className="row">
                                {filteredProducts.map(item => {
                                    const itemId = item.id !== undefined ? item.id : item.Id;
                                    const itemName = item.name !== undefined ? item.name : item.Name;
                                    const itemPrice = item.price !== undefined ? item.price : (item.Price || 0);
                                    const itemStock = item.stockQuantity !== undefined ? item.stockQuantity : (item.StockQuantity || 0);
                                    const itemCatName = item.categoryName || item.CategoryName || 'Chưa rõ';
                                    const itemImg = item.imageUrl || item.ImageUrl;

                                    const finalImg = itemImg && itemImg.startsWith('http')
                                        ? itemImg
                                        : (itemImg ? `${BACKEND_URL}${itemImg}` : defaultImage);

                                    return (
                                        <div className="col-md-4 col-sm-6 mb-4" key={itemId}>
                                            <div className="h-100 p-0 overflow-hidden d-flex flex-column" style={vintageStyles.card}>
                                                <div style={{ height: '200px', overflow: 'hidden', position: 'relative', borderBottom: '2px solid #5d4037' }}>
                                                    <span className="position-absolute" style={{
                                                        top: '10px', right: '10px', zIndex: 1,
                                                        backgroundColor: itemStock > 0 ? '#4caf50' : '#d32f2f',
                                                        color: '#fff', padding: '3px 8px', fontSize: '0.75rem', fontWeight: 'bold', border: '1px solid #fff'
                                                    }}>
                                                        {itemStock > 0 ? 'SẴN HÀNG' : 'HẾT HÀNG'}
                                                    </span>
                                                    <img src={finalImg} alt={itemName} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'sepia(10%) contrast(95%)' }} />
                                                </div>

                                                <div className="p-3 d-flex flex-column flex-grow-1">
                                                    <span className="mb-2 align-self-start small" style={{ color: '#8d6e63', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                                        🏷️ {itemCatName}
                                                    </span>
                                                    <h6 className="font-weight-bold text-truncate" title={itemName} style={{ color: '#4a3b32', fontFamily: 'serif', fontSize: '1.05rem' }}>
                                                        {itemName}
                                                    </h6>
                                                    <div className="mt-auto pt-3 d-flex justify-content-between align-items-center" style={{ borderTop: '1px dashed #8d6e63' }}>
                                                        <span className="font-weight-bold" style={{ fontSize: '1.15rem', color: '#b71c1c', fontFamily: 'monospace' }}>
                                                            {new Intl.NumberFormat('vi-VN').format(itemPrice)}đ
                                                        </span>
                                                        <button
                                                            className="btn btn-sm"
                                                            style={vintageStyles.btnDetail}
                                                            onClick={() => navigate(`/product/${itemId}`)}
                                                        >
                                                            Xem sản phẩm
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShopPage;