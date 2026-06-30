import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import postService from '../../services/blogService'; // Gọi qua service đã gom cụm cho sạch code

const BlogDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPostDetail = async () => {
            try {
                setLoading(true);
                // Gọi API lấy chi tiết bài viết thông qua postService của bạn
                const response = await postService.getPostDetail(id);
                // Phòng trường hợp axiosClient của bạn có hoặc không tự giải nén .data
                setPost(response.data || response);
                setError(null);
            } catch (err) {
                console.error("Lỗi khi tải chi tiết bài viết:", err);
                setError("Không thể lật mở mẩu chuyện này lúc này. Thử lại sau nhé!");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchPostDetail();
        }
    }, [id]);

    // Xử lý đường dẫn ảnh an toàn từ local backend
    const getImageUrl = (imgPath) => {
        if (!imgPath) return "https://placehold.co/800x450/eadeca/7a685c?text=Solisz+Story";
        if (imgPath.startsWith('http')) return imgPath;
        const safePath = imgPath.startsWith('/') ? imgPath : `/${imgPath}`;
        return `https://localhost:7119${safePath}`; // Đưa về port đồng bộ của hệ thống
    };

    // Định dạng ngày tháng mộc mạc kiểu Pháp cổ
    const formatVintageDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
    };

    // Giao diện trạng thái đang tải dữ liệu
    if (loading) {
        return (
            <div className="container my-5 text-center py-5" style={{ fontFamily: '"Courier New", Courier, serif' }}>
                <div className="spinner-border text-secondary mb-3" role="status"></div>
                <p style={{ color: '#433422', fontStyle: 'italic' }}>Tiệm đang lật giở từng trang nhật ký...</p>
            </div>
        );
    }

    // Giao diện khi xảy ra lỗi hoặc bài viết không tồn tại (Lỗi 404)
    if (error || !post) {
        return (
            <div className="container my-5 text-center py-5" style={{ fontFamily: '"Courier New", Courier, serif' }}>
                <h4 style={{ color: '#a74343', fontWeight: '800' }}>{error || "Mẩu chuyện này hiện tại không tồn tại!"}</h4>
                <Link to="/" className="btn mt-3 vintage-back-btn text-decoration-none">
                    QUAY LẠI TRANG CHỦ
                </Link>
            </div>
        );
    }

    // Đánh chặn thuộc tính chữ hoa / chữ thường từ Entity C# đổ ra
    const title = post.title ?? post.Title ?? 'Chuyện chưa đặt tên';
    const content = post.content ?? post.Content ?? '';
    const imageUrl = post.imageUrl ?? post.ImageUrl;
    const createdDate = post.createdDate ?? post.CreatedDate;
    const categoryName = post.category?.name ?? post.Category?.Name ?? 'Nhật ký chung';

    return (
        <div className="container my-5" style={{ fontFamily: 'Georgia, serif', color: '#433422' }}>
            <div className="row justify-content-center">
                <div className="col-lg-8 col-md-10">

                    {/* 1. Breadcrumb (Đường dẫn điều hướng hoài cổ) */}
                    <nav aria-label="breadcrumb" className="mb-4 small text-uppercase" style={{ fontFamily: '"Courier New", Courier, serif', letterSpacing: '1px' }}>
                        <ol className="breadcrumb bg-transparent p-0 m-0">
                            <li className="breadcrumb-item">
                                <Link to="/" className="text-decoration-none" style={{ color: '#2c5d63' }}>Trang chủ</Link>
                            </li>
                            <li className="breadcrumb-item">
                                <Link to="/blog" className="text-decoration-none" style={{ color: '#2c5d63' }}>Nhật ký </Link>
                            </li>
                            <li className="breadcrumb-item active text-muted" aria-current="page">Góc tự sự</li>
                        </ol>
                    </nav>

                    {/* Toàn bộ khối nội dung bài viết được bao trong khung Pop-art đổ bóng cứng */}
                    <article className="vintage-article p-4 p-md-5">

                        {/* 2. Tiêu đề bài viết */}
                        <h1 className="fw-bold mb-3" style={{ fontFamily: '"Courier New", Courier, Georgia, serif', color: '#433422', textShadow: '1.5px 1.5px 0px #ecdcb9', fontSize: '2.2rem', lineHeight: '1.4' }}>
                            {title}
                        </h1>

                        {/* Thông tin người viết & Ngày tháng */}
                        <div className="d-flex align-items-center gap-3 text-uppercase small pb-3 mb-4 border-bottom" style={{ fontFamily: '"Courier New", Courier, serif', color: '#7a685c', fontWeight: '700' }}>
                            <span>
                                <i className="fa-solid fa-calendar-days me-1 text-danger"></i> {formatVintageDate(createdDate)}
                            </span>
                            <span>•</span>
                            <span>
                                <i className="fa-solid fa-folder me-1 text-danger"></i> {categoryName}
                            </span>
                            <span>•</span>
                            <span>
                                <i className="fa-solid fa-feather-pointed me-1 text-danger"></i> Viết bởi: 
                            </span>
                        </div>

                        {/* 3. Ảnh bìa bài viết lớn */}
                        {imageUrl && (
                            <div className="vintage-img-frame mb-5">
                                <img
                                    src={getImageUrl(imageUrl)}
                                    alt={title}
                                    className="img-fluid rounded w-100"
                                    style={{ maxHeight: '460px', objectFit: 'cover' }}
                                />
                            </div>
                        )}

                        {/* 4. Nội dung bài viết (Hỗ trợ parse mã HTML từ CKEditor an toàn và tạo phong cách mộc mạc) */}
                        <div
                            className="blog-content vintage-html-render"
                            style={{ fontSize: '1.15rem', lineHeight: '1.9', textAlign: 'justify' }}
                            dangerouslySetInnerHTML={{ __html: content }}
                        />

                    </article>

                    {/* Nút quay lại chân trang */}
                    <div className="text-center mt-5">
                        <Link to="/blog" className="btn vintage-back-btn px-4 py-2">
                            <i className="fa-solid fa-arrow-left-long me-2"></i> TRỞ VỀ TRANG TIN TỨC
                        </Link>
                    </div>

                </div>
            </div>

            {/* Khối CSS nhúng xử lý giao diện đồng bộ hệ thống */}
            <style>{`
                .vintage-article {
                    background-color: #f4ebd0;
                    border: 2px solid #433422;
                    border-radius: 4px;
                    box-shadow: 6px 6px 0px #433422;
                }
                .vintage-img-frame {
                    border: 2px solid #433422;
                    border-radius: 2px;
                    padding: 6px;
                    background-color: #ffffff;
                }
                .vintage-back-btn {
                    background-color: #a74343 !important;
                    color: #ffffff !important;
                    font-size: 0.9rem;
                    font-weight: 700;
                    font-family: "Courier New", Courier, serif;
                    border: 2px solid #433422 !important;
                    border-radius: 4px;
                    box-shadow: 4px 4px 0px #433422;
                    transition: all 0.15s ease;
                }
                .vintage-back-btn:hover {
                    background-color: #2c5d63 !important;
                    box-shadow: 1px 1px 0px #433422;
                    transform: translate(3px, 3px);
                }
                
                /* Định dạng riêng cho đống mã HTML do CKEditor sinh ra */
                .vintage-html-render p {
                    margin-bottom: 1.5rem;
                }
                .vintage-html-render img {
                    max-width: 100%;
                    height: auto;
                    border: 2px solid #433422;
                    padding: 4px;
                    background: #fff;
                    margin: 15px 0;
                    border-radius: 2px;
                }
                .vintage-html-render strong {
                    color: #a74343;
                }
                .vintage-html-render::first-letter {
                    font-size: 2.5rem;
                    font-weight: 800;
                    color: #a74343;
                    float: left;
                    margin-right: 8px;
                    line-height: 1;
                    font-family: "Courier New", Courier, serif;
                }
            `}</style>
        </div>
    );
};

export default BlogDetail;