//Sinh vien : Nguyen Tan Thien
// MSSV : 2123110126
// Lop: CCQ2311D
// Ngay Tao: 26 / 06 / 2026

using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; // Thêm thư viện này để dùng ToListAsync()
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks; // Thêm thư viện này để dùng Task

namespace CMS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BannersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BannersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // API PUBLIC: GET https://localhost:7119/api/Banners
        // Dùng để Swagger hiển thị và ReactJS gọi lấy mảng JSON đổ lên trang chủ
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Banner>>> GetActiveBanners()
        {
            // Chuyển sang dùng async/await để tối ưu hiệu năng giống code mẫu
            var data = await _context.Banners
                .Where(b => b.Status == 1) // Hoặc b.IsActive == true tùy theo Entity Banner của bạn
                .OrderBy(b => b.DisplayOrder) // Hoặc b.SortOrder tùy theo Entity Banner của bạn
                .ToListAsync();

            // Kiểm tra nếu không có dữ liệu thì trả về NotFound giống code mẫu
            if (data == null || data.Count == 0)
            {
                return NotFound("Không có banner nào đang hoạt động.");
            }

            return Ok(data); // Trả về mã 200 kèm chuỗi JSON data
        }
    }
}