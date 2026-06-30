// src/components/Checkout.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import orderService from '../../services/orderService'; // Hoặc đường dẫn service của bạn
import Swal from 'sweetalert2';

const Checkout = () => {
    const navigate = useNavigate();

    // Trạng thái đơn hàng
    const [cartItems, setCartItems] = useState([]);
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);

    // Form thông tin khách hàng
    const [customerInfo, setCustomerInfo] = useState({
        fullName: '',
        phone: '',
        address: '',
        email: ''
    });

    // 💡 Hàm trợ giúp lấy chính xác Key giỏ hàng của User hiện tại
    const getCartKey = () => {
        const localCustomer = localStorage.getItem('customer');
        if (localCustomer) {
            const parsedUser = JSON.parse(localCustomer);
            const userId = parsedUser.id || parsedUser.customerId;
            if (userId) return `myCart_${userId}`;
        }
        return 'myCart_Guest'; // Trường hợp dự phòng cơ bản
    };

    useEffect(() => {
        // Lấy dữ liệu thô từ localStorage
        const token = localStorage.getItem('token');
        const localCustomerRaw = localStorage.getItem('customer');

        let parsedUser = null;
        try {
            // Parse an toàn để tránh crash ứng dụng nếu chuỗi JSON lỗi
            parsedUser = localCustomerRaw ? JSON.parse(localCustomerRaw) : null;
        } catch (e) {
            console.error("Lỗi parse thông tin khách hàng:", e);
        }

        // 1. KIỂM TRA QUYỀN TRUY CẬP CHUẨN
        // Một User hợp lệ phải có Token HOẶC thông tin Customer có chứa ID thực tế
        const isAuthenticated = token || (parsedUser && (parsedUser.id || parsedUser.customerId));

        if (!isAuthenticated) {
            // Nếu không thỏa mãn, đẩy về trang login
            navigate('/login');
            return;
        }

        // 2. TỰ ĐỘNG ĐIỀN THÔNG TIN USER VÀO FORM
        if (parsedUser) {
            setCustomerInfo({
                fullName: parsedUser.fullName || parsedUser.name || parsedUser.FullName || '',
                phone: parsedUser.phone || parsedUser.phoneNumber || parsedUser.Phone || '',
                address: parsedUser.address || parsedUser.Address || '',
                email: parsedUser.email || parsedUser.Email || ''
            });
        }

        // 3. Đọc dữ liệu giỏ hàng chuẩn theo UserId
        const cartKey = getCartKey();
        const localCart = JSON.parse(localStorage.getItem(cartKey)) || [];
        setCartItems(localCart);

        // 4. Lấy ghi chú đã lưu từ trang giỏ hàng
        const savedNotes = localStorage.getItem('checkoutNotes') || '';
        setNotes(savedNotes);

        // Nếu giỏ hàng trống mà truy cập checkout -> Đẩy về trang giỏ hàng
        if (localCart.length === 0) {
            navigate('/cart');
        }
    }, [navigate]);
    // Tính toán số tiền
    const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingFee = totalAmount > 500000 ? 0 : 30000; // Freeship cho đơn trên 500k, dưới 500k phí 30k
    const finalTotal = totalAmount + shippingFee;

    // Xử lý thay đổi dữ liệu Form nhận hàng
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCustomerInfo(prev => ({ ...prev, [name]: value }));
    };

    // Xử lý gửi đơn đặt hàng
    // Xử lý gửi đơn đặt hàng kết nối API C#
    const handleSubmitOrder = async (e) => {
        e.preventDefault();

        if (!customerInfo.fullName || !customerInfo.phone || !customerInfo.address) {
            Swal.fire({
                icon: 'error',
                title: 'Thiếu thông tin!',
                text: 'Xin quý khách điền đầy đủ Tên, Số điện thoại và Địa chỉ để tiệm ship bánh ạ.',
                background: '#eadeca',
                color: '#433422',
                confirmButtonColor: '#a74343'
            });
            return;
        }

        setLoading(true);

        try {
            // 1. Thu thập thông tin User (CustomerId) từ LocalStorage
            const localCustomer = localStorage.getItem('customer');
            const parsedUser = localCustomer ? JSON.parse(localCustomer) : {};
            const userId = parsedUser.id || parsedUser.customerId || 0;

            // 2. Định dạng lại chuỗi ghi chú bao gồm cả thông tin giao hàng 
            // Vì bảng 'Orders' của bạn ở Backend chỉ có trường 'Notes' (Ghi chú), không có cột nhận hàng riêng.
            const fullNotes = `[Người nhận: ${customerInfo.fullName} - SĐT: ${customerInfo.phone} - ĐC: ${customerInfo.address}]. Lời nhắn: ${notes || 'Không có'}`;

            // 3. Cấu trúc Payload KHỚP 100% với Class CheckoutRequest bên C#
            const orderPayload = {
                customerId: userId, // Backend sẽ bóc claim từ Cookie, nhưng truyền đúng DTO để tránh lỗi model validation
                notes: fullNotes,   // Đẩy toàn bộ thông tin vận chuyển vào cột Notes
                cartItems: cartItems.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price // Gửi lên cho đúng thuộc tính DTO (Backend sẽ tự tìm lại giá trong DB để chống hack)
                }))
            };

            // 4. Kích hoạt gọi API sang C# OrdersController thông qua hàm checkout() của service
            // ... [Các đoạn code cũ giữ nguyên] ...

            // 4. Kích hoạt gọi API sang C# OrdersController thông qua hàm checkout() của service
            const response = await orderService.checkout(orderPayload);

            // Hiện thông báo thành công lấy phản hồi trực tiếp từ Backend C#
            Swal.fire({
                icon: 'success',
                title: 'Đặt hàng thành công! 🎉',
                text: response?.data?.message || 'Cảm ơn bạn đã ủng hộ tiệm. Đơn hàng đã được ghi nhận!',
                background: '#eadeca',
                color: '#433422',
                confirmButtonColor: '#2c5d63',
                timer: 3000
            });

            // 🔥 XÓA SẠCH GIỎ HÀNG VÀ GHI CHÚ TRÊN LOCALSTORAGE SAU KHI ĐẶT THÀNH CÔNG
            localStorage.removeItem(getCartKey());
            localStorage.removeItem('checkoutNotes');

            // Bắn sự kiện cập nhật lại Badge số lượng giỏ hàng trên Header về lại số 0
            window.dispatchEvent(new Event('cartUpdated'));

            // 🌟 THAY ĐỔI CHÍNH: Chuyển hướng về trang lịch sử đơn hàng để xem ngay đơn vừa đặt
            navigate('/order-history');

            // ... [Các đoạn code catch / finally giữ nguyên] ...
        } catch (error) {
            console.error("Lỗi đặt hàng:", error);

            // Đọc thông báo lỗi trả về từ Backend (Ví dụ: "Sản phẩm 'Bánh Kem' không đủ hàng.")
            const backendError = error.response?.data?.message || 'Hệ thống tiệm gặp chút trục trặc. Bạn vui lòng thử lại sau ít phút nhé!';

            Swal.fire({
                icon: 'error',
                title: 'Ui, đặt hàng thất bại!',
                text: backendError,
                background: '#eadeca',
                color: '#433422',
                confirmButtonColor: '#a74343'
            });
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="container my-5" style={{ fontFamily: 'Georgia, serif', color: '#433422' }}>
            <h2 className="mb-4 fw-bold text-uppercase" style={{ letterSpacing: '2px', fontFamily: '"Courier New", Courier, serif', textShadow: '1px 1px 0px #ecdcb9' }}>
                <i className="fa-solid fa-credit-card me-2"></i> Tiến Hành Thanh Toán
            </h2>

            <div className="row">
                {/* CỘT TRÁI: FORM ĐIỀN THÔNG TIN NHẬN HÀNG */}
                <div className="col-lg-7 mb-4">
                    <div className="card border-2 p-4" style={{ borderColor: '#433422', borderRadius: '4px', boxShadow: '5px 5px 0px #433422' }}>
                        <h4 className="fw-bold mb-4 text-uppercase text-secondary" style={{ fontFamily: '"Courier New", Courier, serif', fontSize: '1.2rem', borderBottom: '2px solid #433422', paddingBottom: '10px' }}>
                            Thông tin giao nhận bánh
                        </h4>

                        <form onSubmit={handleSubmitOrder}>
                            <div className="mb-3">
                                <label className="form-label fw-bold small text-uppercase">Tên người nhận hàng *</label>
                                <input
                                    type="text"
                                    className="form-control border-2 shadow-none"
                                    name="fullName"
                                    style={{ borderColor: '#433422' }}
                                    value={customerInfo.fullName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-bold small text-uppercase">Số điện thoại *</label>
                                    <input
                                        type="tel"
                                        className="form-control border-2 shadow-none"
                                        name="phone"
                                        style={{ borderColor: '#433422' }}
                                        value={customerInfo.phone}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-bold small text-uppercase">Địa chỉ Email</label>
                                    <input
                                        type="email"
                                        className="form-control border-2 shadow-none"
                                        name="email"
                                        style={{ borderColor: '#433422' }}
                                        value={customerInfo.email}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-bold small text-uppercase">Địa chỉ nhận bánh cụ thể *</label>
                                <input
                                    type="text"
                                    className="form-control border-2 shadow-none"
                                    name="address"
                                    placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
                                    style={{ borderColor: '#433422' }}
                                    value={customerInfo.address}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-bold small text-uppercase">Lời nhắn gửi kèm đơn hàng</label>
                                <textarea
                                    className="form-control border-2 shadow-none-disabled"
                                    rows="3"
                                    disabled
                                    style={{ borderColor: '#433422', backgroundColor: '#eadeca', color: '#7a685c' }}
                                    value={notes || 'Không có lời nhắn nào được để lại.'}
                                />
                            </div>
                        </form>
                    </div>
                </div>

                {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG (MINI INVOICE) */}
                <div className="col-lg-5">
                    <div className="card border-2 p-4" style={{ backgroundColor: '#f4ebd0', borderColor: '#433422', borderRadius: '4px', boxShadow: '5px 5px 0px #433422' }}>
                        <h4 className="fw-bold mb-3 text-uppercase" style={{ fontFamily: '"Courier New", Courier, serif', fontSize: '1.2rem', borderBottom: '2px solid #433422', paddingBottom: '10px' }}>
                            Đơn hàng của bạn
                        </h4>

                        {/* Danh sách các sản phẩm cuốn chiếu */}
                        <div className="pe-2 mb-3" style={{ maxHeight: '240px', overflowY: 'auto' }}>
                            {cartItems.map((item, idx) => {
                                const name = item.productName || item.name;
                                return (
                                    <div key={idx} className="d-flex justify-content-between align-items-center mb-3 pb-2 border-1" style={{ borderBottom: '1px dashed #433422' }}>
                                        <div style={{ maxWidth: '75%' }}>
                                            <span className="fw-bold small d-block">{name}</span>
                                            <small className="text-muted" style={{ fontFamily: '"Courier New", Courier, serif' }}>
                                                Số lượng: {item.quantity} x {Number(item.price).toLocaleString('vi-VN')}đ
                                            </small>
                                        </div>
                                        <span className="fw-bold small" style={{ fontFamily: '"Courier New", Courier, serif' }}>
                                            {(item.quantity * item.price).toLocaleString('vi-VN')}đ
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Tổng hợp hóa đơn chi tiết */}
                        <div className="pt-2" style={{ fontFamily: '"Courier New", Courier, serif' }}>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Tạm tính:</span>
                                <span>{totalAmount.toLocaleString('vi-VN')}đ</span>
                            </div>
                            <div className="d-flex justify-content-between mb-3">
                                <span className="text-muted">Phí vận chuyển:</span>
                                <span>{shippingFee === 0 ? 'Miễn phí' : `${shippingFee.toLocaleString('vi-VN')}đ`}</span>
                            </div>

                            <div className="d-flex justify-content-between pt-3 mb-4 align-items-center" style={{ borderTop: '2px solid #433422' }}>
                                <span className="fw-bold h6 text-uppercase" style={{ fontFamily: 'Georgia, serif' }}>Tổng thanh toán:</span>
                                <span className="fw-bold" style={{ color: '#a74343', fontSize: '1.6rem' }}>
                                    {finalTotal.toLocaleString('vi-VN')}đ
                                </span>
                            </div>
                        </div>

                        {/* Nút đặt hàng tối thượng */}
                        <button
                            type="button"
                            className="btn w-100 py-3 fw-bold text-uppercase vintage-order-btn"
                            disabled={loading}
                            onClick={handleSubmitOrder}
                        >
                            {loading ? 'ĐANG KHỞI TẠO ĐƠN...' : 'XÁC NHẬN ĐẶT HÀNG'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Css Pop-art Vintage Style */}
            <style>{`
                .vintage-order-btn {
                    background-color: #2c5d63 !important;
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
                .vintage-order-btn:hover {
                    background-color: #a74343 !important;
                    box-shadow: 1px 1px 0px #433422;
                    transform: translate(3px, 3px);
                }
            `}</style>
        </div>
    );
};

export default Checkout;