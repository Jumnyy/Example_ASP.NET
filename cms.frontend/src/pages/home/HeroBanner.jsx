import React from 'react';
import { Link } from 'react-router-dom';

const HeroBanner = ({ bannerData }) => {
    // 1. Dữ liệu mặc định với tấm ảnh nhuốm màu thời gian
    const defaultData = {
        subtitle: "• TIỆM ĐỒ TUYỂN CHỌN •",
        title: "Gói ghém những điều mộng mơ",
        description: "Nơi lưu giữ những món đồ độc bản mang phong vị thời gian, những thước phim cũ và những câu chuyện chưa kể.",
        buttonText: "Khám phá ngay",
        buttonLink: "/blog/index",
        // Thay bằng ảnh tĩnh vật, sách cũ và tách trà tone màu trầm hoài cổ
        backgroundImage: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1200&q=80"
    };

    const data = bannerData || defaultData;

    return (
        <div
            className="position-relative d-flex align-items-center vintage-hero"
            style={{
                backgroundImage: `url('${data.backgroundImage}')`,
                minHeight: '50vh', // Hạ thấp chiều cao giúp banner thu nhỏ lại, vừa vặn hơn
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
                backgroundAttachment: 'fixed' // Giữ hiệu ứng cuộn mượt
            }}
        >
            {/* Lớp phủ màu nâu gỗ đậm đặc trưng của phong cách retro */}
            <div className="position-absolute top-0 start-0 w-100 h-100 vintage-overlay"></div>

            <div className="container position-relative z-index-2 py-4">
                <div className="row">
                    <div className="col-lg-6 col-md-8 text-start">
                        {/* Subtitle nhỏ */}
                        <span className="d-inline-block mb-2 vintage-hero-sub animate-fade-in">
                            {data.subtitle}
                        </span>

                        {/* Tiêu đề chính font Serif cổ điển */}
                        <h2 className="mb-3 vintage-hero-title animate-slide-up" style={{ fontSize: '2.5rem' }}>
                            {data.title}
                        </h2>

                        {/* Đoạn mô tả mộc mạc */}
                        <p className="mb-4 vintage-hero-desc animate-slide-up-delay">
                            {data.description}
                        </p>

                        {/* Nút bấm nhỏ nhắn hơn */}
                        <div className="animate-slide-up-delay-2">
                            <Link
                                to={data.buttonLink}
                                className="btn rounded-pill px-4 py-2 fw-bold shadow-sm vintage-hero-btn"
                            >
                                {data.buttonText} <i className="fa-solid fa-arrow-right-long ms-2" style={{ fontSize: '0.8rem' }}></i>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');

                .z-index-2 { z-index: 2; }

                /* Lớp phủ dải màu phim nâu ấm, che bớt các góc sáng của ảnh nền gốc */
                .vintage-overlay {
                    background: linear-gradient(to right, rgba(54, 43, 36, 0.9), rgba(54, 43, 36, 0.5));
                }

                .vintage-hero-sub {
                    color: #eadeca;
                    font-size: 0.85rem;
                    font-weight: 600;
                    letter-spacing: 2px;
                }

                .vintage-hero-title {
                    font-family: 'Playfair Display', Georgia, serif;
                    color: #fbf9f6;
                    font-weight: 700;
                    line-height: 1.3;
                }

                .vintage-hero-desc {
                    color: #c4b5a7;
                    font-size: 1rem;
                    font-style: italic;
                    line-height: 1.6;
                }

                .vintage-hero-btn {
                    background-color: #eadeca;
                    color: #3e3530 !important;
                    font-size: 0.85rem;
                    border: 1px solid #eadeca;
                    transition: all 0.3s ease;
                }

                .vintage-hero-btn:hover {
                    background-color: transparent;
                    color: #eadeca !important;
                    transform: translateY(-1px);
                }

                /* Hiệu ứng mượt mà */
                .animate-fade-in { animation: fadeIn 1s ease-out forwards; }
                .animate-slide-up { animation: slideUp 0.8s ease forwards; }
                .animate-slide-up-delay { opacity: 0; animation: slideUp 0.8s ease 0.15s forwards; }
                .animate-slide-up-delay-2 { opacity: 0; animation: slideUp 0.8s ease 0.3s forwards; }

                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { 
                    from { opacity: 0; transform: translateY(15px); } 
                    to { opacity: 1; transform: translateY(0); } 
                }
            `}</style>
        </div>
    );
};

export default HeroBanner;