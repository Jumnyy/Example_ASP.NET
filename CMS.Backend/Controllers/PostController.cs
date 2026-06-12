using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using System;
using System.IO;
using System.Linq;

namespace CMS.Backend.Controllers
{
    public class PostController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly Microsoft.AspNetCore.Hosting.IWebHostEnvironment _env;

        public PostController(ApplicationDbContext context, Microsoft.AspNetCore.Hosting.IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // --- DANH SÁCH BÀI VIẾT ---
        public IActionResult Index(int? id)
        {
            if (id == null)
            {
                var allPosts = _context.Posts.OrderByDescending(p => p.CreatedDate).Include(p => p.Category).ToList();
                return View(allPosts);
            }
            var posts = _context.Posts.Where(p => p.CategoryId == id).OrderByDescending(p => p.CreatedDate).Include(p => p.Category).ToList();
            return View(posts);
        }

        // --- CHI TIẾT BÀI VIẾT ---
        public IActionResult Details(int id)
        {
            var post = _context.Posts.Include(p => p.Category).FirstOrDefault(p => p.Id == id);
            if (post == null) return NotFound();
            return View(post);
        }

        // ==========================================
        // THÊM MỚI (CREATE)
        // ==========================================
        [HttpGet]
        public IActionResult Create()
        {
            ViewBag.CategoryList = new SelectList(_context.Categories, "Id", "Name");

            // FIX LỖI NGÀY THÁNG: Khởi tạo dữ liệu ngày đăng mặc định từ Controller
            var model = new Post
            {
                CreatedDate = DateTime.Now
            };
            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(Post model, IFormFile ImageFile)
        {
            if (ImageFile != null && ImageFile.Length > 0)
            {
                string uploadsFolder = Path.Combine(_env.WebRootPath, "uploads");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                string uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(ImageFile.FileName);
                string filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    ImageFile.CopyTo(stream);
                }

                model.ImageUrl = "/uploads/" + uniqueFileName;
            }

            // SỬA LỖI ĐỨNG IM TRANG: Bỏ qua kiểm tra các trường dữ liệu hệ thống / quan hệ bảng trong CSDL
            ModelState.Remove("ImageUrl");
            ModelState.Remove("Category"); // Loại bỏ kiểm tra thực thể liên kết Category nếu dính lỗi Validation
            ModelState.Remove("Comments"); // Loại bỏ kiểm tra bảng liên kết Comments (nếu có)

            if (ModelState.IsValid)
            {
                _context.Posts.Add(model);
                _context.SaveChanges();
                return RedirectToAction("Index");
            }

            // Nếu code chạy xuống đây tức là vẫn bị lỗi Validate một ô nào đó, load lại danh mục để View hiển thị lỗi đỏ
            ViewBag.CategoryList = new SelectList(_context.Categories, "Id", "Name", model.CategoryId);
            return View(model);
        }

        // ==========================================
        // SỬA (EDIT)
        // ==========================================
        // ==========================================
        // SỬA (EDIT) - LẤY DỮ LIỆU CŨ (GET)
        // ==========================================
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var post = _context.Posts.Find(id);
            if (post == null) return NotFound();

            ViewBag.CategoryList = new SelectList(_context.Categories, "Id", "Name", post.CategoryId);
            return View(post);
        }

        // ==========================================
        // SỬA (EDIT) - THỰC HIỆN CẬP NHẬT (POST)
        // ==========================================
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(Post model, IFormFile? ImageFile)
        {
            // 1. Tìm bài viết gốc đang nằm trong Database (BỎ hoàn toàn AsNoTracking để EF Core trực tiếp quản lý)
            var postInDb = _context.Posts.FirstOrDefault(p => p.Id == model.Id);
            if (postInDb == null) return NotFound();

            // 2. Kiểm tra xem người dùng có chọn FILE ẢNH MỚI từ máy tính không
            if (ImageFile != null && ImageFile.Length > 0)
            {
                string uploadsFolder = Path.Combine(_env.WebRootPath, "uploads");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                string uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(ImageFile.FileName);
                string filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    ImageFile.CopyTo(stream);
                }

                // XÓA FILE ẢNH CŨ trên ổ đĩa để tránh rác dung lượng hosting
                if (!string.IsNullOrEmpty(postInDb.ImageUrl))
                {
                    string oldFilePath = Path.Combine(_env.WebRootPath, postInDb.ImageUrl.TrimStart('/'));
                    if (System.IO.File.Exists(oldFilePath))
                    {
                        System.IO.File.Delete(oldFilePath);
                    }
                }

                // Gán đường dẫn ảnh mới vào đối tượng đang kết nối Database
                postInDb.ImageUrl = "/uploads/" + uniqueFileName;
            }
            // MẸO: Nếu ImageFile == null (không chọn ảnh mới), ta không động vào postInDb.ImageUrl, 
            // CSDL sẽ giữ nguyên đường dẫn ảnh cũ mà không bị mất.

            // 3. Đồng bộ cập nhật các thông tin chữ khác từ form vào đối tượng Database
            postInDb.Title = model.Title;
            postInDb.Content = model.Content;
            postInDb.CategoryId = model.CategoryId;

            // Nếu form có sửa ngày thì cập nhật, nếu không có ô nhập ngày thì giữ nguyên ngày cũ trong DB
            if (model.CreatedDate != DateTime.MinValue)
            {
                postInDb.CreatedDate = model.CreatedDate;
            }

            // 4. Loại bỏ hoàn toàn Validation thừa để form luôn được thông suốt, tránh lỗi im lặng
            ModelState.Remove("ImageUrl");
            ModelState.Remove("Category");
            ModelState.Remove("Comments");

            if (ModelState.IsValid)
            {
                // Vì postInDb được thay đổi trực tiếp khi đang kết nối Context nên chỉ cần SaveChanges là xong.
                // KHÔNG SỬ DỤNG lệnh _context.Posts.Update(model) nữa để tránh lỗi ghi đè dữ liệu rỗng.
                _context.SaveChanges();
                return RedirectToAction("Index");
            }

            // Nếu dính lỗi kiểm định nào khác, nạp lại danh sách danh mục để người dùng nhập lại
            ViewBag.CategoryList = new SelectList(_context.Categories, "Id", "Name", model.CategoryId);
            return View(model);
        }        // ==========================================
        // XÓA (DELETE)
        // ==========================================
        public IActionResult Delete(int id)
        {
            var post = _context.Posts.Find(id);
            if (post != null)
            {
                if (!string.IsNullOrEmpty(post.ImageUrl))
                {
                    string filePath = Path.Combine(_env.WebRootPath, post.ImageUrl.TrimStart('/'));
                    if (System.IO.File.Exists(filePath))
                    {
                        System.IO.File.Delete(filePath);
                    }
                }

                _context.Posts.Remove(post);
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }
    }
}