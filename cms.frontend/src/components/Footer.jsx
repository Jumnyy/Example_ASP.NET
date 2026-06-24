import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="pt-5 pb-3 mt-auto" style={{ backgroundColor: '#3e3530', color: '#eadeca' }}>
            <div className="container">
                <div className="row g-4">
                    {/* Cột 1: Giới thiệu ngắn */}
                    <div className="col-lg-4 col-md-6">
                        <h4 className="mb-3" style={{ fontFamily: '"Playfair Display", serif', fontWeight: '700', letterSpacing: '1px' }}>
                            <span style={{ color: '#c4b5a7' }}>SOLIS</span>.tuyển chọn
                        </h4>
                        <p className="lh-lg small" style={{ color: '#c4b5a7', fontStyle: 'italic' }}>
                            Góc nhỏ lưu trữ những điều thơ mộng, hệ thống quản trị nội dung thông minh và tối ưu dành riêng cho blog, tin tức và những kẻ mộng mơ.
                        </p>
                        <div className="d-flex gap-2 mt-4">
                            <a href="#" className="btn btn-sm rounded-circle d-flex align-items-center justify-content-center vintage-social">
                                <i className="fa-brands fa-facebook-f"></i>
                            </a>
                            <a href="#" className="btn btn-sm rounded-circle d-flex align-items-center justify-content-center vintage-social">
                                <i className="fa-brands fa-instagram"></i>
                            </a>
                        </div>
                    </div>

                    {/* Cột 2: Liên kết nhanh */}
                    <div className="col-lg-3 col-md-6">
                        <h6 className="text-uppercase mb-3 small fw-bold tracking-wider" style={{ color: '#fbf9f6', letterSpacing: '2px' }}>• Khám phá •</h6>
                        <ul className="list-unstyled d-flex flex-column gap-2 small">
                            <li><Link to="/" className="v-footer-link text-decoration-none">Góc trang chủ</Link></li>
                            <li><Link to="/blog" className="v-footer-link text-decoration-none">Nhật ký bài viết</Link></li>
                            <li><Link to="/about" className="v-footer-link text-decoration-none">Về chúng mình</Link></li>
                        </ul>
                    </div>

                    {/* Cột 3: Chính sách mộc mạc */}
                    <div className="col-lg-3 col-md-6">
                        <h6 className="text-uppercase mb-3 small fw-bold tracking-wider" style={{ color: '#fbf9f6', letterSpacing: '2px' }}>• Giấy tờ •</h6>
                        <ul className="list-unstyled d-flex flex-column gap-2 small">
                            <li><a href="#" className="v-footer-link text-decoration-none">Điều khoản sử dụng</a></li>
                            <li><a href="#" className="v-footer-link text-decoration-none">Chính sách bảo mật</a></li>
                        </ul>
                    </div>

                    {/* Cột 4: Đăng ký nhận thư tay */}
                    <div className="col-lg-2 col-md-6">
                        <h6 className="text-uppercase mb-3 small fw-bold tracking-wider" style={{ color: '#fbf9f6', letterSpacing: '2px' }}>• Hòm thư •</h6>
                        <div className="input-group mb-3 border rounded-pill overflow-hidden bg-transparent" style={{ borderColor: '#544740' }}>
                            <input
                                type="email"
                                className="form-control bg-transparent text-white border-0 small shadow-none py-2 px-3 custom-placeholder"
                                placeholder="Email của bạn..."
                                style={{ fontSize: '0.8rem' }}
                            />
                            <button className="btn border-0 px-3 text-white" type="button" style={{ backgroundColor: '#544740' }}>
                                <i className="fa-solid fa-paper-plane" style={{ color: '#eadeca' }}></i>
                            </button>
                        </div>
                    </div>
                </div>

                <hr className="my-4" style={{ borderColor: '#544740' }} />

                {/* Phần bản quyền ghi đầy đủ MSSV và Tên của bạn */}
                <div className="row align-items-center opacity-75" style={{ fontSize: '0.85rem' }}>
                    <div className="col-md-6 text-center text-md-start mb-2 mb-md-0">
                        <p className="mb-0">
                            &copy; {currentYear} <span className="fw-medium">Solis CMS</span> • <span className="px-2 py-1 rounded" style={{ backgroundColor: '#4d423c', color: '#eadeca' }}>MSSV: 2123110126</span>
                        </p>
                    </div>
                    <div className="col-md-6 text-center text-md-end">
                        <p className="mb-0">
                            Mã lớp CCQ2311D — <span style={{ color: '#fff' }}>Nguyen Tan Thien</span>
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
                .v-footer-link {
                    color: #c4b5a7;
                    transition: all 0.3s ease;
                }
                .v-footer-link:hover {
                    color: #fbf9f6 !important;
                    padding-left: 5px;
                }
                .vintage-social {
                    width: 34px;
                    height: 34px;
                    border: 1px solid #544740;
                    color: #c4b5a7;
                    transition: all 0.3s ease;
                }
                .vintage-social:hover {
                    background-color: #c4b5a7;
                    color: #3e3530;
                    border-color: #c4b5a7;
                }
                .custom-placeholder::placeholder {
                    color: #8c7e75 !important;
                    font-style: italic;
                }
            `}</style>
        </footer>
    );
};

export default Footer;