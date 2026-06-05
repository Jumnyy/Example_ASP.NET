using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UsersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================================
        // GET ALL USERS
        // =========================================
        [HttpGet]
        public IActionResult GetAll()
        {
            var users = _context.Users
                .Select(u => new
                {
                    u.Id,
                    u.Username,
                    u.FullName,
                    u.Role
                })
                .ToList();

            return Ok(users);
        }

        // =========================================
        // GET USER DETAIL
        // =========================================
        [HttpGet("{id}")]
        public IActionResult GetDetail(int id)
        {
            var user = _context.Users
                .Where(u => u.Id == id)
                .Select(u => new
                {
                    u.Id,
                    u.Username,
                    u.FullName,
                    u.Role
                })
                .FirstOrDefault();

            if (user == null)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy người dùng"
                });
            }

            return Ok(user);
        }

        // =========================================
        // CREATE USER
        // =========================================
        [HttpPost]
        public IActionResult Create(User model)
        {
            var checkExist = _context.Users
                .Any(u => u.Username == model.Username);

            if (checkExist)
            {
                return BadRequest(new
                {
                    message = "Tên đăng nhập đã tồn tại"
                });
            }

            _context.Users.Add(model);
            _context.SaveChanges();

            return Ok(new
            {
                message = "Thêm người dùng thành công",
                data = model
            });
        }

        // =========================================
        // UPDATE USER
        // =========================================
        [HttpPut("{id}")]
        public IActionResult Update(int id, User model, string? NewPassword)
        {
            if (id != model.Id)
            {
                return BadRequest(new
                {
                    message = "Id không hợp lệ"
                });
            }

            var existingUser = _context.Users
                .AsNoTracking()
                .FirstOrDefault(u => u.Id == id);

            if (existingUser == null)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy người dùng"
                });
            }

            // Nếu không nhập password mới
            if (string.IsNullOrEmpty(NewPassword))
            {
                model.PasswordHash = existingUser.PasswordHash;
            }
            else
            {
                model.PasswordHash = NewPassword;
            }

            _context.Users.Update(model);
            _context.SaveChanges();

            return Ok(new
            {
                message = "Cập nhật thành công",
                data = model
            });
        }

        // =========================================
        // DELETE USER
        // =========================================
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var user = _context.Users.Find(id);

            if (user == null)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy người dùng"
                });
            }

            _context.Users.Remove(user);
            _context.SaveChanges();

            return Ok(new
            {
                message = "Xóa người dùng thành công"
            });
        }
    }
}
