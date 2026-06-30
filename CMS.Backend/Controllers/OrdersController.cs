using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OrdersController(ApplicationDbContext context) => _context = context;

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            // Nâng cấp lên Bất đồng bộ (Async) để server xử lý nhanh hơn
            var orders = await _context.Orders
                .Include(o => o.Customer) // Nối bảng để lấy được FullName
                .OrderByDescending(o => o.Id)
                .Select(o => new {
                    o.Id,
                    CustomerName = o.Customer != null ? o.Customer.FullName : "Khách vô danh",
                    o.OrderDate,
                    o.Status
                })
                .ToListAsync();

            return Ok(orders);
        }

        // Lấy danh sách đơn hàng theo ID khách hàng
        [HttpGet("customer/{customerId}")]
        public async Task<IActionResult> GetByCustomer(int customerId)
        {
            var orders = await _context.Orders
                .Where(o => o.CustomerId == customerId)
                .OrderByDescending(o => o.Id)
                .ToListAsync();

            // 💡 CHỈNH SỬA CHUẨN RESTful: Luôn trả về Ok(200) kể cả khi mảng rỗng []
            // Giúp React dùng hàm map() mượt mà, không bị văng lỗi 404 đỏ lòm trên Console
            return Ok(orders);
        }

        [HttpGet("my-orders")]
        public async Task<IActionResult> GetMyOrders()
        {
            var customerIdClaim = User.FindFirst("CustomerId")?.Value;
            if (string.IsNullOrEmpty(customerIdClaim))
                return Unauthorized(new { message = "Bạn chưa đăng nhập!" });

            int customerId = int.Parse(customerIdClaim);

            try
            {
                var orders = await _context.Orders
                    .Where(o => o.CustomerId == customerId)
                    .OrderByDescending(o => o.OrderDate)
                    .Select(o => new {
                        o.Id,
                        o.OrderDate,
                        o.Status,
                        o.Notes,
                        // Chỉ lấy những trường cần thiết, KHÔNG lấy toàn bộ object liên quan
                        OrderDetails = o.OrderDetails.Select(d => new {
                            d.Quantity,
                            d.UnitPrice,
                            ProductName = d.Product != null ? d.Product.Name : "Sản phẩm đã xóa",
                            ImageUrl = d.Product != null ? d.Product.ImageUrl : ""
                        })
                    })
                    .ToListAsync();

                return Ok(orders);
            }
            catch (Exception ex)
            {
                // Ghi log lỗi vào Console của Visual Studio để xem chi tiết
                System.Diagnostics.Debug.WriteLine($"LỖI C# 500: {ex.Message}");
                return StatusCode(500, new { message = "Lỗi máy chủ", detail = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetDetail(int id)
        {
            var order = await _context.Orders
                .Include(o => o.OrderDetails) // Lấy luôn cả danh sách món hàng đã mua
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null) return NotFound(new { message = "Không tìm thấy đơn hàng" });

            return Ok(order);
        }

        [HttpPost("checkout")]
        public async Task<IActionResult> Checkout([FromBody] CheckoutRequest request)
        {
            // 🚨 BẮT BUỘC: Lấy ID từ Cookie, KHÔNG LẤY TỪ REQUEST
            var customerIdClaim = User.FindFirst("CustomerId")?.Value;
            if (string.IsNullOrEmpty(customerIdClaim))
                return Unauthorized(new { message = "Bạn cần đăng nhập để đặt hàng!" });

            int currentCustomerId = int.Parse(customerIdClaim);

            if (request.CartItems == null || request.CartItems.Count == 0)
                return BadRequest(new { message = "Giỏ hàng đang trống!" });

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var newOrder = new Order
                {
                    // SỬ DỤNG ID TỪ COOKIE Ở ĐÂY
                    CustomerId = currentCustomerId,
                    OrderDate = DateTime.Now,
                    Status = 0,
                    Notes = request.Notes
                };

                _context.Orders.Add(newOrder);
                await _context.SaveChangesAsync();

                foreach (var item in request.CartItems)
                {
                    var product = await _context.Products.FindAsync(item.ProductId);
                    if (product == null) return BadRequest(new { message = $"Sản phẩm {item.ProductId} không tồn tại." });

                    if (product.stockQuantity < item.Quantity)
                        return BadRequest(new { message = $"Sản phẩm '{product.Name}' không đủ hàng." });

                    var detail = new OrderDetail
                    {
                        OrderId = newOrder.Id,
                        ProductId = item.ProductId,
                        Quantity = item.Quantity,
                        UnitPrice = product.Price
                    };
                    _context.OrderDetails.Add(detail);
                    product.stockQuantity -= item.Quantity;
                    _context.Products.Update(product);
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return StatusCode(201, new { message = "Đặt hàng thành công!", orderId = newOrder.Id });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { message = "Lỗi hệ thống", error = ex.Message });
            }
        }


    }



    // ==========================================
    // CÁC CLASS DTO HỨNG DỮ LIỆU TỪ REACT
    // ==========================================
    public class CheckoutRequest
    {
        public int CustomerId { get; set; }
        public string? Notes { get; set; }
        public List<CartItemRequest> CartItems { get; set; } = new List<CartItemRequest>();
    }

    public class CartItemRequest
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }

        // Dù React có gửi trường Price này lên, Backend cũng sẽ không dùng đến 
        // để phòng chống hacker sửa giá bằng F12.
        public decimal Price { get; set; }
    }
}
