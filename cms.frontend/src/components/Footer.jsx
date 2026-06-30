import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        // Đổi màu nền sang #433422 (Nâu gỗ đậm) và font chữ Courier New/Georgia hoài cổ
        <footer className="pt-5 pb-4 mt-auto" style={{ backgroundColor: '#433422', color: '#f4ebd0', fontFamily: '"Courier New", Courier, Georgia, serif', borderTop: '4px solid #a74343' }}>
            <div className="container">
                <div className="row g-4">
                    {/* Cột 1: Giới thiệu ngắn */}
                    <div className="col-lg-4 col-md-6">
                        <h4 className="mb-3 text-uppercase font-weight-bold" style={{ letterSpacing: '2px' }}>
                            <span style={{ color: '#a74343' }}>SOLIS</span> • TUYỂN CHỌN
                        </h4>
                        <p className="lh-lg small" style={{ color: '#ecdcb9', fontStyle: 'italic' }}>
                            Góc nhỏ lưu trữ những điều thơ mộng, hệ thống quản trị nội dung thông minh và tối ưu dành riêng cho blog, tin tức và những kẻ mộng mơ.
                        </p>
                        <div className="d-flex gap-2 mt-4">
                            <a href="#" className="btn btn-sm d-flex align-items-center justify-content-center vintage-social">
                                <i className="fa-brands fa-facebook-f"></i>
                            </a>
                            <a href="#" className="btn btn-sm d-flex align-items-center justify-content-center vintage-social">
                                <i className="fa-brands fa-instagram"></i>
                            </a>
                        </div>
                    </div>

                    {/* Cột 2: Liên kết nhanh */}
                    <div className="col-lg-3 col-md-6">
                        <h6 className="text-uppercase mb-3 small font-weight-bold" style={{ color: '#a74343', letterSpacing: '2px' }}>• Khám phá •</h6>
                        <ul className="list-unstyled d-flex flex-column gap-2 small">
                            <li><Link to="/" className="v-footer-link text-decoration-none">Góc trang chủ</Link></li>
                            <li><Link to="/blog" className="v-footer-link text-decoration-none">Nhật ký bài viết</Link></li>
                            <li><Link to="/about" className="v-footer-link text-decoration-none">Về chúng mình</Link></li>
                        </ul>
                    </div>

                    {/* Cột 3: Chính sách mộc mạc */}
                    <div className="col-lg-3 col-md-6">
                        <h6 className="text-uppercase mb-3 small font-weight-bold" style={{ color: '#a74343', letterSpacing: '2px' }}>• Giấy tờ •</h6>
                        <ul className="list-unstyled d-flex flex-column gap-2 small">
                            <li><a href="#" className="v-footer-link text-decoration-none">Điều khoản sử dụng</a></li>
                            <li><a href="#" className="v-footer-link text-decoration-none">Chính sách bảo mật</a></li>
                        </ul>
                    </div>

                    {/* Cột 4: Đăng ký nhận thư tay */}
                    <div className="col-lg-2 col-md-6">
                        <h6 className="text-uppercase mb-3 small font-weight-bold" style={{ color: '#a74343', letterSpacing: '2px' }}>• Hòm thư •</h6>
                        {/* Chuyển đổi hộp input sang vuông vức đồng bộ khối cứng Pop-art */}
                        <div className="input-group mb-3 border-2 overflow-hidden bg-transparent" style={{ borderColor: '#ecdcb9', borderRadius: '4px' }}>
                            <input
                                type="email"
                                className="form-control bg-transparent text-white border-0 small shadow-none py-2 px-3 custom-placeholder"
                                placeholder="Email của bạn..."
                                style={{ fontSize: '0.8rem', color: '#f4ebd0' }}
                            />
                            <button className="btn border-0 px-3 vintage-input-btn" type="button">
                                <i className="fa-solid fa-paper-plane" style={{ color: '#433422' }}></i>
                            </button>
                        </div>
                    </div>
                </div>

                <hr className="my-4" style={{ borderColor: '#a74343', borderWidth: '2px' }} />

                {/* Phần bản quyền thông tin sinh viên chỉn chu */}
                <div className="row align-items-center opacity-90" style={{ fontSize: '0.85rem' }}>
                    <div className="col-md-6 text-center text-md-start mb-2 mb-md-0">
                        <p className="mb-0" style={{ letterSpacing: '0.5px' }}>
                            &copy; {currentYear} <span className="font-weight-bold" style={{ color: '#a74343' }}>Solis CMS</span> • <span className="px-2 py-1 font-weight-bold" style={{ backgroundColor: '#a74343', color: '#f4ebd0', borderRadius: '2px' }}>MSSV: 2123110126</span>
                        </p>
                    </div>
                    <div className="col-md-6 text-center text-md-end">
                        <p className="mb-0" style={{ color: '#ecdcb9' }}>
                            Mã lớp CCQ2311D — <span className="font-weight-bold" style={{ color: '#fff' }}>Nguyen Tan Thien</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Khối CSS Thổi hồn Vintage Pop-art vào Footer */}
            <style>{`
                .v-footer-link {
                    color: #ecdcb9;
                    font-weight: 500;
                    transition: all 0.2s ease;
                }
                .v-footer-link:hover {
                    color: #a74343 !important;
                    padding-left: 6px;
                    font-style: italic;
                }
                
                /* Icon Social đổi dạng vuông bo nhẹ, viền dày dặn */
                .vintage-social {
                    width: 36px;
                    height: 36px;
                    border: 2px solid #ecdcb9;
                    border-radius: 4px;
                    color: #ecdcb9;
                    transition: all 0.2s ease;
                    background-color: transparent;
                }
                .vintage-social:hover {
                    background-color: #a74343;
                    color: #f4ebd0;
                    border-color: #a74343;
                    transform: translateY(-2px);
                }

                /* Nút gửi thư tay đổ màu giấy kem tương phản */
                .vintage-input-btn {
                    background-color: #ecdcb9;
                    transition: background-color 0.2s ease;
                }
                .vintage-input-btn:hover {
                    background-color: #a74343 !important;
                }
                .vintage-input-btn:hover i {
                    color: #f4ebd0 !important;
                }

                .custom-placeholder::placeholder {
                    color: #9c8e85 !important;
                    font-style: italic;
                }
            `}</style>
        </footer>
    );
};

export default Footer;