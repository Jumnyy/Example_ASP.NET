import React, { useState, useEffect } from 'react';

function PostList() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Tu dong goi API lay toan bo Bai viet khi component duoc tai
    useEffect(() => {
        fetch('https://localhost:7119/api/Posts')
            .then(res => {
                if (!res.ok) throw new Error("Loi mang bai viet: " + res.status);
                return res.json();
            })
            .then(data => {
                setPosts(data || []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Loi API Posts:", err);
                setLoading(false);
            });
    }, []);

    // Ham ??nh dang ngay thang nam (vi du: 2026-06-12 -> 12 / 06 / 2026)
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day} / ${month} / ${year}`;
    };

    // Ham xoa bo cac the HTML (nhu <p>, <div>, <strong>) de lay chu thuan tuy lam mo ta ngan
    const stripHtml = (html) => {
        if (!html) return "";
        return html.replace(/<.*?>/g, '');
    };

    // Neu dang tai du lieu tu API .NET, hien thi thong bao cho
    if (loading) {
        return (
            <div className="text-center text-muted py-5">
                <div className="spinner-border text-secondary mb-2" role="status"></div>
                <div className="fst-italic">Dang tai danh sach bai viet tu Server...</div>
            </div>
        );
    }

    // Neu API tra ve danh sach bai viet trong
    if (posts.length === 0) {
        return (
            <div className="text-center text-muted py-5 fst-italic">
                Chua co bai viet nao duoc xuat ban tren Server.
            </div>
        );
    }

    return (
        <div className="row">
            <style>{`
                .luxury-card { border: 1px solid #e8e3d7; border-radius: 0px; background-color: #fdfbf7 !important; transition: all 0.4s ease; }
                .luxury-card:hover { transform: translateY(-8px); box-shadow: 0 15px 30px rgba(61, 49, 42, 0.12) !important; border-color: #556b2f; }
                .btn-outline-gold { background-color: transparent; color: #3d312a; border: 1px solid #3d312a; border-radius: 0px; letter-spacing: 1px; font-size: 0.8rem; text-transform: uppercase; font-weight: 700; transition: all 0.3s ease; text-decoration: none; display: inline-block; }
                .btn-outline-gold:hover { background-color: #3d312a; color: #fffdec; }
                .text-truncate-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; height: 42px; }
            `}</style>

            {posts.map((item) => {
                // Xu ly linh hoat ca chu hoa va chu thuong tuong thich thuoc tinh API .NET
                const postId = item.id || item.Id;
                const postTitle = item.title || item.Title;
                const postImg = item.imageUrl || item.ImageUrl || 'https://via.placeholder.com/400x250';
                const postContent = item.content || item.Content;
                const postDate = item.createdDate || item.CreatedDate;

                return (
                    <div className="col-md-4 mb-4" key={postId}>
                        <div className="card luxury-card h-100 shadow-sm">
                            <img
                                src={postImg}
                                className="card-img-top w-100"
                                style={{ height: '220px', objectFit: 'cover' }}
                                alt={postTitle}
                            />
                            <div className="card-body p-4 d-flex flex-column justify-content-between">
                                <div>
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <span className="badge text-uppercase px-2 py-1" style={{ fontSize: '0.65rem', backgroundColor: '#556b2f', borderRadius: 0 }}>
                                            Tap chi
                                        </span>
                                        <small className="text-muted">{formatDate(postDate)}</small>
                                    </div>
                                    <h5 className="card-title text-dark fw-bold mb-2" style={{ fontSize: '1.1rem' }}>
                                        {postTitle}
                                    </h5>
                                    <div className="card-text text-muted small text-truncate-2">
                                        {stripHtml(postContent)}
                                    </div>
                                </div>
                                <div className="pt-3">
                                    <a href={`/Post/Details/${postId}`} className="btn btn-outline-gold w-100 py-2 text-center">
                                        Kham Pha
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default PostList;