// src/components/ProductCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Swal from 'sweetalert2';
import styles from '../assets/css/ProductCard.module.css';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    if (!product) return null;

    // Đồng bộ định danh và thông tin cơ bản
    const id = product.id ?? product.Id;
    const name = product.name ?? product.Name ?? 'Sản phẩm tiệm Solisz';
    const currentPrice = product.price ?? product.Price ?? 0;
    const oldPrice = product.oldPrice ?? product.OldPrice ?? null;
    const imageUrl = product.imageUrl ?? product.ImageUrl;

    // === ĐỒNG BỘ TUYỆT ĐỐI VỚI BACKEND ===
    const stock = product.stockQuantity ?? product.StockQuantity ?? product.stock ?? product.Stock ?? product.quantity ?? product.Quantity ?? product.soLuong ?? product.SoLuong ?? 0;

    // Nếu số lượng tồn kho vật lý trong DB <= 0 -> Khóa ngay lập tức
    const isOutOfStock = Number(stock) <= 0;

    const discountPercent = (oldPrice && Number(oldPrice) > Number(currentPrice))
        ? Math.round((1 - Number(currentPrice) / Number(oldPrice)) * 100)
        : null;

    // Hàm xử lý khi khách bấm nút "MANG VỀ"
    const handleAddToCartClick = (e) => {
        e.preventDefault();

        // Bước chặn số 1: Nếu DB đã báo hết hàng thì không xử lý tiếp
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

        // 💡 ĐỒNG BỘ HÓA KEY GIỎ HÀNG: Check tài khoản động giống hệt Header và ProductInfo
        let cartKey = 'myCart_Guest';
        const localCustomer = localStorage.getItem('customer');
        if (localCustomer) {
            const parsedUser = JSON.parse(localCustomer);
            const userId = parsedUser.id || parsedUser.customerId;
            if (userId) {
                cartKey = `myCart_${userId}`;
            }
        }

        const quantityToAdd = 1; // Mặc định mỗi lần click là thêm 1 sản phẩm
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
            // Nếu là sản phẩm mới, nạp vào giỏ với cấu trúc trường khớp hoàn toàn với DTO Backend nhận
            cart.push({
                productId: id,
                productName: name,
                price: currentPrice,
                imageUrl: imageUrl,
                quantity: quantityToAdd,
                stockQuantity: currentStock // Đẩy stockQuantity vào giỏ để CartTable kiểm tra khi tăng/giảm số lượng
            });
        }

        // Cập nhật lại localStorage theo đúng Key phân loại
        localStorage.setItem(cartKey, JSON.stringify(cart));

        // Nếu bạn dùng thêm Context để quản lý trạng thái giỏ hàng
        if (addToCart) {
            addToCart(product);
        }

        // Hiện Toast thông báo góc màn hình ngọt ngào chuẩn Vintage
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

        // 🔥 Bắn sự kiện hối hả kích hoạt hàm cập nhật tức thì trên Header/Navbar
        window.dispatchEvent(new Event('cartUpdated'));
    };

    const getProductImageUrl = () => {
        if (!imageUrl) return "https://placehold.co/300/eadeca/7a685c?text=Solisz+Vintage";
        if (imageUrl.startsWith('http')) return imageUrl;

        let cleanPath = imageUrl;
        if (cleanPath.startsWith('/api')) {
            cleanPath = cleanPath.replace('/api', '');
        }
        const safePath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
        return `https://localhost:7119${safePath}`;
    };

    return (
        <div className={`${styles.chillCard} ${isOutOfStock ? styles.outOfStockCard : ''}`}>
            {/* Ribbon giảm giá - Chỉ hiển thị khi sản phẩm thực sự còn hàng */}
            {discountPercent && discountPercent > 0 && !isOutOfStock && (
                <div className={styles.cozyRibbon}>
                    <span>-{discountPercent}% OFF</span>
                </div>
            )}

            {/* Khung ảnh sản phẩm */}
            <div className={styles.imageWarmWrapper}>
                <img
                    src={getProductImageUrl()}
                    alt={name}
                    className={`${styles.cozyImage} ${isOutOfStock ? styles.blurredImage : ''}`}
                />

                {/* Nếu DB báo hết hàng (stockQuantity <= 0): Gắn nhãn HẾT HÀNG đè lên ảnh */}
                {isOutOfStock && (
                    <div className={styles.soldOutBadge}>
                        <span>HẾT HÀNG</span>
                    </div>
                )}

                {/* OVERLAY DỰA TRÊN DB: Chỉ cho hover hiển thị nút chức năng nếu sản phẩm còn hàng */}
                {!isOutOfStock && (
                    <div className={styles.cozyOverlay}>
                        <div className={styles.btnGroup}>
                            <Link to={`/product/${id}`} className={styles.roundBtn}>
                                <i className="fa-regular fa-eye"></i> NGẮM NGHÍA
                            </Link>

                            <button
                                onClick={handleAddToCartClick}
                                className={styles.roundBtn}
                            >
                                <i className="fa-solid fa-basket-shopping"></i> MANG VỀ
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Thông tin hiển thị bên dưới Card */}
            <div className={styles.chillBody}>
                <span className={styles.curatedText}>[ Tiệm tuyển chọn ]</span>
                <h5 className={styles.chillTitle}>{name}</h5>

                <div className={styles.chillPriceRow}>
                    <span className={styles.chillCurrentPrice}>
                        {Number(currentPrice).toLocaleString('vi-VN')}đ
                    </span>
                    {oldPrice && Number(oldPrice) > 0 && (
                        <span className={styles.chillOldPrice}>
                            {Number(oldPrice).toLocaleString('vi-VN')}đ
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;