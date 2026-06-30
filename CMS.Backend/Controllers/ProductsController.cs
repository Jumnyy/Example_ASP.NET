using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================================
        // GET ALL
        // =========================================
        [HttpGet]
        public IActionResult GetAll()
        {
            var products = _context.Products
                .OrderByDescending(p => p.Id)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.ImageUrl,
                    p.stockQuantity,
                    CategoryName = p.CategoryProduct.Name
                })
                .ToList();

            return Ok(products);
        }

        // =========================================
        // GET BY CATEGORY
        // =========================================
        [HttpGet("category/{categoryId}")]
        public IActionResult GetByCategory(int categoryId)
        {
            var products = _context.Products
                .Where(p => p.CategoryProductId == categoryId)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.ImageUrl,
                    p.stockQuantity
                })
                .ToList();

            return Ok(products);
        }

        // =========================================
        // GET DETAIL - ĐÃ SỬA LỖI 500 (VÒNG LẶP JSON)
        // =========================================
        // =========================================
        // GET DETAIL - PHIÊN BẢN CHỐNG SẬP 500 TUYỆT ĐỐI
        // =========================================
        [HttpGet("{id}")]
        public IActionResult GetDetail(int id)
        {
            // BƯỚC 1: Xóa sạch hoàn toàn .Include(), chỉ dùng .Where và .Select phẳng
            var product = _context.Products
                .Where(p => p.Id == id)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Description,
                    p.Price,
                    p.ImageUrl,
                    p.stockQuantity,
                    p.CategoryProductId,
                    // BƯỚC 2: Thêm dấu ? (Null-conditional) để nếu danh mục bị null thì trả về chuỗi trống, KHÔNG LÀM SẬP SERVER
                    CategoryName = p.CategoryProduct != null ? p.CategoryProduct.Name : "Đồ tuyển chọn"
                })
                .FirstOrDefault();

            if (product == null)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy sản phẩm này"
                });
            }

            return Ok(product);
        }        // =========================================
        // CREATE
        // =========================================
        [HttpPost]
        public IActionResult Create(Product product)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Products.Add(product);
            _context.SaveChanges();

            return Ok(new
            {
                message = "Thêm sản phẩm thành công",
                data = product
            });
        }

        // =========================================
        // UPDATE
        // =========================================
        [HttpPut("{id}")]
        public IActionResult Update(int id, Product product)
        {
            if (id != product.Id)
            {
                return BadRequest(new
                {
                    message = "Id không hợp lệ"
                });
            }

            var existingProduct = _context.Products.Find(id);

            if (existingProduct == null)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy sản phẩm"
                });
            }

            existingProduct.Name = product.Name;
            existingProduct.Description = product.Description;
            existingProduct.Price = product.Price;
            existingProduct.stockQuantity = product.stockQuantity;
            existingProduct.ImageUrl = product.ImageUrl;
            existingProduct.CategoryProductId = product.CategoryProductId;

            _context.SaveChanges();

            return Ok(new
            {
                message = "Cập nhật thành công",
                data = existingProduct
            });
        }

        // =========================================
        // DELETE
        // =========================================
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var product = _context.Products.Find(id);

            if (product == null)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy sản phẩm"
                });
            }

            _context.Products.Remove(product);
            _context.SaveChanges();

            return Ok(new
            {
                message = "Xóa thành công"
            });
        }
    }
}
