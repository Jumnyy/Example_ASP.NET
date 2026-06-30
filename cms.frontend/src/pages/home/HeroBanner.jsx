import React, { useState, useEffect, useRef } from 'react';
import bannerService from '../../services/bannerService';

const HeroBanner = () => {
    const [banners, setBanners] = useState([]);
    const carouselRef = useRef(null);
    const BACKEND_URL = 'https://localhost:7119';

    useEffect(() => {
        bannerService.getActiveBanners().then(data => {
            setBanners(data);
        });
    }, []);

    useEffect(() => {
        let carouselInstance = null;

        if (banners.length > 0 && carouselRef.current && window.bootstrap) {
            carouselInstance = new window.bootstrap.Carousel(carouselRef.current, {
                interval: 4000, // 4 giây là thời gian vàng vừa đủ để đọc và ngắm ảnh
                ride: 'carousel',
                pause: 'hover'
            });

            carouselInstance.cycle();
        }

        return () => {
            if (carouselInstance) {
                carouselInstance.dispose();
            }
        };
    }, [banners]);

    if (banners.length === 0) {
        return (
            <div className="container-fluid px-0 mb-5">
                <div className="bg-light d-flex justify-content-center align-items-center w-100" style={{ height: '500px' }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid px-0 mb-5 position-relative">

            {/* 🌟 STYLE CUSTOM TOÀN DIỆN CHO BANNER SANG TRỌNG */}
            <style>
                {`
                /* Ép buộc hiệu ứng Fade (Mờ dần) thay vì trượt ngang mặc định của Bootstrap */
                .carousel-fade .carousel-item {
                    opacity: 0;
                    transition: opacity 1.2s ease-in-out !important;
                    position: absolute;
                    display: block !important;
                    width: 100%;
                    top: 0;
                    left: 0;
                }
                .carousel-fade .carousel-item.active {
                    opacity: 1;
                    position: relative;
                    z-index: 1;
                }

                /* Lớp phủ Gradient mờ tối ở đáy ảnh giúp Text hoặc giao diện hòa quyện hơn */
                .banner-wrapper {
                    position: relative;
                    overflow: hidden;
                }
                .banner-wrapper::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: 15%;
                    background: linear-gradient(to top, rgba(0,0,0,0.15), transparent);
                    pointer-events: none;
                }

                /* Tùy chỉnh các thanh gạch chỉ thị (Indicators) thanh mảnh, tinh tế */
                .custom-indicators button {
                    width: 35px !important;
                    height: 5px !important;
                    border-radius: 10px !important;
                    border: none !important;
                    background-color: rgba(255, 255, 255, 0.4) !important;
                    transition: all 0.3s ease !important;
                    margin: 0 5px !important;
                }
                .custom-indicators button.active {
                    width: 50px !important; /* Dài ra khi active tạo điểm nhấn sinh động */
                    background-color: #fff !important;
                    box-shadow: 0 0 8px rgba(255,255,255,0.6);
                }

                /* Thiết kế lại 2 nút bấm Control hai bên */
                .custom-control {
                    width: 6% !important;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }
                #heroCarousel:hover .custom-control {
                    opacity: 1; /* Chỉ hiện nút bấm khi người dùng di chuột vào Slider */
                }
                .control-icon-box {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 45px;
                    height: 45px;
                    background-color: rgba(255, 255, 255, 0.25);
                    backdrop-filter: blur(5px); /* Làm mờ kính cực hiện đại */
                    border-radius: 50%;
                    transition: all 0.3s ease;
                    border: 1px solid rgba(255,255,255,0.2);
                }
                .custom-control:hover .control-icon-box {
                    background-color: #fff;
                    color: #000;
                    transform: scale(1.1);
                    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                }
                .custom-control:hover .carousel-control-prev-icon,
                .custom-control:hover .carousel-control-next-icon {
                    filter: invert(1); /* Đảo màu icon mũi tên sang đen khi nền hóa trắng */
                }
                `}
            </style>

            {/* Thêm class 'carousel-fade' của Bootstrap */}
            <div id="heroCarousel" ref={carouselRef} className="carousel slide carousel-fade" data-bs-ride="carousel">

                {/* Các dấu chấm chỉ thị */}
                <div className="carousel-indicators custom-indicators mb-3">
                    {banners.map((_, index) => (
                        <button
                            key={index}
                            type="button"
                            data-bs-target="#heroCarousel"
                            data-bs-slide-to={index}
                            className={index === 0 ? "active" : ""}
                            aria-current={index === 0 ? "true" : undefined}
                            aria-label={`Slide ${index + 1}`}
                        ></button>
                    ))}
                </div>

                {/* Nội dung ảnh */}
                <div className="carousel-inner shadow-sm">
                    {banners.map((banner, index) => {
                        // Bắt các trường hợp đặt tên thuộc tính ảnh khác nhau từ API
                        const imgUrl = banner.imageUrl || banner.image || banner.imagePath;

                        return (
                            <div key={banner.id} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                                <div className="banner-wrapper">
                                    <a href={banner.targetUrl || "#"} target={banner.targetUrl ? "_blank" : "_self"} rel="noreferrer">
                                        <img
                                            src={imgUrl?.startsWith('http') ? imgUrl : `${BACKEND_URL}${imgUrl}`}
                                            className="d-block w-100"
                                            alt={banner.title || "Hero Banner"}
                                            style={{ 
                                                height: '65vh', // Chiếm 75% chiều cao màn hình hiển thị, chuẩn UI ngày nay
                                                minHeight: '200px', 
                                                maxHeight: '550px', 
                                                objectFit: 'cover' 
                                            }}
                                        />
                                    </a>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Nút Trái / Phải được cách điệu */}
                <button className="carousel-control-prev custom-control" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
                    <div className="control-icon-box">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    </div>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next custom-control" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
                    <div className="control-icon-box">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    </div>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
        </div>
    );
};

export default HeroBanner;