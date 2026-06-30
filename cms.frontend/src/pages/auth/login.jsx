import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/customerService';
import Swal from 'sweetalert2';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authService.login({
                email: formData.email,
                password: formData.password
            });
            const data = response;

            if (data.customerId) {
                // 1. Lưu dữ liệu vào localStorage
                localStorage.setItem('customer', JSON.stringify({
                    customerId: data.customerId,
                    fullName: data.fullName,
                    email: formData.email
                }));

                // 2. Bắn sự kiện báo Header
                window.dispatchEvent(new Event('userLoggedIn'));

                Swal.fire({
                    title: 'ĐĂNG NHẬP THÀNH CÔNG 🎉',
                    text: 'Chào mừng bạn quay trở lại với tiệm bánh!',
                    icon: 'success',
                    background: '#eadeca',
                    color: '#433422',
                    timer: 1500,
                    showConfirmButton: false,
                    confirmButtonColor: '#2c5d63'
                });

                // 3. Điều hướng về trang chủ
                navigate('/');
            } else {
                setError("Có lỗi xảy ra khi xác thực tài khoản.");
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Email hoặc mật khẩu không chính xác!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '75vh', fontFamily: 'Georgia, serif', color: '#433422' }}>

            {/* Tích hợp CSS Custom cho nút bấm và form chuẩn phong cách Vintage */}
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
                    background-color: #D9643A !important;
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
                    background-color: #2c5d63 !important;
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

            <div className="card vintage-card p-2" style={{ maxWidth: '420px', width: '100%' }}>
                <div className="card-body p-4 p-md-5">

                    {/* Tiêu đề góc cạnh */}
                    <div className="text-center mb-4">
                        <h2 className="fw-bold text-uppercase" style={{ letterSpacing: '2px', fontFamily: '"Courier New", Courier, serif', textShadow: '1px 1px 0px #ecdcb9' }}>
                            <i className="fa-solid fa-right-to-bracket me-2"></i> Đăng nhập
                        </h2>
                        <div style={{ width: '50px', height: '3px', backgroundColor: '#433422', margin: '10px auto 0' }}></div>
                    </div>

                    {/* Khung báo lỗi đồng bộ */}
                    {error && (
                        <div className="alert alert-danger small py-2 text-center fw-bold mb-4 border-2" style={{ borderColor: '#c0392b', color: '#c0392b', backgroundColor: '#fceade', borderRadius: '4px' }}>
                            <i className="fa-solid fa-triangle-exclamation me-1"></i> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Khung nhập liệu Email */}
                        <div className="mb-3">
                            <label className="form-label fw-bold small text-uppercase" style={{ fontFamily: '"Courier New", Courier, serif' }}>
                                Địa chỉ Email
                            </label>
                            <input
                                type="email"
                                className="form-control vintage-input px-3 py-2 shadow-none"
                                name="email"
                                placeholder="example@gmail.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Khung nhập liệu Mật khẩu */}
                        <div className="mb-4">
                            <label className="form-label fw-bold small text-uppercase" style={{ fontFamily: '"Courier New", Courier, serif' }}>
                                Mật khẩu
                            </label>
                            <input
                                type="password"
                                className="form-control vintage-input px-3 py-2 shadow-none"
                                name="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Nút bấm Đăng nhập */}
                        <button
                            type="submit"
                            className="btn w-100 py-2 mb-3 vintage-btn"
                            disabled={loading}
                        >
                            {loading ? 'ĐANG XỬ LÝ...' : 'ĐĂNG NHẬP'}
                        </button>
                    </form>

                    {/* Vùng chuyển hướng tài khoản */}
                    <div className="text-center mt-4 small" style={{ borderTop: '1px dashed #433422', paddingTop: '15px' }}>
                        <span className="text-muted">Bạn chưa có tài khoản? </span>
                        <Link to="/register" className="text-decoration-none fw-bold vintage-link">
                            Đăng ký ngay <i className="fa-solid fa-arrow-right-long ms-1"></i>
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Login;