import React, { useState } from 'react';
import ProfileInfo from './ProfileInfo';
import OrderHistory from './OrderHistory';

const ProfileIndex = () => {
    // State để quản lý xem người dùng đang bấm vào tab nào
    const [activeTab, setActiveTab] = useState('info');

    return (
        <div className="vintage-profile-index-wrapper py-5" style={{ backgroundColor: '#f4ebd0', minHeight: 'calc(100vh - 80px)' }}>
            <div className="container">
                {/* Tiêu đề trang */}
                <div className="mb-5 text-center text-md-start">
                    <h2 className="vintage-main-title mb-2">TÀI KHOẢN CỦA TÔI</h2>
                    <p className="vintage-main-subtitle">Quản lý thông tin lưu trữ và lịch sử giao thương tại tiệm</p>
                    <div className="vintage-title-line"></div>
                </div>

                <div className="row">
                    {/* Menu bên trái / Trên cùng ở Mobile */}
                    <div className="col-md-4 col-lg-3 mb-4">
                        <div className="vintage-menu-group">
                            <button
                                className={`vintage-menu-item ${activeTab === 'info' ? 'active' : ''}`}
                                onClick={() => setActiveTab('info')}
                            >
                                <i className="fa-regular fa-id-card me-2"></i> Thông tin cá nhân
                            </button>

                            <button
                                className={`vintage-menu-item ${activeTab === 'orders' ? 'active' : ''}`}
                                onClick={() => setActiveTab('orders')}
                            >
                                <i className="fa-solid fa-clock-rotate-left"></i> Nhật ký đơn hàng
                            </button>
                        </div>
                    </div>

                    {/* Nội dung hiển thị bên phải */}
                    <div className="col-md-8 col-lg-9">
                        <div className="vintage-content-wrapper">
                            {activeTab === 'info' ? <ProfileInfo /> : <OrderHistory />}
                        </div>
                    </div>
                </div>
            </div>

            {/* Khối CSS Retro Vintage đồng bộ hệ thống */}
            <style>{`
                /* Tiêu đề chính */
                .vintage-main-title {
                    font-family: "Courier New", Courier, Georgia, serif;
                    font-weight: 900;
                    color: #433422;
                    letter-spacing: 2px;
                }
                .vintage-main-subtitle {
                    font-family: "Courier New", Courier, Georgia, serif;
                    color: #a74343;
                    font-style: italic;
                    font-weight: 700;
                    font-size: 0.95rem;
                }
                .vintage-title-line {
                    width: 80px;
                    height: 4px;
                    background-color: #2c5d63;
                    border: 1px solid #433422;
                    margin-top: 10px;
                    box-shadow: 2px 2px 0px #433422;
                }
                @media (max-width: 767.98px) {
                    .vintage-title-line { margin: 10px auto 0 auto; }
                }

                /* Khối bọc Menu bên trái */
                .vintage-menu-group {
                    background-color: #ecdcb9;
                    border: 3px solid #433422;
                    border-radius: 4px;
                    box-shadow: 5px 5px 0px #433422;
                    padding: 12px;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    font-family: "Courier New", Courier, Georgia, serif;
                }

                /* Các nút Menu Item */
                .vintage-menu-item {
                    width: 100%;
                    text-align: left;
                    background-color: #f4ebd0;
                    color: #433422;
                    font-weight: 800;
                    font-size: 0.95rem;
                    border: 2px solid #433422;
                    border-radius: 4px;
                    padding: 14px 18px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    transition: all 0.1s ease;
                }
                .vintage-menu-item i {
                    font-size: 1.1rem;
                    color: #2c5d63;
                    transition: all 0.1s ease;
                }

                /* Khi hover vào menu */
                .vintage-menu-item:hover {
                    background-color: #e2d7ba;
                    transform: translate(1px, 1px);
                }

                /* Trạng thái Tab đang Active */
                .vintage-menu-item.active {
                    background-color: #2c5d63;
                    color: #f4ebd0;
                    box-shadow: inset 3px 3px 0px #1a3b3e;
                }
                .vintage-menu-item.active i {
                    color: #ecdcb9;
                }

                /* Vùng chứa nội dung để loại bỏ shadow hiện đại */
                .vintage-content-wrapper .card {
                    background-color: #ecdcb9 !important;
                    border: 3px solid #433422 !important;
                    border-radius: 4px !important;
                    box-shadow: 6px 6px 0px #433422 !important;
                }

                /* Responsive cho thiết bị di động (Ngang hàng trên Mobile) */
                @media (max-width: 767.98px) {
                    .vintage-menu-group {
                        flex-direction: row;
                        padding: 8px;
                        gap: 6px;
                        overflow-x: auto;
                    }
                    .vintage-menu-item {
                        padding: 10px 14px;
                        font-size: 0.85rem;
                        white-space: nowrap;
                        justify-content: center;
                    }
                }
            `}</style>
        </div>
    );
};

export default ProfileIndex;