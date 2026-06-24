import axiosClient from '../api/axiosClient';

const postService = {
    // 1. Lấy toàn bộ bài viết (Dùng ở Trang chủ / Trang danh sách tin tức)
    // Trả về object chứa: Id, Title, Content, ImageUrl, CreatedDate, CategoryName
    getAllPosts: () => {
        return axiosClient.get('/posts');
    },

    // 2. Lấy bài viết theo danh mục cụ thể
    // Trả về object chứa: Id, Title, Content, ImageUrl, CreatedDate
    getPostsByCategory: (categoryId) => {
        return axiosClient.get(`/posts/category/${categoryId}`);
    },

    // 3. Lấy chi tiết 1 bài viết (Dùng ở trang chi tiết Blog)
    // Trả về toàn bộ Object Post đầy đủ các trường từ database
    getPostDetail: (id) => {
        return axiosClient.get(`/posts/${id}`);
    },
};

export default postService;