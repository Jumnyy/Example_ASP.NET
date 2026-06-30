// src/pages/product-detail/index.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import productService from '../../services/productService';
import ProductInfo from './ProductInfo';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const response = await productService.getDetail(id);

                // KIỂM TRA AN TOÀN: Nếu axiosClient của bạn chưa .data thì ta tự lấy, nếu có rồi thì lấy chính nó
                const actualData = response.data !== undefined ? response.data : response;
                setProduct(actualData);
            } catch (error) {
                console.error("Lỗi lấy chi tiết sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    // Màn hình loading phong cách máy đánh chữ cổ điển
    if (loading) {
        return (
            <div className="text-center py-5" style={{ fontFamily: '"Courier New", Courier, serif', color: '#433422' }}>
                <div className="spinner-border spinner-border-sm text-danger mb-2" role="status"></div>
                <div>Đang lật mở sổ sách tiệm Solisz...</div>
            </div>
        );
    }

    // Màn hình lỗi không tìm thấy sản phẩm
    if (!product) {
        return (
            <div className="text-center py-5" style={{ fontFamily: '"Courier New", Courier, serif' }}>
                <h4 style={{ color: '#a74343' }}>[ 404 - Không Tìm Thấy ]</h4>
                <p style={{ color: '#433422' }}>Món đồ này có vẻ đã lạc lối hoặc được ai đó mang về mất rồi.</p>
                <Link to="/" className="btn mt-3" style={{ border: '2px solid #433422', backgroundColor: '#f4ebd0', color: '#433422', fontWeight: 'bold', boxShadow: '3px 3px 0px #433422' }}>
                    QUAY LẠI TIỆM
                </Link>
            </div>
        );
    }

    return (
        <div className="container py-5" style={{ backgroundColor: '#fffcf7' }}>
            {/* Thanh điều hướng nhỏ (Breadcrumb) phong cách thơ mộng */}
            <div className="mb-4 small" style={{ fontFamily: '"Courier New", Courier, serif', color: '#7a685c' }}>
                <Link to="/" className="text-decoration-none" style={{ color: '#2c5d63', fontWeight: 'bold' }}>TIỆM CHỦ</Link>
                <span> / </span>
                <span className="text-uppercase">{product.name ?? product.Name}</span>
            </div>

            <ProductInfo product={product} />
        </div>
    );
};

export default ProductDetail;