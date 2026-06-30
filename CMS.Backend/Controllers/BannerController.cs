//Sinh vien : Nguyen Tan Thien
// MSSV : 2123110126
// Lop: CCQ2311D
// Ngay Tao: 26 / 06 / 2026

using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Backend.Controllers
{
    public class BannerController : Controller
    {
        private readonly ApplicationDbContext _context;

        // "Tiêm" kết nối vào Controller
        public BannerController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            // Lấy toàn bộ dữ liệu THẬT từ bảng Banners trong SQL ra quản lý
            var data = _context.Banners.ToList();
            return View(data);
        }

        // 1. Hàm GET: Dùng để hiển thị giao diện Form cho Admin nhập banner mới
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        // 2. Hàm POST: Dùng để đón dữ liệu từ Form gửi lên và lưu vào SQL
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Banner banner, IFormFile ImageFile)
        {
            // XÓA BỎ kiểm tra bắt buộc đối với ImageUrl vì ta sẽ xử lý thủ công bên dưới
            ModelState.Remove("ImageUrl");

            if (ModelState.IsValid)
            {
                if (ImageFile != null && ImageFile.Length > 0)
                {
                    var fileName = Guid.NewGuid().ToString() + Path.GetExtension(ImageFile.FileName);
                    var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images/banners", fileName);

                    // Tạo thư mục nếu chưa tồn tại để tránh lỗi "DirectoryNotFound"
                    var dir = Path.GetDirectoryName(filePath);
                    if (!Directory.Exists(dir)) Directory.CreateDirectory(dir);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await ImageFile.CopyToAsync(stream);
                    }

                    // Gán đường dẫn thật vào database
                    banner.ImageUrl = "/images/banners/" + fileName;
                }
                else
                {
                    // Nếu không chọn file, có thể báo lỗi ra màn hình
                    ModelState.AddModelError("ImageFile", "Vui lòng chọn một file ảnh.");
                    return View(banner);
                }

                _context.Banners.Add(banner);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }

            return View(banner);
        }        // 1. Hàm GET: Tìm dữ liệu cũ của Banner và đổ lên Form Edit
        [HttpGet]
        public IActionResult Edit(int id)
        {
            // Tìm banner trong Database theo Id
            var banner = _context.Banners.Find(id);

            if (banner == null) return NotFound();

            return View(banner); // Gửi đối tượng tìm được sang giao diện Edit
        }

        // 2. Hàm POST: Nhận dữ liệu mới từ người dùng sửa đổi và lưu lại
        [HttpPost]
        public IActionResult Edit(Banner model)
        {
            if (ModelState.IsValid)
            {
                // Lệnh cập nhật đối tượng vào bộ nhớ tạm
                _context.Banners.Update(model);

                // Lưu thay đổi thực sự xuống SQL Server
                _context.SaveChanges();

                // Quay lại trang danh sách để xem kết quả
                return RedirectToAction("Index");
            }
            return View(model);
        }

        public IActionResult Delete(int id)
        {
            // Bước 1: Tìm đối tượng banner trong Database bằng Id
            var banner = _context.Banners.Find(id);

            // Kiểm tra nếu tìm thấy thì mới thực hiện xóa
            if (banner != null)
            {
                // Bước 2: Lệnh xóa khỏi bộ nhớ tạm (Tracking)
                _context.Banners.Remove(banner);

                // Bước 3: Chốt phiên làm việc, xóa thực sự trong SQL Server
                _context.SaveChanges();
            }

            // Sau khi xóa xong, quay lại trang danh sách để cập nhật giao diện
            return RedirectToAction("Index");
        }
    }
}