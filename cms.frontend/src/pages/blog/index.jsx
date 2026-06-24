import React, { useState, useEffect } from 'react';
import postService from '../../services/blogService'; // Đổi tên từ blogService thành postService cho đúng file của bạn
import categoryBlogService from '../../services/categoryBlogService';
import PostCard from '../../components/PostCard';
import BlogSidebar from './BlogSidebar';

const BlogIndex = () => {
    const [originalPosts, setOriginalPosts] = useState([]);
    const [displayPosts, setDisplayPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            try {
                // Gọi API song song
                const [categoriesRes, postsRes] = await Promise.all([
                    categoryBlogService.getAllCategoryBlogs().catch(e => { console.error(e); return null; }),
                    postService.getAllPosts().catch(e => { console.error(e); return null; })
                ]);

                // 1. Ép kiểu danh mục
                if (categoriesRes) {
                    const cats = categoriesRes.data ?? categoriesRes ?? [];
                    setCategories(cats);
                }

                // 2. Ép kiểu danh sách bài viết nhận từ C# Ok(posts)
                if (postsRes) {
                    // Axios thường bọc mảng trong postsRes.data
                    const rawPosts = postsRes.data ?? postsRes ?? [];
                    setOriginalPosts(rawPosts);
                    setDisplayPosts(rawPosts);
                }

            } catch (error) {
                console.error("Lỗi hệ thống khi tải trang Blog:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    // Logic bộ lọc theo CategoryId (đã được bổ sung ở Backend) và Tìm kiếm
    useEffect(() => {
        let filtered = [...originalPosts];

        if (selectedCategoryId !== null) {
            filtered = filtered.filter(post => {
                const pCatId = post.categoryId ?? post.CategoryId;
                return String(pCatId) === String(selectedCategoryId);
            });
        }

        if (searchQuery.trim() !== '') {
            const lowerQuery = searchQuery.toLowerCase();
            filtered = filtered.filter(post => {
                const title = post.title ?? post.Title ?? '';
                return title.toLowerCase().includes(lowerQuery);
            });
        }

        setDisplayPosts(filtered);
    }, [selectedCategoryId, searchQuery, originalPosts]);

    return (
        <div className="container py-5" style={{ paddingBottom: '80px' }}>
            <div className="text-center mb-5">
                <span style={{ color: '#c4b5a7', fontSize: '0.9rem', letterSpacing: '3px', fontWeight: '600' }}>• NHẬT KÝ SỐ •</span>
                <h2 className="mt-2 text-uppercase" style={{ color: '#7a685c', fontFamily: '"Playfair Display", Georgia, serif', fontWeight: '700', letterSpacing: '1px' }}>
                    Tin tức & Góc chia sẻ
                </h2>
                <div style={{ color: '#c4b5a7', letterSpacing: '2px' }}>~~~~~~~~~</div>
            </div>

            <div className="row">
                <div className="col-12 col-md-3 mb-4 mb-md-0">
                    <BlogSidebar
                        categories={categories}
                        activeCategoryId={selectedCategoryId}
                        onCategorySelect={setSelectedCategoryId}
                        onSearch={setSearchQuery}
                    />
                </div>

                <div className="col-12 col-md-9">
                    <div className="mb-4 pb-2 d-flex justify-content-between align-items-center" style={{ borderBottom: '1px dashed #eadeca' }}>
                        <span style={{ color: '#8a7a6e', fontStyle: 'italic', fontSize: '0.95rem' }}>
                            Đang tìm thấy <strong style={{ color: '#7a685c' }}>{displayPosts.length}</strong> bài viết phù hợp
                        </span>
                    </div>

                    {loading ? (
                        <div className="text-center my-5 py-5" style={{ color: '#8a7a6e' }}>
                            <div className="spinner-border mb-3" role="status" style={{ width: '2.5rem', height: '2.5rem', color: '#c4b5a7' }}></div>
                            <p className="small font-italic">Tiệm đang lật giở những trang nhật ký cũ...</p>
                        </div>
                    ) : displayPosts.length === 0 ? (
                        <div className="text-center my-5 py-5">
                            <i className="fa-regular fa-folder-open d-block mb-3" style={{ fontSize: '3rem', color: '#c4b5a7' }}></i>
                            <h5 style={{ color: '#8a7a6e', fontWeight: '400', fontStyle: 'italic' }}>Chưa có trang viết nào cho chủ đề này bạn ơi.</h5>
                        </div>
                    ) : (
                        <div className="row">
                            {displayPosts.map((post) => {
                                const postId = post.id ?? post.Id;
                                return (
                                    <div className="col-12 col-md-6 col-lg-4 mb-4" key={postId}>
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