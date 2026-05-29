using Microsoft.EntityFrameworkCore;
using CMS.Data;
// Thêm namespace này ?? dùng ???c CookieAuthenticationDefaults
using Microsoft.AspNetCore.Authentication.Cookies;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

// ??ng ký DbContext vào h? th?ng
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// =========================================================================
// CHÈN T?I ?ÂY: Tr??c dòng var app = builder.Build();
// 1. Khai báo d?ch v? xác th?c Cookie
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/Account/Login"; // ???ng d?n n?u ch?a ??ng nh?p
        options.AccessDeniedPath = "/Account/AccessDenied"; // ???ng d?n n?u vào trang không ???c phép
    });
// =========================================================================

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

// =========================================================================
// CHÈN T?I ?ÂY: Ngay tr??c app.UseAuthorization();
app.UseAuthentication(); // B??C A: Xác nh?n "Anh là ai?" (Ki?m tra th? bài)
// =========================================================================
app.UseAuthorization();  // B??C B: Xác nh?n "Anh ???c làm gì?" (Ki?m tra quy?n)

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();