import React, { useState, useEffect } from 'react';
import orderService from '../../services/orderService';
import CartTable from './CartTable';
import Swal from 'sweetalert2';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);

    // 💡 Hàm trợ giúp lấy Key giỏ hàng động đồng bộ với hệ thống
    const getCartKey = () => {
        let cartKey = 'myCart_Guest';
        const localCustomer = localStorage.getItem('customer');
        if (localCustomer) {
            const parsedUser = JSON.parse(localCustomer);
            const userId = parsedUser.id || parsedUser.customerId;
            if (userId) {
                cartKey = `myCart_${userId}`;
            }
        }
        return cartKey;
    };

    // Đọc giỏ hàng và ghi chú cũ từ LocalStorage khi mới vào trang
    useEffect(() => {
        const cartKey = getCartKey();
        const localCart = JSON.parse(localStorage.getItem(cartKey)) || [];
        setCartItems(localCart);

        const savedNotes = localStorage.getItem('checkoutNotes') || '';
        setNotes(savedNotes);
    }, []);

    // Hàm cập nhật số lượng
    const updateQuantity = (productId, newQty, stockQuantity) => {
        if (newQty < 1) return;

        if (stockQuantity === undefined) {
            Swal.fire({
                icon: 'warning',
                title: 'Dữ liệu cũ!',
                text: 'Dữ liệu giỏ hàng của bạn đã cũ. Vui lòng xóa sản phẩm này và chọn lại từ tiệm nhé!',
                background: '#eadeca',
                color: '#7a685c',
                confirmButtonColor: '#a64b3d'
            });
            return;
        }

        if (newQty > stockQuantity) {
            Swal.fire({
                icon: 'error',
                title: 'Không đủ hàng!',
                text: `Món này nhà em chỉ còn tối đa ${stockQuantity} cái trong kho thôi nè!`,
                background: '#eadeca',
                color: '#7a685c',
                confirmButtonColor: '#a64b3d'
            });
            return;
        }

        const updatedCart = cartItems.map(item =>
            item.productId === productId ? { ...item, quantity: newQty } : item
        );
        setCartItems(updatedCart);

        localStorage.setItem(getCartKey(), JSON.stringify(updatedCart));
        window.dispatchEvent(new Event('cartUpdated'));
    };

    // Hàm xóa sản phẩm
    const removeItem = (productId) => {
        Swal.fire({
            title: 'Bỏ món này ư?',
            text: "Bạn có chắc muốn bỏ sản phẩm này ra khỏi giỏ tay không?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#a74343',
            cancelButtonColor: '#7a685c',
            confirmButtonText: 'Đúng vậy',
            cancelButtonText: 'Giữ lại',
            background: '#eadeca',
            color: '#433422'
        }).then((result) => {
            if (result.isConfirmed) {
                const updatedCart = cartItems.filter(item => item.productId !== productId);
                setCartItems(updatedCart);

                localStorage.setItem(getCartKey(), JSON.stringify(updatedCart));
                window.dispatchEvent(new Event('cartUpdated'));

                Swal.fire({
                    title: 'Đã xóa!',
                    text: 'Món đồ đã được cất lại lên kệ.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false,
                    background: '#eadeca',
                    color: '#7a685c'
                });
            }
        });
    };

    // Tính tổng tiền
    const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // ============================================
    // 🔥 ĐÃ SỬA: LOGIC KIỂM TRA ĐĂNG NHẬP CHÍNH XÁC
    // ============================================
    const handleCheckoutClick = () => {
        // Kiểm tra tất cả các trường hợp lưu trữ tài khoản khả thi ở dự án của bạn
        const token = localStorage.getItem('token');
        const customer = localStorage.getItem('customer');
        const user = localStorage.getItem('user');

        // Nếu KHÔNG có token VÀ KHÔNG có thông tin customer/user -> Coi như chưa đăng nhập
        if (!token && !customer && !user) {
            Swal.fire({
                icon: 'warning',
                title: 'Ghé danh tính cho tiệm biết nhé!',
                text: 'Bạn cần đăng nhập tài khoản để tiệm ghi nhận hóa đơn và chuẩn bị giao hàng nha.',
                background: '#eadeca',
                color: '#433422',
                showCancelButton: true,
                confirmButtonColor: '#2c5d63',
                cancelButtonColor: '#7a685c',
                confirmButtonText: 'ĐĂNG NHẬP NGAY',
                cancelButtonText: 'XEM TIẾP GIỎ HÀNG'
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.setItem('checkoutNotes', notes);
                    window.location.href = '/login';
                }
            });
            return;
        }

        // Tới đây nghĩa là hệ thống ĐÃ tìm thấy tài khoản -> Cho phép đi tiếp đến trang thanh toán
        localStorage.setItem('checkoutNotes', notes);
        window.location.href = '/checkout';
    };

    // Giao diện khi giỏ hàng trống
    if (cartItems.length === 0) {
        return (
            <div className="container my-5 text-center py-5" style={{ fontFamily: '"Courier New", Courier, serif' }}>
                <h3 style={{ color: '#433422', fontWeight: '800' }}>Giỏ hàng của bạn đang trống trơn 🛒</h3>
                <p className="text-muted italic">Đừng để chiếc giỏ xinh phải chờ đợi lâu nha...</p>
                <a href="/" className="btn mt-3 vintage-checkout-btn px-4" style={{ display: 'inline-block', textDecoration: 'none' }}>
                    QUAY LẠI TIỆM BÁNH
                </a>
            </div>
        );
    }

    return (
        <div className="container my-5" style={{ fontFamily: 'Georgia, serif', color: '#433422' }}>
            <h2 className="mb-4 fw-bold text-uppercase" style={{ letterSpacing: '2px', fontFamily: '"Courier New", Courier, serif', textShadow: '1px 1px 0px #ecdcb9' }}>
                <i className="fa-solid fa-basket-shopping me-2"></i> Giỏ Hàng Của Bạn
            </h2>

            <div className="row">
                <div className="col-lg-8 mb-4">
                    <CartTable
                        cartItems={cartItems}
                        updateQuantity={updateQuantity}
                        removeItem={removeItem}
                    />
                </div>

                <div className="col-lg-4">
                    <div className="card border-2 p-4" style={{ backgroundColor: '#f4ebd0', borderColor: '#433422', borderRadius: '4px', boxShadow: '5px 5px 0px #433422' }}>
                        <h4 className="fw-bold mb-4 text-uppercase" style={{ fontFamily: '"Courier New", Courier, serif', fontSize: '1.2rem', borderBottom: '2px solid #433422', paddingBottom: '10px' }}>
                            Tóm tắt giỏ hàng
                        </h4>

                        <div className="d-flex justify-content-between mb-3 align-items-center">
                            <span className="fw-bold text-muted">Tạm tính:</span>
                            <span className="fw-bold" style={{ color: '#a74343', fontSize: '1.4rem', fontFamily: '"Courier New", Courier, serif' }}>
                                {totalAmount.toLocaleString('vi-VN')}đ
                            </span>
                        </div>

                        <div className="mb-4">
                            <label className="form-label fw-bold text-uppercase small" style={{ letterSpacing: '1px' }}>Ghi chú gửi tiệm</label>
                            <textarea
                                className="form-control border-2 shadow-none"
                                rows="3"
                                style={{ borderColor: '#433422', backgroundColor: '#ffffff', borderRadius: '4px', color: '#433422' }}
                                placeholder="Nhắn nhủ thời gian giao bánh hoặc lời chúc..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            ></textarea>
                        </div>

                        <button
                            className="btn w-100 py-3 fw-bold text-uppercase vintage-checkout-btn"
                            disabled={loading}
                            onClick={handleCheckoutClick}
                        >
                            {loading ? 'ĐANG XỬ LÝ...' : 'ĐI ĐẾN THANH TOÁN'}
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                .vintage-checkout-btn {
                    background-color: #a74343 !important;
                    color: #ffffff !important;
                    font-size: 0.95rem;
                    font-weight: 700;
                    letter-spacing: 1px;
                    font-family: "Courier New", Courier, serif;
                    border: 2px solid #433422 !important;
                    border-radius: 4px;
                    box-shadow: 4px 4px 0px #433422;
                    transition: all 0.15s ease;
                }
                
                .vintage-checkout-btn:hover {
                    background-color: #2c5d63 !important;
                    box-shadow: 1px 1px 0px #433422;
                    transform: translate(3px, 3px);
                }
            `}</style>
        </div>
    );
};

export default Cart;