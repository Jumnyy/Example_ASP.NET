/*import React from 'react';
import ProductCard from '../../components/ProductCard';

export default function ProductList({ products }) {
    return (
        *//* - Giữ nguyên lưới xl:grid-cols-4 (4 sản phẩm 1 hàng).
          - Thêm justify-items-center để các ô sản phẩm nhỏ luôn căn giữa cột gọn gàng.
        *//*
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 pb-12 justify-items-center animate-fadeIn">
            {products.map((product) => {
                const id = product.id ?? product.Id;

                return (
                    <div
                        key={id}
                        *//* SỬA ĐỔI TẠI ĐÂY:
                          - Giảm padding từ p-3 xuống p-2.5 (hoặc p-2 nếu bạn muốn nhỏ nữa)
                          - Thêm w-full max-w-[240px] (Khống chế chiều rộng tối đa của mỗi ô là 240px thay vì bung hết cỡ)
                        *//*
                        className="w-full max-w-[240px] bg-[#fbf9f4] border-2 border-[#433422] rounded-md p-2.5 shadow-[3px_3px_0px_#433422] transform transition-all duration-200 hover:-translate-y-1 hover:shadow-[5px_5px_0px_#433422]"
                    >
                        <ProductCard product={product} />
                    </div>
                );
            })}
        </div>
    );
}*/