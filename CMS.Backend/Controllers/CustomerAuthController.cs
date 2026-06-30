using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerAuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CustomerAuthController(ApplicationDbContext context)
        {
            _context = context;
        }

        private int? CurrentCustomerId =>
            int.TryParse(User.FindFirst("CustomerId")?.Value, out var id) ? id : null;

        // POST: api/CustomerAuth/CustomerRegister
        [HttpPost("CustomerRegister")]
        public async Task<IActionResult> CustomerRegister([FromBody] Customer model)
        {
            if (string.IsNullOrWhiteSpace(model.FullName) || model.FullName.Trim().Length < 2)
                return BadRequest(new { success = false, message = "Họ và tên không được để trống và phải có ít nhất 2 ký tự!" });

            if (!string.IsNullOrWhiteSpace(model.Phone))
            {
                var trimmedPhone = model.Phone.Trim();
                var phoneRegex = new System.Text.RegularExpressions.Regex(@"^0[3|5|7|8|9][0-9]{8}$");

                if (!phoneRegex.IsMatch(trimmedPhone))
                    return BadRequest(new { success = false, message = "Số điện thoại không hợp lệ!" });

                if (await _context.Customers.AnyAsync(c => c.Phone == trimmedPhone))
                    return BadRequest(new { success = false, message = "Số điện thoại này đã được sử dụng!" });

                model.Phone = trimmedPhone;
            }

            if (await _context.Customers.AnyAsync(c => c.Email == model.Email))
                return BadRequest(new { success = false, message = "Email này đã được đăng ký!" });

            model.FullName = model.FullName.Trim();
            _context.Customers.Add(model);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Đăng ký thành công!" });
        }

        // POST: api/CustomerAuth/CustomerLogin
        [HttpPost("CustomerLogin")]
        public async Task<IActionResult> CustomerLogin([FromBody] LoginDto login)
        {
            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.Email == login.Email && c.Password == login.Password);

            if (customer == null)
                return Unauthorized(new { success = false, message = "Email hoặc mật khẩu không đúng!" });

            // Ghi Cookie định danh vào trình duyệt
            await SignInCustomerAsync(customer);

            return Ok(new
            {
                success = true,
                customerId = customer.Id,
                fullName = customer.FullName,
                email = customer.Email,
                message = "Đăng nhập thành công!"
            });
        }

        // POST: api/CustomerAuth/logout
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return Ok(new { success = true, message = "Đăng xuất thành công!" });
        }

        // GET: api/CustomerAuth/me
        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetProfile()
        {
            var customerId = CurrentCustomerId;
            if (!customerId.HasValue) return Unauthorized(new { message = "Bạn chưa đăng nhập." });

            var customer = await _context.Customers.FindAsync(customerId.Value);
            if (customer == null) return NotFound(new { message = "Không tìm thấy tài khoản." });

            // Trả thêm cả trường Id về cho Frontend quản lý giỏ hàng riêng biệt
            return Ok(new
            {
                id = customer.Id,
                fullName = customer.FullName,
                email = customer.Email,
                phone = customer.Phone,
                address = customer.Address
            });
        }

        private async Task SignInCustomerAsync(Customer customer)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, customer.Email),
                new Claim("CustomerId", customer.Id.ToString())
            };

            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

            // Cấu hình cookie lưu lâu dài hoặc phiên làm việc hợp lý
            var authProperties = new AuthenticationProperties
            {
                IsPersistent = true,
                ExpiresUtc = System.DateTimeOffset.UtcNow.AddDays(7)
            };

            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(identity), authProperties);
        }
    }

    public class LoginDto { public string Email { get; set; } = ""; public string Password { get; set; } = ""; }
}