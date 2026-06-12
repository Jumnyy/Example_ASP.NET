import React, { useState, useEffect } from 'react';

function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Tu dong goi API lay toan bo San pham khi component duoc tai
    useEffect(() => {
        fetch('https://localhost:7119/api/Products')
            .then(res => {
                if (!res.ok) throw new Error("Loi mang san pham: " + res.status);
                return res.json();
            })
            .then(data => {
                setProducts(data || []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Loi API Products:", err);
                setLoading(false);
            });
    }, []);

    // Ham ??nh dang gia tien VND (vi du: 150000 -> 150.000 ?)
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    // Neu dang tai du lieu tu API .NET, hien thi hieu ung cho
    if (loading) {
        return (
            <div className="text-center text-muted py-5">
                <div className="spinner-border text-secondary mb-2" role="status"></div>
                <div className="fst-italic">Dang tai danh sach san pham tu Server...</div>
            </div>
        );
    }

    // Neu API tra ve danh sach trong
    if (products.length === 0) {
        return (
            <div className="text-center text-muted py-5 fst-italic">
                Khong co du lieu san pham nao duoc tim thay tren Server.
            </div>
        );
    }

    // Giao dien hien thi danh sach san pham theo dang Luoi (Grid)
    return (
        <div className="row">
            <style>{`
                .luxury-card { border: 1px solid #e8e3d7; border-radius: 0px; background-color: #fdfbf7 !important; transition: all 0.4s ease; }
                .luxury-card:hover { transform: translateY(-8px); box-shadow: 0 15px 30px rgba(61, 49, 42, 0.12) !important; border-color: #556b2f; }
                .btn-gold { background-color: #556b2f; color: #fffdec; border: 1px solid #485c28; border-radius: 0px; letter-spacing: 1px; font-size: 0.8rem; text-transform: uppercase; font-weight: 700; transition: all 0.3s ease; text-decoration: none; display: inline-block; }
                .btn-gold:hover { background-color: #3d312a; border-color: #2b221d; color: #f5ebd9; }
                .gold-text { font-family: 'Playfair Display', serif; color: #8b4513; }
            `}</style>

            {products.map((prod) => {
                // Xu ly linh hoat ca thuoc tinh viet thuong (id) va viet hoa (Id) tuy theo cau hinh API C#
                const pId = prod.id || prod.Id;
                const pName = prod.name || prod.Name;
                const pPrice = prod.price || prod.Price;
                const pImg = prod.imageUrl || prod.ImageUrl || 'https://via.placeholder.com/300';

                return (
                    <div className="col-lg-3 col-md-6 mb-4" key={pId}>
                        <div className="card luxury-card h-100 shadow-sm">
                            <div className="overflow-hidden bg-light position-relative">
                                <img
                                    src={pImg}
                                    className="card-img-top w-100"
                                    style={{ height: '280px', objectFit: 'cover' }}
                                    alt={pName}
                                />
                                <span className="position-absolute top-0 start-0 text-white px-2 py-1 small" style={{ fontSize: '0.7rem', backgroundColor: '#3d312a' }}>
                                    NEW
                                </span>
                            </div>
                            <div className="card-body d-flex flex-column justify-content-between p-4">
                                <div className="text-center">
                                    <h5 className="card-title text-dark fw-bold mb-2" style={{ fontSize: '1.05rem' }}>
                                        {pName}
                                    </h5>
                                    <p className="gold-text fw-bold mb-3">
                                        {formatPrice(pPrice)}
                                    </p>
                                </div>
                                <a href={`/Product/Details/${pId}`} className="btn btn-gold w-100 py-2 text-center">
                                    So Huu Ngay
                                </a>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default ProductList;