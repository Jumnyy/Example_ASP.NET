import React from 'react';

const CartTable = ({ cartItems, updateQuantity, removeItem }) => {
    return (
        <div className="card border-2 p-3 shadow-none" style={{ backgroundColor: '#ffffff', borderColor: '#433422', borderRadius: '4px', boxShadow: '5px 5px 0px #433422' }}>
            <table className="table align-middle mb-0" style={{ fontFamily: 'Georgia, serif', color: '#433422' }}>
                <thead>
                    <tr style={{ fontFamily: '"Courier New", Courier, serif', borderBottom: '2px solid #433422' }}>
                        <th className="text-uppercase small fw-bold">Sản phẩm</th>
                        <th className="text-uppercase small fw-bold">Giá</th>
                        <th className="text-uppercase small fw-bold" style={{ width: '135px' }}>Số lượng</th>
                        <th className="text-uppercase small fw-bold">Tổng</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {cartItems.map((item) => {
                        // --- ĐẢM BẢO AN TOÀN DATA ---
                        const productId = item.productId ?? item.ProductId ?? item.id ?? item.Id;
                        const productName = item.productName ?? item.ProductName ?? item.name ?? item.Name ?? 'Sản phẩm';
                        const price = item.price ?? item.Price ?? 0;
                        const quantity = item.quantity ?? item.Quantity ?? 1;

                        // Lấy số lượng tồn kho từ giỏ hàng
                        const stockQuantity = item.stockQuantity ?? item.StockQuantity ?? item.stock ?? item.Stock ?? item.soLuong ?? item.SoLuong ?? 0;
                        const imageUrl = item.imageUrl ?? item.ImageUrl;

                        const getProductImageUrl = () => {
                            if (!imageUrl) return "https://placehold.co/60/eadeca/7a685c?text=Solisz";
                            if (imageUrl.startsWith('http')) return imageUrl;

                            let cleanPath = imageUrl;
                            if (cleanPath.startsWith('/api')) {
                                cleanPath = cleanPath.replace('/api', '');
                            }
                            const safePath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
                            return `https://localhost:7119${safePath}`;
                        };

                        return (
                            <tr key={productId} style={{ borderBottom: '1px dashed #eadeca' }}>
                                <td>
                                    <div className="d-flex align-items-center py-2">
                                        <img
                                            src={getProductImageUrl()}
                                            alt={productName}
                                            className="me-3"
                                            style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #433422' }}
                                        />
                                        <div>
                                            <span className="fw-bold d-block" style={{ color: '#433422' }}>{productName}</span>
                                            <small className="text-muted italic small">Còn lại: {stockQuantity}</small>
                                        </div>
                                    </div>
                                </td>

                                <td style={{ fontFamily: '"Courier New", Courier, serif' }}>
                                    {Number(price).toLocaleString('vi-VN')}đ
                                </td>

                                <td>
                                    <div className="input-group input-group-sm border-2" style={{ border: '1px solid #433422', borderRadius: '4px', overflow: 'hidden' }}>
                                        {/* Nút Giảm */}
                                        <button
                                            className="btn border-0 px-2 fw-bold"
                                            style={{ backgroundColor: '#eadeca', color: '#433422' }}
                                            onClick={() => updateQuantity(productId, quantity - 1, stockQuantity)}
                                            disabled={quantity <= 1}
                                        >
                                            -
                                        </button>

                                        <input
                                            type="text"
                                            className="form-control text-center bg-white border-0 fw-bold"
                                            style={{ fontFamily: '"Courier New", Courier, serif', color: '#433422', maxWidth: '40px' }}
                                            value={quantity}
                                            readOnly
                                        />

                                        {/* Nút Tăng - Khóa nếu vượt quá số lượng tồn kho */}
                                        <button
                                            className="btn border-0 px-2 fw-bold"
                                            style={{ backgroundColor: '#eadeca', color: '#433422' }}
                                            onClick={() => updateQuantity(productId, quantity + 1, stockQuantity)}
                                            disabled={quantity >= Number(stockQuantity)}
                                        >
                                            +
                                        </button>
                                    </div>
                                </td>

                                <td className="fw-bold" style={{ fontFamily: '"Courier New", Courier, serif', color: '#a74343' }}>
                                    {(Number(price) * Number(quantity)).toLocaleString('vi-VN')}đ
                                </td>

                                <td>
                                    <button
                                        className="btn btn-sm text-uppercase small fw-bold vintage-trash-btn"
                                        style={{ color: '#a74343', fontFamily: '"Courier New", Courier, serif', fontSize: '0.8rem' }}
                                        onClick={() => removeItem(productId)}
                                    >
                                        <i className="fa-solid fa-trash me-1"></i> Bỏ
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <style>{`
                .vintage-trash-btn {
                    border: 1px solid transparent;
                    transition: all 0.2s ease;
                }
                .vintage-trash-btn:hover {
                    border-color: #a74343;
                    background-color: #fff1f1;
                    border-radius: 4px;
                }
            `}</style>
        </div>
    );
};

export default CartTable;