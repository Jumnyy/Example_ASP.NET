import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../assets/css/PostCard.module.css';

const PostCard = ({ post }) => {
    if (!post) return null;

    // Tách Ngày và Tháng
    const dateObj = post.createdDate || post.CreatedDate ? new Date(post.createdDate || post.CreatedDate) : new Date();
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = `THÁNG ${String(dateObj.getMonth() + 1).padStart(2, '0')}`;

    // Biến xử lý đường dẫn ảnh an toàn
    const getImageUrl = () => {
        const imgPath = post.imageUrl || post.ImageUrl;
        if (!imgPath) return "https://placehold.co/400x400/eadeca/7a685c?text=Solisz+Story";

        if (imgPath.startsWith('http')) return imgPath;

        const safePath = imgPath.startsWith('/') ? imgPath : `/${imgPath}`;
        return `https://localhost:7119${safePath}`;
    };

    return (
        <div className={styles.vintagePostCard}>
            {/* Khối Hình Ảnh hoài niệm */}
            <div className={styles.imageWarmWrapper}>
                <Link to={`/blog/${post.id || post.Id || '#'}`}>
                    <img
                        src={getImageUrl()}
                        className={styles.cozyPostImage}
                        alt={post.title || post.Title || 'Bài viết Solis'}
                    />
                </Link>

                {/* Cục Badge Ngày Tháng thiết kế dạng mác giấy kẹp gỗ */}
                <div className={styles.cozyDateBadge}>
                    <span className={styles.badgeDay}>{day}</span>
                    <span className={styles.badgeMonth}>{month}</span>
                </div>
            </div>

            {/* Khối Nội Dung */}
            <div className={styles.chillPostBody}>
                {/* Tác giả / Hashtag nhỏ nhắn */}
                <p className={styles.postMeta}>
                    <i className="fa-regular fa-bookmark"></i> [ NHẬT KÝ 2HAND • BY SOLISZ ]
                </p>

                {/* Tiêu đề bài viết */}
                <h5 className={styles.postTitle}>
                    <Link to={`/blog/${post.id || post.Id || '#'}`} className={styles.postTitleLink}>
                        {post.title || post.Title || 'Đang cập nhật tiêu đề...'}
                    </Link>
                </h5>

                {/* Tóm tắt nội dung */}
                <p className={styles.postExcerpt}>
                    {post.content || post.Content || 'Đang cập nhật nội dung...'}
                </p>

                {/* Nút đọc tiếp viết tay tinh tế */}
                <div className={styles.readMoreWrapper}>
                    <Link to={`/blog/${post.id || post.Id || '#'}`} className={styles.readMoreBtn}>
                        ĐỌC TỰ SỰ <i className="fa-solid fa-arrow-right-long"></i>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PostCard;