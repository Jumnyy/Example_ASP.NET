import React from 'react';
// Import 2 thành phần giao diện từ thư mục components theo hình image_943a1b.png của bạn
import ProductList from '../../components/ProductList';
import PostList from '../../components/PostList';

function Home() {
    return (
        <div style={{ backgroundColor: '#fcfbf7', minHeight: '100vh' }}>
            <style>{`
                .vintage-top-bar { background-color: #3d312a; border-bottom: 1px dashed #52433a; padding: 8px 0; }
                .btn-customer-auth { font-family: 'Quicksand', sans-serif; font-weight: 700; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; color: #f5ebd9 !important; text-decoration: none; transition: all 0.3s ease; border: 1px solid transparent; padding: 4px 12px; }
                .btn-customer-auth:hover { color: #ffffff !important; border: 1px dashed #c49a6c; }
                .vintage-hero-banner { background-color: #eae5da; border: 2px dashed #52433a; min-height: 400px; display: flex; align-items: center; justify-content: center; text-align: center; background-image: linear-gradient(rgba(61, 49, 42, 0.4), rgba(61, 49, 42, 0.6)), url('https://placehold.co/1920x600/eae5da/3d312a?text=ThienCMS+Vintage+Store'); background-size: cover; background-position: center; }
                .banner-content-box { max-width: 700px; padding: 30px; border: 1px solid rgba(245, 235, 217, 0.3); background-color: rgba(61, 49, 42, 0.75); }
                .limited-title { font-family: 'Playfair Display', serif; font-weight: 700; letter-spacing: 2px; color: #3d312a; position: relative; padding-bottom: 15px; }
                .limited-title::after { content: ''; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 60px; height: 2px; background-color: #c49a6c; }
            `}</style>

            {/* TOP BAR */}
            <div className="vintage-top-bar w-100">
                <div className="container d-flex justify-content-between align-items-center">
                    <div className="text-muted small d-none d-sm-block fst-italic" style={{ color: '#a8968a' }}>
                        Chao mung quy khach den voi khong gian hoai niem.
                    </div>
                    <div className="ms-auto d-flex gap-2">
                        <a href="/login" className="btn-customer-auth">Dang nhap</a>
                        <div className="align-self-center" style={{ color: '#52433a' }}>|</div>
                        <a href="/register" className="btn-customer-auth">Dang ky</a>
                    </div>
                </div>
            </div>

            {/* HERO BANNER */}
            <div className="container-fluid px-0 mb-5">
                <div className="vintage-hero-banner">
                    <div className="banner-content-box shadow-lg text-white">
                        <span className="text-uppercase small d-block mb-2" style={{ color: '#c49a6c', letterSpacing: '3px' }}>— THIEN CMS EST. 2026 —</span>
                        <h1 className="display-5 fw-bold mb-3" style={{ fontFamily: "'Playfair Display', serif", color: '#f5ebd9' }}>KHONG GIAN LUU GIU KY NIEM</h1>
                        <p className="lead small fst-italic mb-4" style={{ color: '#d2c5b9' }}>Noi trung bay cac san pham thucong mang dau an truong ton cua thoi gian.</p>
                        <a href="#products-section" className="btn-gold px-4 py-2" style={{ backgroundColor: '#556b2f', color: '#fffdec', padding: '10px 20px', textDecoration: 'none', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.8rem' }}>Kham pha ngay</a>
                    </div>
                </div>
            </div>

            {/* KHỐI 1: HIỂN THỊ DANH SÁCH SẢN PHẨM (GỌI TỪ COMPONENT) */}
            <div id="products-section" className="container mb-5">
                <div className="text-center mb-5">
                    <span className="text-muted text-uppercase small d-block mb-2" style={{ letterSpacing: '2px' }}>— EXCLUSIVE COLLECTION —</span>
                    <h2 className="limited-title text-uppercase">San Pham Noi Bat</h2>
                </div>

                {/* Gọi Component ProductList để tự động lấy dữ liệu từ api/Products và hiển thị */}
                <ProductList />
            </div>

            {/* KHỐI 2: HIỂN THỊ TIN TỨC / BÀI VIẾT (GỌI TỪ COMPONENT) */}
            <div className="container mb-5 pb-5">
                <div className="text-center mb-5">
                    <span className="text-muted text-uppercase small d-block mb-2" style={{ letterSpacing: '2px' }}>— INSIGHT & MAGAZINE —</span>
                    <h2 className="limited-title text-uppercase">Cau Chuyen Phong Cach</h2>
                </div>

                {/* Gọi Component PostList để tự động lấy dữ liệu từ api/Posts và hiển thị */}
                <PostList />
            </div>
        </div>
    );
}

export default Home;