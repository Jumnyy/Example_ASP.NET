// src/services/categoriesProductService.js
import axiosClient from '../api/axiosClient'; // Hoặc file cấu hình axios của bạn

const categoriesProductService = {
    // Gọi chính xác đến hàm [HttpGet] GetAll() của CategoriesProductController
    getMenuCategories: () => {
        return axiosClient.get('/categoriesproduct');
    }
};

export default categoriesProductService;