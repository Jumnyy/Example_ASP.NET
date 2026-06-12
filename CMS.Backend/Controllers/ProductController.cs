using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    public class ProductController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _webHostEnvironment;

        // Bổ sung IWebHostEnvironment để định vị chính xác đường dẫn đến thư mục wwwroot
        public ProductController(ApplicationDbContext context, IWebHostEnvironment webHostEnvironment)
        {
            _context = context;
            _webHostEnvironment = webHostEnvironment;
        }

        // --- DANH SÁCH ---
        public IActionResult Index()
        {
            return View(_context.Products.ToList());
        }

        // ==========================================
        // THÊM MỚI (CREATE)
        // ==========================================

        // GET: Hiển thị form thêm mới
        public IActionResult Create()
        {
            ViewBag.CategoryList = new SelectList(_context.CategoryProducts, "Id", "Name");
            return View();
        }

        // POST: Nhận dữ liệu từ form và lưu vào SQL
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Product product, IFormFile? imageFile)
        {
            if (ModelState.IsValid)
            {
                // XỬ LÝ UPLOAD HÌNH ẢNH NẾU CÓ CHỌN FILE
                if (imageFile != null && imageFile.Length > 0)
                {
                    // Định vị đường dẫn đích lưu vào wwwroot/uploads
                    string uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "uploads");

                    // Tạo thư mục nếu trên máy chủ chưa có sẵn
                    if (!Directory.Exists(uploadsFolder))
                    {
                        Directory.CreateDirectory(uploadsFolder);
                    }

                    // Tạo tên file ngẫu nhiên để không bao giờ bị trùng đè file cũ
                    string uniqueFileName = Guid.NewGuid().ToString() + "_" + Path.GetFileName(imageFile.FileName);
                    string filePath = Path.Combine(uploadsFolder, uniqueFileName);

                    // Lưu file vật lý vào ổ đĩa
                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await imageFile.CopyToAsync(fileStream);
                    }

                    // Gán đường dẫn tĩnh tương đối để lưu vào cột ImageUrl của SQL
                    product.ImageUrl = "/uploads/" + uniqueFileName;
                }

                _context.Products.Add(product);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }

            ViewBag.CategoryList = new SelectList(_context.CategoryProducts, "Id", "Name", product.CategoryProductId);
            return View(product);
        }

        // ==========================================
        // SỬA (EDIT)
        // ==========================================

        // GET: Hiển thị form sửa kèm dữ liệu cũ
        public IActionResult Edit(int id)
        {
            var product = _context.Products.Find(id);
            if (product == null) return NotFound();

            ViewBag.CategoryList = new SelectList(_context.CategoryProducts, "Id", "Name", product.CategoryProductId);
            return View(product);
        }

        // POST: Nhận dữ liệu mới và cập nhật
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, Product product, IFormFile? imageFile)
        {
            if (id != product.Id) return NotFound();

            if (ModelState.IsValid)
            {
                try
                {
                    // Lấy ra dữ liệu thực thể gốc chưa thay đổi từ DB để xử lý ảnh cũ
                    var existingProduct = await _context.Products.AsNoTracking().FirstOrDefaultAsync(p => p.Id == id);
                    if (existingProduct == null) return NotFound();

                    if (imageFile != null && imageFile.Length > 0)
                    {
                        // 1. Nếu chọn ảnh mới -> Tiến hành upload file ảnh mới
                        string uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "uploads");

                        if (!Directory.Exists(uploadsFolder))
                        {
                            Directory.CreateDirectory(uploadsFolder);
                        }

                        string uniqueFileName = Guid.NewGuid().ToString() + "_" + Path.GetFileName(imageFile.FileName);
                        string filePath = Path.Combine(uploadsFolder, uniqueFileName);

                        using (var fileStream = new FileStream(filePath, FileMode.Create))
                        {
                            await imageFile.CopyToAsync(fileStream);
                        }

                        // Gán đường dẫn ảnh mới
                        product.ImageUrl = "/uploads/" + uniqueFileName;

                        // Tùy chọn xóa file ảnh vật lý cũ trên ổ đĩa để giải phóng bộ nhớ server
                        if (!string.IsNullOrEmpty(existingProduct.ImageUrl))
                        {
                            var oldFilePath = Path.Combine(_webHostEnvironment.WebRootPath, existingProduct.ImageUrl.TrimStart('/'));
                            if (System.IO.File.Exists(oldFilePath))
                            {
                                System.IO.File.Delete(oldFilePath);
                            }
                        }
                    }
                    else
                    {
                        // 2. Nếu người dùng giữ nguyên không chọn file -> Giữ lại nguyên vẹn đường dẫn ảnh cũ từ DB
                        product.ImageUrl = existingProduct.ImageUrl;
                    }

                    _context.Products.Update(product);
                    await _context.SaveChangesAsync();
                    return RedirectToAction(nameof(Index));
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!_context.Products.Any(e => e.Id == product.Id)) return NotFound();
                    else throw;
                }
            }

            ViewBag.CategoryList = new SelectList(_context.CategoryProducts, "Id", "Name", product.CategoryProductId);
            return View(product);
        }

        // --- XÓA ---
        public IActionResult Delete(int id)
        {
            var product = _context.Products.Find(id);
            if (product != null)
            {
                // Tùy chọn: Xóa tệp tin ảnh thật trong thư mục uploads khi xóa dữ liệu sản phẩm
                if (!string.IsNullOrEmpty(product.ImageUrl))
                {
                    var filePath = Path.Combine(_webHostEnvironment.WebRootPath, product.ImageUrl.TrimStart('/'));
                    if (System.IO.File.Exists(filePath))
                    {
                        System.IO.File.Delete(filePath);
                    }
                }

                _context.Products.Remove(product);
                _context.SaveChanges();
            }
            return RedirectToAction(nameof(Index));
        }
        //Phần chi tiết sản phẩm
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            // Dùng Include để kéo thêm thông tin của CategoryProduct (nếu muốn hiển thị tên danh mục ở trang chi tiết)
            var product = await _context.Products
                .Include(p => p.CategoryProduct) // Đảm bảo tên thuộc tính điều hướng này khớp với Entity Product của bạn
                .FirstOrDefaultAsync(m => m.Id == id);

            if (product == null)
            {
                return NotFound();
            }

            return View(product);
        }
    }
}