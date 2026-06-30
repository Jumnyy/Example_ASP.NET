// src/context/CartContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify'; // Import bộ bắn thông báo

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const localData = localStorage.getItem('solisz_cart');
        return localData ? JSON.parse(localData) : [];
    });

    useEffect(() => {
        localStorage.setItem('solisz_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    // Hàm thêm sản phẩm tích hợp kiểm tra tồn kho & thông báo
    const addToCart = (product) => {
        const id = product.id ?? product.Id;
        const name = product.name ?? product.Name ?? 'Sản phẩm';
        const price = product.price ?? product.Price ?? 0;
        const imageUrl = product.imageUrl ?? product.ImageUrl;

        // Nhận diện linh hoạt trường tồn kho từ API .NET của bạn
        const maxStock = product.stockQuantity ?? product.StockQuantity ?? product.stock ?? 0;

        // Trường hợp 1: Ngay từ đầu sản phẩm trong kho đã hết (bằng 0)
        if (maxStock <= 0) {
            toast.error(`Món "${name}" hiện đã hết sạch hàng rồi ạ!`, {
                position: "top-right",
                autoClose: 3000,
                theme: "colored"
            });
            return;
        }

        setCartItems((prevItems) => {
            const isExist = prevItems.find(item => item.id === id);

            if (isExist) {
                // Trường hợp 2: Sản phẩm đã có trong giỏ, check xem nếu tăng thêm 1 thì có vượt tồn kho không
                if (isExist.quantity >= maxStock) {
                    toast.warning(`Tiệm chỉ còn lại đúng ${maxStock} sản phẩm "${name}" thôi ạ!`, {
                        position: "top-right",
                        autoClose: 3000
                    });
                    return prevItems; // Giữ nguyên giỏ hàng, không tăng thêm
                }

                toast.success(`Đã tăng số lượng món "${name}" trong giỏ!`, {
                    position: "top-right",
                    autoClose: 2000
                });

                return prevItems.map(item =>
                    item.id === id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }

            // Trường hợp 3: Món mới hoàn toàn và kho vẫn còn hàng
            toast.success(`Đã gói ghém món "${name}" vào giỏ tay!`, {
                position: "top-right",
                autoClose: 2000
            });

            return [...prevItems, { id, name, price, imageUrl, quantity: 1, maxStock }];
        });
    };

    // Hàm cập nhật số lượng tại trang giỏ hàng (Cũng phải check tồn kho ở đây)
    const updateQuantity = (id, amount) => {
        setCartItems(prevItems =>
            prevItems.map(item => {
                if (item.id === id) {
                    const newQty = item.quantity + amount;

                    // Nếu bấm cộng (+) mà vượt quá giới hạn tồn kho được lưu
                    if (amount > 0 && newQty > item.maxStock) {
                        toast.warning(`Món này tiệm chỉ còn tối đa ${item.maxStock} sản phẩm thôi.`, {
                            position: "top-right",
                            autoClose: 2000
                        });
                        return item;
                    }

                    return newQty > 0 ? { ...item, quantity: newQty } : item;
                }
                return item;
            })
        );
    };

    const removeFromCart = (id) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
        toast.info("Đã nhấc món đồ ra khỏi giỏ tay.", { position: "top-right", autoClose: 2000 });
    };

    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, cartCount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);