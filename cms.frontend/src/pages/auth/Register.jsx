import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/customerService';
import Swal from 'sweetalert2';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        address: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Mật khẩu nhập lại không trùng khớp!');
            return;
        }

        setLoading(true);
        try {
            await authService.register({
                fullName: formData.fullName,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                address: formData.address
            });

            // 🌟 Thay alert thô sơ bằng SweetAlert2 phong cách Vintage giống Login
            Swal.fire({
                title: 'ĐĂNG KÝ THÀNH CÔNG! 🎉',
                text: 'Tài khoản của bạn đã được khởi tạo. Đăng nhập ngay nhé!',
                icon: 'success',
                background: '#eadeca',
                color: '#433422',
                confirmButtonColor: '#2c5d63',
                timer: 2500
            });

            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '80vh', fontFamily: 'Georgia, serif', color: '#433422' }}>

            {/* Tích hợp CSS CSS chuẩn phong cách Vintage Pop-art đồng bộ */}
            <style>
                {`
                .vintage-card {
                    background-color: #f4ebd0 !important;
                    border: 2px solid #433422 !important;
                    border-radius: 4px !important;
                    box-shadow: 6px 6px 0px #433422 !important;
                }
                .vintage-input {
                    border: 2px solid #433422 !important;
                    border-radius: 4px !important;
                    background-color: #ffffff !important;
                    color: #433422 !important;
                }
                .vintage-input:focus {
                    background-color: #ffffff !important;
                    box-shadow: none !important;
                    border-color: #D9643A !important;
                }
                .vintage-btn {
                    background-color: #2c5d63 !important; /* Đổi màu xanh Teal chủ đạo cho Đăng ký để phân biệt với Đăng nhập */
                    color: #ffffff !important;
                    font-size: 1rem;
                    font-weight: 700;
                    letter-spacing: 1px;
                    font-family: "Courier New", Courier, serif;
                    border: 2px solid #433422 !important;
                    border-radius: 4px !important;
                    box-shadow: 4px 4px 0px #433422;
                    transition: all 0.15s ease;
                }
                .vintage-btn:hover {
                    background-color: #D9643A !important;
                    box-shadow: 1px 1px 0px #433422;
                    transform: translate(3px, 3px);
                }
                .vintage-btn:disabled {
                    background-color: #7a685c !important;
                    cursor: not-allowed;
                }
                .vintage-link {
                    color: #D9643A;
                    font-family: "Courier New", Courier, serif;
                    transition: color 0.2s ease;
                }
                .vintage-link:hover {
                    color: #2c5d63;
                    text-decoration: underline !important;
                }
                `}
            </style>

            <div className="card vintage-card p-2" style={{ maxWidth: '520px', width: '100%' }}>
                <div className="card-body p-4 p-md-5">

                    {/* Tiêu đề */}
                    <div className="text-center mb-4">
                        <h2 className="fw-bold text-uppercase" style={{ letterSpacing: '2px', fontFamily: '"Courier New", Courier, serif', textShadow: '1px 1px 0px #ecdcb9' }}>
                            <i className="fa-solid fa-user-plus me-2"></i> Tạo tài khoản
                        </h2>
                        <div style={{ width: '50px', height: '3px', backgroundColor: '#433422', margin: '10px auto 0' }}></div>
                    </div>

                    {/* Khung thông báo lỗi */}
                    {error && (
                        <div className="alert alert-danger small py-2 text-center fw-bold mb-4 border-2" style={{ borderColor: '#c0392b', color: '#c0392b', backgroundColor: '#fceade', borderRadius: '4px' }}>
                            <i className="fa-solid fa-triangle-exclamation me-1"></i> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Họ và tên */}
                        <div className="mb-3">
                            <label className="form-label fw-bold small text-uppercase" style={{ fontFamily: '"Courier New", Courier, serif' }}>Họ và tên *</label>
                            <input type="text" className="form-control vintage-input px-3 py-2 shadow-none" name="fullName" placeholder="Nguyễn Văn A" value={formData.fullName} onChange={handleChange} required />
                        </div>

                        {/* Email */}
                        <div className="mb-3">
                            <label className="form-label fw-bold small text-uppercase" style={{ fontFamily: '"Courier New", Courier, serif' }}>Địa chỉ Email *</label>
                            <input type="email" className="form-control vintage-input px-3 py-2 shadow-none" name="email" placeholder="example@gmail.com" value={formData.email} onChange={handleChange} required />
                        </div>

                        {/* Mật khẩu & Nhập lại */}
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold small text-uppercase" style={{ fontFamily: '"Courier New", Courier, serif' }}>Mật khẩu *</label>
                                <input type="password" className="form-control vintage-input px-3 py-2 shadow-none" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold small text-uppercase" style={{ fontFamily: '"Courier New", Courier, serif' }}>Xác nhận lại *</label>
                                <input type="password" className="form-control vintage-input px-3 py-2 shadow-none" name="confirmPassword" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} required />
                            </div>
                        </div>

                        {/* Số điện thoại */}
                        <div className="mb-3">
                            <label className="form-label fw-bold small text-uppercase" style={{ fontFamily: '"Courier New", Courier, serif' }}>Số điện thoại</label>
                            <input type="tel" className="form-control vintage-input px-3 py-2 shadow-none" name="phone" placeholder="0901234567" value={formData.phone} onChange={handleChange} />
                        </div>

                        {/* Địa chỉ */}
                        <div className="mb-4">
                            <label className="form-label fw-bold small text-uppercase" style={{ fontFamily: '"Courier New", Courier, serif' }}>Địa chỉ nhận bánh</label>
                            <input type="text" className="form-control vintage-input px-3 py-2 shadow-none" name="address" placeholder="Số nhà, tên đường, quận/huyện..." value={formData.address} onChange={handleChange} />
                        </div>

                        {/* Nút gửi form */}
                        <button type="submit" className="btn w-100 py-2.5 mb-3 vintage-btn" disabled={loading}>
                            {loading ? 'ĐANG KHỞI TẠO TÀI KHOẢN...' : 'XÁC NHẬN ĐĂNG KÝ'}
                        </button>
                    </form>

                    {/* Chuyển hướng quay lại Đăng nhập */}
                    <div className="text-center mt-4 small" style={{ borderTop: '1px dashed #433422', paddingTop: '15px' }}>
                        <span className="text-muted">Bạn đã có tài khoản rồi? </span>
                        <Link to="/login" className="text-decoration-none fw-bold vintage-link">
                            Đăng nhập tại đây <i className="fa-solid fa-arrow-right-long ms-1"></i>
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Register;