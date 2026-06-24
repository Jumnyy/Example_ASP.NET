using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PostsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================================
        // GET ALL POSTS
        // =========================================
        // =========================================
        // GET ALL POSTS
        // =========================================
        [HttpGet]
        // =========================================
        // GET ALL POSTS
        // =========================================
        [HttpGet]
        public IActionResult GetAll()
        {
            var posts = _context.Posts
                .OrderByDescending(p => p.Id)
                .Select(p => new
                {
                    p.Id,
                    p.Title,
                    p.Content,
                    p.ImageUrl,
                    p.CreatedDate,
                    p.CategoryId, // <-- BẮT BUỘC THÊM TRƯỜNG NÀY ĐỂ FRONTEND LỌC THEO CATEGORY
                    CategoryName = p.Category != null ? p.Category.Name : ""
                })
                .ToList();

            return Ok(posts);
        }
        // =========================================
        // GET POSTS BY CATEGORY
        // =========================================
        [HttpGet("category/{categoryId}")]
        public IActionResult GetByCategory(int categoryId)
        {
            var posts = _context.Posts
                .Where(p => p.CategoryId == categoryId)
                .Select(p => new
                {
                    p.Id,
                    p.Title,
                    p.Content, // <-- THÊM VÀO ĐÂY LUÔN NẾU TRANG DANH MỤC CŨNG DÙNG POSTCARD
                    p.ImageUrl,
                    p.CreatedDate
                })
                .ToList();

            return Ok(posts);
        }
        // =========================================
        // GET DETAIL
        // =========================================
        [HttpGet("{id}")]
        public IActionResult GetDetail(int id)
        {
            var post = _context.Posts
                .Include(p => p.Category)
                .FirstOrDefault(p => p.Id == id);

            if (post == null)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy bài viết"
                });
            }

            return Ok(post);
        }

        // =========================================
        // CREATE
        // =========================================
        [HttpPost]
        public IActionResult Create(Post post)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            post.CreatedDate = DateTime.Now;

            _context.Posts.Add(post);
            _context.SaveChanges();

            return Ok(new
            {
                message = "Thêm bài viết thành công",
                data = post
            });
        }

        // =========================================
        // UPDATE
        // =========================================
        [HttpPut("{id}")]
        public IActionResult Update(int id, Post post)
        {
            if (id != post.Id)
            {
                return BadRequest(new
                {
                    message = "Id không hợp lệ"
                });
            }

            var existingPost = _context.Posts.Find(id);

            if (existingPost == null)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy bài viết"
                });
            }

            existingPost.Title = post.Title;
            existingPost.Content = post.Content;
            existingPost.ImageUrl = post.ImageUrl;
            existingPost.CategoryId = post.CategoryId;

            _context.SaveChanges();

            return Ok(new
            {
                message = "Cập nhật thành công",
                data = existingPost
            });
        }

        // =========================================
        // DELETE
        // =========================================
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var post = _context.Posts.Find(id);

            if (post == null)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy bài viết"
                });
            }

            _context.Posts.Remove(post);
            _context.SaveChanges();

            return Ok(new
            {
                message = "Xóa bài viết thành công"
            });
        }
    }
}
