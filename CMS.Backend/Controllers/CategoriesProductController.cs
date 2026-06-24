using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")] // Đường dẫn tự động map thành: api/categoriesproduct
    [ApiController] // Chuyển đổi hoàn toàn sang API Controller chuyên phục vụ React
    public class CategoriesProductController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CategoriesProductController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================================
        // 1. GET ALL (Lấy danh sách danh mục sản phẩm)
        // =========================================
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var categories = await _context.CategoryProducts
                .Select(c => new
                {
                    c.Id,
                    c.Name,
                    c.Description,
                    TotalProducts = c.Products != null ? c.Products.Count() : 0 // Đếm số lượng sản phẩm động
                })
                .ToListAsync();

            return Ok(categories);
        }

        // =========================================
        // 2. GET DETAIL (Lấy chi tiết 1 danh mục)
        // =========================================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDetail(int id)
        {
            var category = await _context.CategoryProducts
                .Include(c => c.Products)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (category == null)
            {
                return NotFound(new { message = "Không tìm thấy danh mục sản phẩm" });
            }

            return Ok(category);
        }

        // =========================================
        // 3. CREATE (Thêm mới danh mục sản phẩm)
        // =========================================
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CategoryProduct categoryProduct)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.CategoryProducts.Add(categoryProduct);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Thêm danh mục sản phẩm thành công",
                data = categoryProduct
            });
        }

        // =========================================
        // 4. UPDATE (Cập nhật thông tin danh mục)
        // =========================================
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CategoryProduct categoryProduct)
        {
            if (id != categoryProduct.Id)
            {
                return BadRequest(new { message = "ID không trùng khớp" });
            }

            var existingCategory = await _context.CategoryProducts.FindAsync(id);
            if (existingCategory == null)
            {
                return NotFound(new { message = "Không tìm thấy danh mục để cập nhật" });
            }

            existingCategory.Name = categoryProduct.Name;
            existingCategory.Description = categoryProduct.Description;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Cập nhật thành công",
                data = existingCategory
            });
        }

        // =========================================
        // 5. DELETE (Xóa danh mục sản phẩm)
        // =========================================
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var category = await _context.CategoryProducts.FindAsync(id);
            if (category == null)
            {
                return NotFound(new { message = "Không tìm thấy danh mục sản phẩm để xóa" });
            }

            _context.CategoryProducts.Remove(category);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Xóa danh mục sản phẩm thành công" });
        }
    }
}