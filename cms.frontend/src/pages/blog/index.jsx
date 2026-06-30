// src/pages/blog/BlogIndex.jsx
import React, { useState, useEffect } from 'react';
import postService from '../../services/blogService'; // File service chứa getAllPosts, getPostsByCategory của bro
import categoryBlogService from '../../services/categoryBlogService';
import PostCard from '../../components/PostCard';
import BlogSidebar from './BlogSidebar';

const BlogIndex = () => {
    const [displayPosts, setDisplayPosts] = useState([]); // Danh sách bài viết hiển thị sau cùng
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // 1. EFFECT TẢI DANH MỤC BAN ĐẦU
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoriesRes = await categoryBlogService.getAllCategoryBlogs();
                if (categoriesRes) {
                    const cats = categoriesRes.data ?? categoriesRes ?? [];
                    setCategories(cats);
                }
            } catch (error) {
                console.error("Lỗi khi tải danh mục bài viết:", error);
            }
        };
        fetchCategories();
    }, []);

    // 2. EFFECT CALL API BÀI VIẾT THEO DANH MỤC (Đồng bộ trực tiếp theo `postService`)
    useEffect(() => {
        const fetchPostsData = async () => {
            setLoading(true);
            try {
                let response;

                if (selectedCategoryId === null || selectedCategoryId === undefined) {
                    // Nếu không chọn danh mục -> Call API lấy toàn bộ bài viết
                    response = await postService.getAllPosts();
                } else {
                    // Nếu chọn danh mục -> Call API lấy theo danh mục của bro
                    response = await postService.getPostsByCategory(selectedCategoryId);
                }

                if (response) {
                    const rawPosts = response.data ?? response ?? [];
                    setDisplayPosts(rawPosts);
                }
            } catch (error) {
                console.error("Lỗi hệ thống khi tải danh sách bài viết từ Service:", error);
                setDisplayPosts([]); // Reset mảng tránh lỗi giao diện
            } finally {
                setLoading(false);
            }
        };

        fetchPostsData();
    }, [selectedCategoryId]); // Chạy lại mỗi khi khách bấm đổi Danh mục trên Sidebar

    // 3. LOGIC TÌM KIẾM THEO TỪ KHÓA (Thực hiện trên danh sách đang hiển thị)
    const getFilteredPosts = () => {
        if (!searchQuery.trim()) return displayPosts;

        const lowerQuery = searchQuery.toLowerCase();
        return displayPosts.filter(post => {
            const title = post.title ?? post.Title ?? '';
            return title.toLowerCase().includes(lowerQuery);
        });
    };

    const finalPosts = getFilteredPosts();

    return (
        <div className="container py-5" style={{ paddingBottom: '80px', fontFamily: '"Courier New", Courier, Georgia, serif' }}>

            {/* Tiêu đề tiệm Solisz */}
            <div className="text-center mb-5">
                <span style={{ color: '#c4b5a7', fontSize: '0.9rem', letterSpacing: '3px', fontWeight: '600' }}>• NHẬT KÝ SỐ •</span>
                <h2 className="mt-2 text-uppercase" style={{ color: '#7a685c', fontFamily: '"Playfair Display", Georgia, serif', fontWeight: '700', letterSpacing: '1px' }}>
                    Tin tức & Góc chia sẻ
                </h2>
                <div style={{ color: '#c4b5a7', letterSpacing: '2px' }}>~~~~~~~~~</div>
            </div>

            <div className="row g-4">
                {/* Thanh Sidebar kết nối các hàm điều hướng */}
                <div className="col-12 col-md-3 mb-4 mb-md-0">
                    <BlogSidebar
                        categories={categories}
                        activeCategoryId={selectedCategoryId}
                        onCategorySelect={setSelectedCategoryId} // Kích hoạt useEffect gọi API mới
                        onSearch={setSearchQuery}
                    />
                </div>

                {/* Khu vực nội dung bài viết */}
                <div className="col-12 col-md-9">
                    <div className="mb-4 pb-2 d-flex justify-content-between align-items-center" style={{ borderBottom: '1px dashed #eadeca' }}>
                        <span style={{ color: '#8a7a6e', fontStyle: 'italic', fontSize: '0.95rem' }}>
                            {selectedCategoryId === null && searchQuery.trim() === '' ? (
                                <>Đang hiển thị toàn bộ <strong style={{ color: '#7a685c' }}>{finalPosts.length}</strong> trang viết của tiệm</>
                            ) : (
                                <>Tìm thấy <strong style={{ color: '#7a685c' }}>{finalPosts.length}</strong> bài viết phù hợp</>
                            )}
                        </span>

                        {/* Nút dọn bộ lọc quay về ban đầu */}
                        {(selectedCategoryId !== null || searchQuery.trim() !== '') && (
                            <button
                                className="btn btn-sm p-0 text-uppercase small"
                                style={{ color: '#a74343', fontWeight: '600', textDecoration: 'underline', border: 'none', background: 'none' }}
                                onClick={() => {
                                    setSelectedCategoryId(null);
                                    setSearchQuery('');
                                }}
                            >
                                [ Xem tất cả ]
                            </button>
                        )}
                    </div>

                    {/* Xử lý giao diện Tải / Trống / Hiển thị */}
                    {loading ? (
                        <div className="text-center my-5 py-5" style={{ color: '#8a7a6e' }}>
                            <div className="spinner-border mb-3" role="status" style={{ width: '2.5rem', height: '2.5rem', color: '#c4b5a7' }}></div>
                            <p className="small font-italic">Tiệm đang lật giở những trang nhật ký cũ...</p>
                        </div>
                    ) : finalPosts.length === 0 ? (
                        <div className="text-center my-5 py-5">
                            <i className="fa-regular fa-folder-open d-block mb-3" style={{ fontSize: '3rem', color: '#c4b5a7' }}></i>
                            <h5 style={{ color: '#8a7a6e', fontWeight: '400', fontStyle: 'italic' }}>Chưa có trang viết nào phù hợp rồi bạn ơi.</h5>
                        </div>
                    ) : (
                        <div className="row">
                            {finalPosts.map((post) => {
                                const postId = post.id ?? post.Id;
                                return (
                                    <div className="col-12 col-md-6 mb-4" key={postId}>
                                        <PostCard post={post} />
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BlogIndex;