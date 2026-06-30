import axiosClient from '../api/axiosClient';

const postService = {
    // 1. Lấy toàn bộ bài viết
    getAllPosts: () => {
        // Đảm bảo đồng bộ endpoint số nhiều /posts
        return axiosClient.get('/posts');
    },

    // 2. Lấy bài viết theo danh mục cụ thể
    getPostsByCategory: (categoryId) => {
        return axiosClient.get(`/posts/category/${categoryId}`);
    },

    // 3. Lấy chi tiết 1 bài viết
    getPostDetail: (id) => {
        // Ép kiểu ID về chuỗi hoặc số rõ ràng để tránh bóc tách URL lỗi
        return axiosClient.get(`/posts/${id}`);
    },
};

export default postService;