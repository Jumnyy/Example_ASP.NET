import axiosClient from '../api/axiosClient';

const orderService = {
    /**
     * 1. API ĐẶT HÀNG (CHECKOUT)
     */
    checkout: async (checkoutData) => {
        try {
            // Đảm bảo chữ Orders viết hoa khớp với tên Controller bên C# (OrdersController)
            const response = await axiosClient.post('/Orders/checkout', checkoutData);
            return response.data; // 🔥 LƯU Ý: Phải .data để lấy dữ liệu trả về từ Axios
        } catch (error) {
            console.error("Lỗi khi xử lý đặt hàng:", error);
            throw error;
        }
    },

    /**
     * 2. LẤY LỊCH SỬ MUA HÀNG THEO KHÁCH HÀNG (Truyền ID)
     */
    getOrdersByCustomer: async (customerId) => {
        try {
            const response = await axiosClient.get(`/Orders/customer/${customerId}`);
            return response.data || [];
        } catch (error) {
            console.error(`Lỗi khi lấy lịch sử đơn hàng của khách mã ${customerId}:`, error);
            return [];
        }
    },

    /**
     * 3. LẤY CHI TIẾT 1 ĐƠN HÀNG
     */
    getOrderDetail: async (orderId) => {
        try {
            const response = await axiosClient.get(`/Orders/${orderId}`);
            return response.data;
        } catch (error) {
            console.error(`Lỗi khi lấy chi tiết đơn hàng mã ${orderId}:`, error);
            return null;
        }
    },

    /**
     * 4. LẤY LỊCH SỬ ĐƠN HÀNG QUA COOKIE/TOKEN (Tự bóc tách ở Backend)
     */
    getMyOrders: async () => {
        try {
            // Sửa lại thành /Orders/my-orders cho đồng bộ chữ Hoa đầu từ với các hàm trên
            const response = await axiosClient.get('/Orders/my-orders');
            return response.data;
        } catch (error) {
            console.error("Lỗi khi lấy danh sách đơn hàng cá nhân:", error);
            throw error;
        }
    }
};

export default orderService;