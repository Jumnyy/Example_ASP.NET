import React, { useState, useEffect } from 'react';
import orderService from '../../services/orderService';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const BACKEND_URL = 'https://localhost:7119'; // 🌟 Đồng bộ cổng với backend của bạn

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const response = await orderService.getMyOrders();
                setOrders(response || []);
            } catch (error) {
                console.error("Lỗi khi tải lịch sử đơn hàng:", error);
                alert("Lỗi tải đơn hàng. Vui lòng thử lại sau.");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const getStatusBadge = (status) => {
        switch (status) {
            case 0:
                return <span className="badge px-3 py-2 border border-2 text-dark" style={{ backgroundColor: '#f1c40f', borderColor: '#433422', borderRadius: '4px' }}>Chờ xác nhận</span>;
            case 1:
                return <span className="badge px-3 py-2 border border-2 text-white" style={{ backgroundColor: '#2980b9', borderColor: '#433422', borderRadius: '4px' }}>Đang xử lý</span>;
            case 2:
                return <span className="badge px-3 py-2 border border-2 text-white" style={{ backgroundColor: '#27ae60', borderColor: '#433422', borderRadius: '4px' }}>Đã giao</span>;
            case 3:
                return <span className="badge px-3 py-2 border border-2 text-white" style={{ backgroundColor: '#c0392b', borderColor: '#433422', borderRadius: '4px' }}>Đã hủy</span>;
            default:
                return <span className="badge px-3 py-2 border border-2 text-white" style={{ backgroundColor: '#7f8c8d', borderColor: '#433422', borderRadius: '4px' }}>Không xác định</span>;
        }
    };

    if (loading) {
        return (
            <div className="container py-5 text-center" style={{ fontFamily: 'Georgia, serif', color: '#433422' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Đang tải...</span>
                </div>
                <p className="mt-2 fw-bold">Đang lục tìm lịch sử đơn hàng...</p>
            </div>
        );
    }

    return (
        <div className="container my-5" style={{ fontFamily: 'Georgia, serif', color: '#433422' }}>
            <h2 className="mb-4 fw-bold text-uppercase" style={{ letterSpacing: '2px', fontFamily: '"Courier New", Courier, serif', textShadow: '1px 1px 0px #ecdcb9' }}>
                <i className="fa-solid fa-clock-rotate-left me-2"></i> Lịch sử đơn hàng
            </h2>

            {orders.length === 0 ? (
                <div className="card border-2 p-5 text-center" style={{ borderColor: '#433422', borderRadius: '4px', backgroundColor: '#f4ebd0' }}>
                    <h5 className="fw-bold mb-3">Bạn chưa có đơn hàng nào tại tiệm bánh!</h5>
                    <p className="text-muted mb-0">Hãy quay lại trang chủ chọn cho mình những chiếc bánh thật ngon nhé.</p>
                </div>
            ) : (
                <div className="row">
                    {orders.map((order) => (
                        <div key={order.id} className="col-12 mb-4">
                            {/* Card thiết kế Vintage Pop-art đồng bộ */}
                            <div className="card border-2 p-4" style={{ borderColor: '#433422', borderRadius: '4px', boxShadow: '5px 5px 0px #433422' }}>

                                <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 pb-2" style={{ borderBottom: '2px solid #433422' }}>
                                    <h5 className="fw-bold m-0 text-uppercase" style={{ fontFamily: '"Courier New", Courier, serif' }}>
                                        Mã Đơn Hàng #{order.id}
                                    </h5>
                                    <div>{getStatusBadge(order.status)}</div>
                                </div>

                                <div className="row small mb-3" style={{ fontFamily: '"Courier New", Courier, serif' }}>
                                    <div className="col-md-6">
                                        <strong>Ngày đặt:</strong> {new Date(order.orderDate).toLocaleString('vi-VN')}
                                    </div>
                                    <div className="col-md-6 text-md-end">
                                        <strong>Thông tin & Ghi chú:</strong> {order.notes || "Không có"}
                                    </div>
                                </div>

                                {/* Danh sách sản phẩm trong đơn */}
                                <div className="mb-3">
                                    {order.orderDetails?.map((item, index) => (
                                        <div key={index} className="d-flex align-items-center mb-3 pb-2" style={{ borderBottom: '1px dashed #433422' }}>
                                            <img
                                                src={item.imageUrl ? (item.imageUrl.startsWith('http') ? item.imageUrl : `${BACKEND_URL}${item.imageUrl}`) : 'https://via.placeholder.com/60x60?text=Cake'}
                                                alt={item.productName || "Sản phẩm"}
                                                style={{
                                                    width: '60px',
                                                    height: '60px',
                                                    objectFit: 'cover',
                                                    borderRadius: '4px',
                                                    border: '1px solid #433422'
                                                }}
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/60x60?text=Cake';
                                                }}
                                                className="me-3"
                                            />

                                            <div className="flex-grow-1">
                                                <div className="fw-bold small">{item.productName || "Sản phẩm"}</div>
                                                <small className="text-muted" style={{ fontFamily: '"Courier New", Courier, serif' }}>
                                                    Số lượng: {item.quantity} x {Number(item.unitPrice || item.price).toLocaleString('vi-VN')}đ
                                                </small>
                                            </div>

                                            <div className="fw-bold" style={{ fontFamily: '"Courier New", Courier, serif' }}>
                                                {((item.unitPrice || item.price) * item.quantity).toLocaleString('vi-VN')}đ
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Tổng tiền */}
                                <div className="text-end pt-2 d-flex justify-content-between align-items-center">
                                    <span className="text-muted small" style={{ fontFamily: '"Courier New", Courier, serif' }}>Hình thức: Thanh toán khi nhận hàng (COD)</span>
                                    <h5 className="fw-bold m-0" style={{ color: '#a74343' }}>
                                        Tổng tiền: {order.orderDetails?.reduce((sum, item) => sum + ((item.unitPrice || item.price) * item.quantity), 0).toLocaleString('vi-VN')}đ
                                    </h5>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistory;