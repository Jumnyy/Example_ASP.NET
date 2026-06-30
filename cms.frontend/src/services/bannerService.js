// Sinh vien : Nguyen Tan Thien
// MSSV : 2123110126
// Lop: CCQ2311D
// Ngay Tao: 26 / 06 / 2026

import axiosClient from '../api/axiosClient';

const bannerService = {
    // 1. Lấy toàn bộ danh sách banner đang bật (Status == 1) hiển thị ở Frontend
    // Endpoint sẽ gọi đến: GET /api/Banners
    getActiveBanners: () => {
        return axiosClient.get('/Banners');
    },

    // 2. Lấy chi tiết 1 banner bằng ID (Nếu hệ thống Frontend cần dùng)
    // Endpoint sẽ gọi đến: GET /api/Banners/{id}
    getBannerDetail: (id) => {
        return axiosClient.get(`/Banners/${id}`);
    }
};

export default bannerService;