import axios from 'axios';

// Khoi tao mot thuc the axios voi cau hinh base chung
const axiosClient = axios.create({
    baseURL: 'https://localhost:7119/api', // Cong Port Backend thuc te cua ban: 7119
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // Thoi gian toi da cho phan hoi tu server (10 giay)
});

// Interceptor can thiep vao du lieu truoc khi tra ve cho component
axiosClient.interceptors.response.use(
    (response) => {
        // Neu phan hoi thanh cong, boc tach lay thang cuc data ben trong du lieu JSON
        return response.data;
    },
    (error) => {
        // Xu ly loi tap trung tai day (Vi du: Server sap, loi 404, loi 500)
        console.error('Loi ket noi API:', error.message);
        return Promise.reject(error);
    }
);

export default axiosClient;