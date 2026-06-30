//Sinh vien : Nguyen Tan Thien
// MSSV : 2123110126
// Lop: CCQ2311D
// Ngay Tao: 26 / 06 / 2026

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Data.Entities
{
    // Banner quảng cáo (Slider)
    public class Banner
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Title { get; set; } // Tiêu đề hiển thị trên banner

        [Required]
        public string ImageUrl { get; set; } // Đường dẫn lưu ảnh banner

        public string? LinkUrl { get; set; } // Đường dẫn chuyển hướng khi click vào banner

        public int Status { get; set; } = 1; // 1: Hiển thị, 0: Ẩn banner

        public int DisplayOrder { get; set; } = 0; // Thứ tự sắp xếp ưu tiên của các slide
    }
}