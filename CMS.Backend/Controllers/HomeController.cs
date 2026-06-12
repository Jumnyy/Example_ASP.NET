using CMS.Backend.Models;
using CMS.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using System.Linq;

namespace CMS.Backend.Controllers
{
    public class HomeController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<HomeController> _logger;

        public HomeController(ApplicationDbContext context, ILogger<HomeController> logger)
        {
            _context = context;
            _logger = logger;
        }

        public IActionResult Index()
        {
            // 1. Model chính: Danh sách bài vi?t (Truy?n chu?n IEnumerable<Post>)
            var latestPosts = _context.Posts
                .Include(p => p.Category)
                .OrderByDescending(p => p.CreatedDate)
                .Take(3)
                .ToList();

            // 2. D? li?u ph? 1: S?n ph?m m?i v?
            ViewBag.Products = _context.Products
                .OrderByDescending(p => p.Id)
                .Take(4)
                .ToList();

            // 3. D? li?u ph? 2: Danh m?c n?p kèm s?n ph?m bên trong
            ViewBag.CategoryWithProducts = _context.CategoryProducts
                .Include(c => c.Products)
                .ToList();

            return View(latestPosts);
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}