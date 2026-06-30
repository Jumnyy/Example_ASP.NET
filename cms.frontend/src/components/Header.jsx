import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import customerService from '../services/customerService';

const Header = () => {
    const [cartCount, setCartCount] = useState(0);
    const [user, setUser] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const customSwal = Swal.mixin({
        background: '#f4ebd0',
        color: '#433422',
        confirmButtonColor: '#2c5d63',
        cancelButtonColor: '#a74343',
        customClass: {
            popup: 'vintage-swal-popup',
            confirmButton: 'vintage-swal-btn-confirm',
            cancelButton: 'vintage-swal-btn-cancel'
        }
    });

    // 💡 SỬA LOGIC ĐẾM: Đọc trực tiếp từ localStorage dựa trên user thực tế tại thời điểm gọi hàm
    const updateCount = () => {
        let currentUserId = null;

        // Cố gắng đọc user mới nhất từ localStorage trước
        const localCustomer = localStorage.getItem('customer');
        if (localCustomer) {
            const parsed = JSON.parse(localCustomer);
            currentUserId = parsed.id || parsed.customerId;
        } else if (user) {
            currentUserId = user.id || user.customerId;
        }

        const cartKey = currentUserId ? `myCart_${currentUserId}` : 'myCart_Guest';
        const cart = JSON.parse(localStorage.getItem(cartKey)) || [];

        // Tính tổng số lượng (quantity) của tất cả mặt hàng trong giỏ
        const totalItems = cart.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
        setCartCount(totalItems);
    };

    const checkLoginStatus = async () => {
        const localCustomer = localStorage.getItem('customer');
        if (localCustomer) {
            const parsedUser = JSON.parse(localCustomer);
            parsedUser.id = parsedUser.id || parsedUser.customerId;
            setUser(parsedUser);
        }

        try {
            // Thay đổi endpoint sang đúng service auth của bạn nếu cần thiết, tạm thời giữ nguyên cấu trúc của bạn
            const response = await fetch('/api/CustomerAuth/profile', { credentials: 'include' });
            const contentType = response.headers.get("content-type");

            if (response.ok && contentType && contentType.includes("application/json")) {
                const data = await response.json();
                setUser(data);
                localStorage.setItem('customer', JSON.stringify(data));
            } else {
                if (!localCustomer) {
                    setUser(null);
                }
            }
        } catch (error) {
            console.error("Lỗi kiểm tra đăng nhập:", error);
            if (!localCustomer) {
                setUser(null);
            }
        }
    };

    const handleLogout = async (e) => {
        e.preventDefault();
        setIsOpen(false);

        const result = await customSwal.fire({
            title: 'BẠN CÓ MUỐN THOÁT?',
            text: "Hệ thống sẽ đăng xuất khỏi tài khoản hiện tại.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'ĐỒNG Ý',
            cancelButtonText: 'HỦY BỎ',
            reverseButtons: true
        });

        if (!result.isConfirmed) return;

        try {
            await customerService.logout();
        } catch (error) {
            console.error("Lỗi kết nối API Logout:", error);
        } finally {
            localStorage.removeItem('customer');
            setUser(null);
            setCartCount(0);

            await customSwal.fire({
                title: 'THÀNH CÔNG',
                text: 'Hẹn gặp lại bạn lần sau!',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });

            navigate('/');
            window.location.reload();
        }
    };

    useEffect(() => {
        checkLoginStatus();
        updateCount();

        // Lắng nghe sự kiện giỏ hàng thay đổi từ các trang con
        window.addEventListener('cartUpdated', updateCount);
        window.addEventListener('userLoggedIn', checkLoginStatus);

        // Thêm lắng nghe khi cập nhật profile ở ProfileInfo
        window.addEventListener('profileUpdated', checkLoginStatus);

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            window.removeEventListener('cartUpdated', updateCount);
            window.removeEventListener('userLoggedIn', checkLoginStatus);
            window.removeEventListener('profileUpdated', checkLoginStatus);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Mỗi lần trạng thái đăng nhập thay đổi thì tính lại giỏ hàng
    useEffect(() => {
        updateCount();
    }, [user]);

    return (
        <header className="sticky-top" style={{ backgroundColor: '#f4ebd0', borderBottom: '2px solid #433422', zIndex: 1020 }}>
            <nav className="navbar navbar-expand-lg navbar-light py-3">
                <div className="container">
                    {/* LOGO */}
                    <Link to="/" className="navbar-brand d-flex align-items-center text-decoration-none">
                        <span style={{ fontSize: '1.7rem', fontWeight: '800', color: '#433422', letterSpacing: '4px', fontFamily: '"Courier New", Courier, Georgia, serif', textShadow: '2px 2px 0px #ecdcb9' }}>JyM</span>
                        <span className="fw-light ps-1" style={{ color: '#a74343', fontSize: '1.2rem', fontStyle: 'italic', fontWeight: '700' }}>.cms</span>
                    </Link>

                    {/* GIỎ HÀNG MOBILE */}
                    <div className="d-flex align-items-center gap-2 d-lg-none">
                        <Link to="/cart" className="position-relative vintage-cart-icon-btn" aria-label="Giỏ hàng">
                            <i className="fa-solid fa-basket-shopping"></i>
                            {cartCount > 0 && <span className="vintage-cart-badge">{cartCount}</span>}
                        </Link>
                        <button className="navbar-toggler border-2 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" style={{ borderColor: '#433422', padding: '6px 10px', borderRadius: '4px' }}>
                            <i className="fa-solid fa-bars-staggered" style={{ color: '#433422', fontSize: '1.3rem' }}></i>
                        </button>
                    </div>

                    {/* NAVIGATION MENU */}
                    <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                        <ul className="navbar-nav align-items-center gap-3 mt-3 mt-lg-0">
                            <li className="nav-item">
                                <NavLink to="/" className={({ isActive }) => `nav-link px-3 vintage-nav-item ${isActive ? 'vintage-active' : ''}`} end>Trang chủ</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/shop" className={({ isActive }) => `nav-link px-3 vintage-nav-item ${isActive ? 'vintage-active' : ''}`} end>Sản phẩm</NavLink>
                            </li>

                            {/* DROPDOWN USER */}
                            {user ? (
                                <li className="nav-item position-relative" ref={dropdownRef}>
                                    <button
                                        className="btn vintage-user-dropdown-btn d-flex align-items-center gap-2 border-0 bg-transparent"
                                        type="button"
                                        onClick={() => setIsOpen(!isOpen)}
                                    >
                                        <i className="fa-regular fa-user"></i>
                                        <span>{user.fullName || user.FullName}</span>
                                        <i className={`fa-solid fa-chevron-down small ms-1 transition-icon ${isOpen ? 'rotate-180' : ''}`}></i>
                                    </button>

                                    <ul className={`dropdown-menu dropdown-menu-end vintage-dropdown-menu ${isOpen ? 'show d-block' : 'd-none'}`} style={{ position: 'absolute', right: 0, top: '100%' }}>
                                        <li className="dropdown-header vintage-dropdown-header">
                                            <small className="d-block text-muted">Tài khoản</small>
                                            <span className="fw-bold text-truncate d-block" style={{ color: '#433422' }}>{user.email || user.Email}</span>
                                        </li>
                                        <li>
                                            <Link className="dropdown-item vintage-dropdown-item" to="/profile" onClick={() => setIsOpen(false)}>
                                                <i className="fa-regular fa-id-card me-2"></i> Hồ sơ cá nhân
                                            </Link>
                                        </li>
                                        <li><hr className="vintage-dropdown-divider" /></li>
                                        <li>
                                            <a className="dropdown-item vintage-dropdown-item vintage-logout-action" href="#logout" onClick={handleLogout}>
                                                <i className="fa-solid fa-power-off me-2"></i> Đăng xuất
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                            ) : (
                                <>
                                    <li className="nav-item">
                                        <NavLink to="/Login" className={({ isActive }) => `nav-link px-3 vintage-nav-item ${isActive ? 'vintage-active' : ''}`}>Đăng Nhập</NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink to="/Register" className={({ isActive }) => `nav-link px-3 vintage-nav-item ${isActive ? 'vintage-active' : ''}`}>Đăng Ký</NavLink>
                                    </li>
                                </>
                            )}

                            {/* GIỎ HÀNG DESKTOP */}
                            <li className="nav-item ms-lg-2 mt-2 mt-lg-0 d-none d-lg-block">
                                <Link to="/cart" className="btn vintage-cart-btn d-flex align-items-center gap-2">
                                    <i className="fa-solid fa-basket-shopping" style={{ fontSize: '1.05rem' }}></i>
                                    <span>GIỎ TAY</span>
                                    <span className="vintage-cart-btn-badge">{cartCount}</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <style>{`
                .vintage-nav-item { color: #433422 !important; font-size: 0.95rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; font-family: "Courier New", Courier, Georgia, serif; position: relative; padding: 6px 12px; transition: all 0.2s ease; }
                .vintage-nav-item:hover, .vintage-active { color: #a74343 !important; font-style: italic; }
                .vintage-nav-item::after { content: ''; position: absolute; width: 0; height: 2px; bottom: 0px; left: 12px; background-color: #a74343; transition: width 0.25s ease; }
                .vintage-nav-item:hover::after, .vintage-active::after { width: calc(100% - 24px); }
                
                .vintage-user-dropdown-btn { color: #2c5d63 !important; font-family: "Courier New", Courier, Georgia, serif; font-weight: 700; text-transform: capitalize; font-size: 0.95rem; padding: 6px 12px; transition: color 0.2s; }
                .vintage-user-dropdown-btn:hover { color: #a74343 !important; font-style: italic; }
                
                .transition-icon { transition: transform 0.2s ease; }
                .rotate-180 { transform: rotate(180deg); }

                .vintage-dropdown-menu { background-color: #f4ebd0 !important; border: 2px solid #433422 !important; border-radius: 4px !important; box-shadow: 4px 4px 0px #433422 !important; padding: 0 !important; font-family: "Courier New", Courier, Georgia, serif; min-width: 200px; margin-top: 5px; }
                .vintage-dropdown-header { background-color: #ecdcb9; padding: 10px 15px; border-bottom: 2px dashed #433422; }
                .vintage-dropdown-item { color: #433422 !important; font-weight: 700; font-size: 0.85rem; text-transform: uppercase; padding: 10px 15px !important; transition: all 0.15s ease; }
                .vintage-dropdown-item:hover { background-color: #2c5d63 !important; color: #f4ebd0 !important; }
                .vintage-dropdown-divider { margin: 0; border-top: 2px solid #433422; opacity: 1; }
                .vintage-nav-item:hover, .vintage-active { color: #a74343 !important; font-style: italic; }
                .vintage-logout-action { color: #a74343 !important; }
                .vintage-logout-action:hover { background-color: #a74343 !important; color: #fff !important; }

                .vintage-cart-btn { background-color: #a74343; color: #ffffff !important; font-size: 0.85rem; font-weight: 700; text-transform: uppercase; border: 2px solid #433422; border-radius: 4px; padding: 8px 16px; box-shadow: 3px 3px 0px #433422; transition: all 0.15s ease; }
                .vintage-cart-btn:hover { background-color: #2c5d63; box-shadow: 1px 1px 0px #433422; transform: translate(2px, 2px); }
                .vintage-cart-btn-badge { background-color: #f4ebd0; color: #433422; font-size: 0.75rem; padding: 2px 7px; font-weight: 800; border: 2px solid #433422; border-radius: 3px; }
                .vintage-cart-icon-btn { color: #433422; font-size: 1.4rem; padding: 6px; display: inline-block; }
                .vintage-cart-badge { position: absolute; top: -2px; right: -4px; background-color: #a74343; color: #fff; font-size: 0.65rem; padding: 1px 5px; border: 2px solid #433422; border-radius: 3px; }

                .vintage-swal-popup { border: 3px solid #433422 !important; box-shadow: 6px 6px 0px #433422 !important; border-radius: 4px !important; font-family: "Courier New", Courier, Georgia, serif !important; }
                .vintage-swal-btn-confirm, .vintage-swal-btn-cancel { border: 2px solid #433422 !important; font-weight: bold !important; box-shadow: 2px 2px 0px #433422 !important; border-radius: 4px !important; }
                .vintage-swal-btn-confirm:hover, .vintage-swal-btn-cancel:hover { transform: translate(1px, 1px) !important; box-shadow: 1px 1px 0px #433422 !important; }
            `}</style>
        </header>
    );
};

export default Header;