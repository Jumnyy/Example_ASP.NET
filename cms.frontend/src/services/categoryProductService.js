import axiosClient from '../api/axiosClient';

const categoryProductService = {
    /**
     * Hàm lấy toàn bộ danh mục SẢN PHẨM từ Backend
     * Endpoint này kết nối tới CategoryProductController trong ASP.NET Core
     */
    getAllCategoryProducts: () => {
        // SỬA TẠI ĐÂY: Khớp chính xác với tên Controller (CategoryProducts)
        const url = '/CategoryProducts';
        return axiosClient.get(url);
    }
};

export default categoryProductService;