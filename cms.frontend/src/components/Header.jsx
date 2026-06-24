import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Header = () => {
    return (
        <header className="sticky-top border-bottom" style={{ backgroundColor: '#fbf9f6', borderColor: '#eadeca' }}>
            <nav className="navbar navbar-expand-lg navbar-light py-3">
                <div className="container">
                    {/* Logo Vintage với Font chữ có chân nghệ thuật */}
                    <Link to="/" className="navbar-brand d-flex align-items-center text-decoration-none">
                        <span style={{
                            fontSize: '1.6rem',
                            fontWeight: '700',
                            color: '#7a685c',
                            letterSpacing: '3px',
                            fontFamily: '"Playfair Display", "Georgia", serif'
                        }}>
                            SOLIS
                        </span>
                        <span className="fw-light ps-1" style={{ color: '#c4b5a7', fontSize: '1.2rem', fontStyle: 'italic' }}>.cms</span>
                    </Link>

                    {/* Nút Toggle trên Điện thoại dáng thanh mảnh */}
                    <button
                        className="navbar-toggler border-0 shadow-none"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                    >
                        <i className="fa-solid fa-bars-staggered" style={{ color: '#7a685c', fontSize: '1.3rem' }}></i>
                    </button>

                    {/* Menu Điều Hướng Hoài Cổ */}
                    <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                        <ul className="navbar-nav align-items-center gap-2 mt-3 mt-lg-0">
                            <li className="nav-item">
                                <NavLink
                                    to="/"
                                    className={({ isActive }) => `nav-link px-3 vintage-nav-item ${isActive ? 'vintage-active' : ''}`}
                                    end
                                >
                                    Trang chủ
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink
                                    to="/Login"
                                    className={({ isActive }) => `nav-link px-3 vintage-nav-item ${isActive ? 'vintage-active' : ''}`}
                                >
                                    Đăng Nhập
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink
                                    to="/Register"
                                    className={({ isActive }) => `nav-link px-3 vintage-nav-item ${isActive ? 'vintage-active' : ''}`}
                                >
                                    Đăng Ký
                                </NavLink>
                            </li>

{/*                            <li className="nav-item ms-lg-3 mt-2 mt-lg-0">
                                <Link
                                    to="/contact"
                                    className="btn px-4 rounded-pill vintage-btn"
                                >
                                    Liên hệ <i className="fa-solid fa-arrow-right-long ms-2" style={{ fontSize: '0.75rem' }}></i>
                                </Link>
                            </li>
*/}                        </ul>
                    </div>
                </div>
            </nav>

            <style>{`
                .vintage-nav-item {
                    color: #8a7a6e !important;
                    font-size: 0.95rem;
                    font-weight: 500;
                    position: relative;
                    transition: all 0.3s ease;
                }
                .vintage-nav-item:hover, .vintage-active {
                    color: #7a685c !important;
                    font-style: italic;
                }
                /* Hiệu ứng gạch chân mộc mạc */
                .vintage-nav-item::after {
                    content: '';
                    position: absolute;
                    width: 0;
                    height: 1px;
                    bottom: 2px;
                    left: 1rem;
                    background-color: #7a685c;
                    transition: width 0.3s ease;
                }
                .vintage-nav-item:hover::after, .vintage-active::after {
                    width: calc(100% - 2rem);
                }
                /* Nút thắt nơ gỗ ấm áp */
                .vintage-btn {
                    background-color: #7a685c;
                    color: #fbf9f6 !important;
                    font-size: 0.9rem;
                    font-weight: 600;
                    border: 1px solid #7a685c;
                    transition: all 0.3s ease;
                }
                .vintage-btn:hover {
                    background-color: transparent;
                    color: #7a685c !important;
                    transform: translateY(-1px);
                }
            `}</style>
        </header>
    );
};

export default Header;