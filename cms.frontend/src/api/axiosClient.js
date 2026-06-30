import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'https://localhost:7119/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// 🔥 THÊM ĐOẠN NÀY: Can thiệp TRƯỚC KHI request gửi đi để đính kèm Token
axiosClient.interceptors.request.use(
    (config) => {
        // Lấy token từ localStorage (hãy đổi chữ 'token' thành tên biến bạn lưu lúc Login thành công)
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor can thiep vao du lieu sau khi nhận phan hoi
axiosClient.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        console.error('Loi ket noi API:', error.message);
        return Promise.reject(error);
    }
);

export default axiosClient;