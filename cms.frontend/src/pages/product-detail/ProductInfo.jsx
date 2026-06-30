// src/pages/product-detail/ProductInfo.jsx
import React from 'react';
import { useCart } from '../../context/CartContext';
import Swal from 'sweetalert2';

const ProductInfo = ({ product }) => {
    const { addToCart } = useCart();

    if (!product) return null;

    // Bóc tách thuộc tính linh hoạt chữ HOA / chữ thường từ API gốc
    const id = product.id ?? product.Id;
    const name = product.name ?? product.Name ?? 'Sản phẩm tiệm Solisz';
    const currentPrice = product.price ?? product.Price ?? 0;
    const oldPrice = product.oldPrice ?? product.OldPrice ?? null;
    const description = product.description ?? product.Description ?? 'Món đồ tuyển chọn độc bản chưa được cập nhật lời tự sự...';
    const imageUrl = product.imageUrl ?? product.ImageUrl;

    // === ĐỒNG BỘ TUYỆT ĐỐI VỚI BACKEND VÀ PRODUCTCARD ===
    const stock = product.stockQuantity ?? product.StockQuantity ?? product.stock ?? product.Stock ?? product.quantity ?? product.Quantity ?? product.soLuong ?? product.SoLuong ?? 0;
    const categoryName = product.categoryProduct?.name ?? product.CategoryProduct?.Name ?? 'Đồ tuyển chọn';

    // Nếu số lượng tồn kho vật lý trong DB <= 0 -> Khóa ngay lập tức
    const isOutOfStock = Number(stock) <= 0;

    // Xử lý đường dẫn ảnh tuyệt đối/tương đối an toàn
    const getProductImageUrl = () => {
        if (!imageUrl) return "https://placehold.co/500/eadeca/7a685c?text=Solisz+Vintage";
        if (imageUrl.startsWith('http')) return imageUrl;

        let cleanPath = imageUrl;
        if (cleanPath.startsWith('/api')) {
            cleanPath = cleanPath.replace('/api', '');
        }
        const safePath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
        return `https://localhost:7119${safePath}`;
    };

    // Tính toán phần trăm giảm giá giống ProductCard
    const discountPercent = (oldPrice && Number(oldPrice) > Number(currentPrice))
        ? Math.round((1 - Number(currentPrice) / Number(oldPrice)) * 100)
        : null;

    // Hàm xử lý khi khách bấm nút "GÓI MÓN NÀY MANG VỀ" ở trang chi tiết
    const handleAddToCartClick = () => {
        if (isOutOfStock) {
            Swal.fire({
                icon: 'error',
                title: 'Hết hàng mất rồi!',
                text: 'Món đồ này hiện tại tiệm đã hết sẵn trong kho.',
                background: '#eadeca',
                color: '#7a685c',
                confirmButtonColor: '#a64b3d'
            });
            return;
        }

        // 💡 ĐỒNG BỘ HÓA KEY GIỎ HÀNG: Check xem có user đang đăng nhập không để lấy đúng Key như Header
        let cartKey = 'myCart_Guest';
        const localCustomer = localStorage.getItem('customer');
        if (localCustomer) {
            const parsedUser = JSON.parse(localCustomer);
            const userId = parsedUser.id || parsedUser.customerId;
            if (userId) {
                cartKey = `myCart_${userId}`;
            }
        }

        const quantityToAdd = 1;
        let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

        // Tìm sản phẩm đã có sẵn trong giỏ hàng dựa trên id nhận từ DB
        const existingItem = cart.find(item => item.productId === id);
        const currentStock = Number(stock);

        if (existingItem) {
            // Bước chặn số 2: Nếu tổng số lượng định mua vượt quá stockQuantity của DB
            if (existingItem.quantity + quantityToAdd > currentStock) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Không thể mua thêm!',
                    text: `Giỏ hàng của bạn đã có ${existingItem.quantity} cái. Kho của tiệm chỉ còn đúng ${currentStock} cái thôi nè!`,
                    background: '#eadeca',
                    color: '#7a685c',
                    confirmButtonColor: '#a64b3d'
                });
                return;
            }
            existingItem.quantity += quantityToAdd;
        } else {
            // Thêm sản phẩm mới với cấu trúc chuẩn
            cart.push({
                productId: id,
                productName: name,
                price: currentPrice,
                imageUrl: imageUrl,
                quantity: quantityToAdd,
                stockQuantity: currentStock
            });
        }

        // Lưu vào đúng giỏ hàng cụ thể (Guest hoặc User)
        localStorage.setItem(cartKey, JSON.stringify(cart));

        if (addToCart) {
            addToCart(product);
        }

        // Hiện Toast thông báo góc màn hình ngọt ngào chuẩn Vintage giống y hệt Card
        Swal.fire({
            icon: 'success',
            title: 'Đã bỏ vào giỏ hàng!',
            text: `Bạn vừa thêm thành công "${name}"`,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2500,
            timerProgressBar: true,
            background: '#eadeca',
            color: '#7a685c',
            iconColor: '#a64b3d',
        });

        // Bắn sự kiện hối hả kích hoạt hàm updateCount() của Header
        window.dispatchEvent(new Event('cartUpdated'));
    };

    return (
        <div className="row g-5" style={{ fontFamily: '"Courier New", Courier, Georgia, serif', color: '#433422' }}>

            {/* Khối hình ảnh sản phẩm */}
            <div className="col-12 col-md-6">
                <div style={{
                    position: 'relative',
                    border: '3px solid #433422',
                    boxShadow: '6px 6px 0px #433422',
                    borderRadius: '4px',
                    backgroundColor: '#ecdcb9',
                    overflow: 'hidden'
                }}>
                    <img
                        src={getProductImageUrl()}
                        alt={name}
                        className="w-100 img-fluid"
                        style={{
                            objectFit: 'cover',
                            aspectRatio: '1/1',
                            filter: isOutOfStock ? 'sepia(8%) contrast(98%) blur(2px)' : 'sepia(8%) contrast(98%)'
                        }}
                    />

                    {discountPercent && discountPercent > 0 && !isOutOfStock && (
                        <div style={{
                            position: 'absolute',
                            top: '15px',
                            left: '15px',
                            backgroundColor: '#a74343',
                            color: '#fff',
                            padding: '6px 12px',
                            fontWeight: 'bold',
                            border: '2px solid #433422',
                            boxShadow: '2px 2px 0px #433422',
                            fontSize: '0.9rem'
                        }}>
                            -{discountPercent}% OFF
                        </div>
                    )}

                    {isOutOfStock && (
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            backgroundColor: 'rgba(67, 52, 34, 0.85)',
                            color: '#eadeca',
                            padding: '10px 20px',
                            fontWeight: 'bold',
                            letterSpacing: '2px',
                            border: '2px solid #eadeca',
                            borderRadius: '4px',
                            fontSize: '1.2rem',
                            zIndex: 2
                        }}>
                            HẾT HÀNG
                        </div>
                    )}
                </div>
            </div>

            {/* Khối thông tin chi tiết */}
            <div className="col-12 col-md-6 d-flex flex-column justify-content-between">
                <div>
                    <span className="badge px-3 py-2 mb-2 text-uppercase" style={{ backgroundColor: '#2c5d63', color: '#fff', border: '2px solid #433422', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                        [ {categoryName} ]
                    </span>

                    <h2 className="font-weight-bold my-2 text-uppercase" style={{ fontSize: '2rem', lineHeight: '1.2', color: '#433422' }}>
                        {name}
                    </h2>

                    <div className="d-flex align-items-center gap-3 my-3">
                        <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#a74343' }}>
                            {Number(currentPrice).toLocaleString('vi-VN')}đ
                        </span>
                        {oldPrice && Number(oldPrice) > 0 && (
                            <span style={{ fontSize: '1.2rem', color: '#a2b29f', textDecoration: 'line-through' }}>
                                {Number(oldPrice).toLocaleString('vi-VN')}đ
                            </span>
                        )}
                    </div>

                    <hr style={{ borderColor: '#433422', borderWidth: '2px' }} />

                    <p className="small mb-4">
                        <i className="fa-solid fa-boxes-stacked me-1"></i> Tình trạng kho: {' '}
                        {!isOutOfStock ? (
                            <span className="font-weight-bold text-success">[ Sẵn có {stock} món ]</span>
                        ) : (
                            <span className="font-weight-bold text-danger">[ Đã hết hàng ]</span>
                        )}
                    </p>

                    <div className="p-3 mb-4" style={{ backgroundColor: '#f4ebd0', borderLeft: '4px solid #2c5d63', borderRadius: '2px' }}>
                        <h6 className="font-weight-bold mb-2 text-uppercase" style={{ fontSize: '0.8rem', color: '#2c5d63', letterSpacing: '1px' }}>• Lời tự sự món đồ •</h6>
                        <p className="mb-0 small lh-lg" style={{ color: '#544740', fontStyle: 'italic' }}>
                            {description}
                        </p>
                    </div>
                </div>

                <div>
                    <button
                        className="btn w-100 py-3 text-uppercase font-weight-bold vintage-add-btn"
                        disabled={isOutOfStock}
                        onClick={handleAddToCartClick}
                    >
                        <i className="fa-solid fa-basket-shopping me-2"></i>
                        {isOutOfStock ? 'Món này tạm hết hàng' : 'Gói món này mang về'}
                    </button>
                </div>
            </div>

            <style>{`
                .vintage-add-btn {
                    background-color: #a74343;
                    color: #ffffff;
                    border: 2px solid #433422;
                    border-radius: 4px;
                    box-shadow: 4px 4px 0px #433422;
                    transition: all 0.15s ease;
                    letter-spacing: 1px;
                }
                .vintage-add-btn:hover:not([disabled]) {
                    background-color: #2c5d63;
                    color: #ffffff;
                    transform: translate(2px, 2px);
                    box-shadow: 2px 2px 0px #433422;
                }
                .vintage-add-btn:disabled {
                    background-color: #c4b5a7;
                    border-color: #7a685c;
                    color: #7a685c;
                    box-shadow: none;
                    cursor: not-allowed;
                }
            `}</style>
        </div>
    );
};

export default ProductInfo;