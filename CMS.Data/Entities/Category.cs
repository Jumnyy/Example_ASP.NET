//Sinh vien : Nguyen Tan Thien
// MSSV : 2123110126
// Lop: CCQ2311D
// Ngay Tao: 15 / 05 / 2026
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Data.Entities
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; } //Ten danh muc
        public string Description { get; set; }
        //Quan he 1 danh muc nhieu bai viet
        public virtual ICollection<Post> Posts { get; set; }
    }
}
