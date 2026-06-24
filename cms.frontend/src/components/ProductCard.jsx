import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../assets/css/ProductCard.module.css';

const ProductCard = ({ product }) => {
    if (!product) return null;

    // Lấy thuộc tính linh hoạt chữ HOA / chữ thường từ API gốc
    const id = product.id ?? product.Id;
    const name = product.name ?? product.Name ?? 'Sản phẩm tiệm Solisz';
    const currentPrice = product.price ?? product.Price ?? 0;
    const oldPrice = product.oldPrice ?? product.OldPrice ?? null;
    const imageUrl = product.imageUrl ?? product.ImageUrl;

    // KIỂM TRA AN TOÀN: Chỉ tính giảm giá ĐÚNG nếu có giá cũ và giá cũ lớn hơn giá hiện tại
    const discountPercent = (oldPrice && Number(oldPrice) > Number(currentPrice))
        ? Math.round((1 - Number(currentPrice) / Number(oldPrice)) * 100)
        : null;

    // Hàm xử lý đường dẫn ảnh an toàn
    const getProductImageUrl = () => {
        if (!imageUrl) return "https://placehold.co/300/eadeca/7a685c?text=Solisz+Vibe";
        if (imageUrl.startsWith('http')) return imageUrl;

        let cleanPath = imageUrl;
        if (cleanPath.startsWith('/api')) {
            cleanPath = cleanPath.replace('/api', '');
        }
        const safePath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
        return `https://localhost:7119${safePath}`;
    };

    return (
        <div className={styles.chillCard}>
            {/* Ribbon thêu nhỏ xinh xắn cho các món đồ giảm giá */}
            {discountPercent && discountPercent > 0 && (
                <div className={styles.cozyRibbon}>
                    <span>-{discountPercent}% off</span>
                </div>
            )}

            {/* Khung ảnh bo tròn mềm mại */}
            <div className={styles.imageWarmWrapper}>
                <img
                    src={getProductImageUrl()}
                    alt={name}
                    className={styles.cozyImage}
                />

                {/* Lớp phủ thơ mộng mờ ảo hiện lên nhẹ nhàng khi hover */}
                <div className={styles.cozyOverlay}>
                    <div className={styles.btnGroup}>
                        <Link to={`/product/${id}`} className={styles.roundBtn}>
                            <i className="fa-regular fa-eye"></i> Ngắm nghía
                        </Link>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                product.onAddToCart ? product.onAddToCart(product) : alert("Đã gói ghém vào giỏ!");
                            }}
                            className={styles.roundBtn}
                        >
                            <i className="fa-solid fa-basket-shopping"></i> Gói mang về
                        </button>
                    </div>
                </div>
            </div>

            {/* Thông tin sản phẩm nhẹ nhàng */}
            <div className={styles.chillBody}>
                <span className={styles.curatedText}>• tuyển chọn •</span>
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