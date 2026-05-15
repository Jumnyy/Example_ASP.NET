//Sinh vien : Nguyen Tan Thien
// MSSV : 2123110126
// Lop: CCQ2311D
// Ngay Tao: 15 / 05 / 2026

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Data.Entities
{
    public class CategoryProduct
    {
        [Key]
        public int Id { get; set; }
        [Required(ErrorMessage = "Ten Danh Muc Khong Duoc De Trong")]
        [StringLength(100)]
        public string Name { get; set; }
        public string? Description { get; set; }
        public virtual ICollection<Product>? Products { get; set; }
    }
}
