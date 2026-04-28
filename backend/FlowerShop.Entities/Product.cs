using System;

namespace FlowerShop.Entities
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public string Code { get; set; } = "";
        public decimal Price { get; set; }
        public decimal? SalePrice { get; set; }
        public int Stock { get; set; }
        public string ImageUrl { get; set; } = "";
        public string Description { get; set; } = "";
        public int CategoryId { get; set; }
        public Category Category { get; set; } = null!;
        public int SoldCount { get; set; }
        public bool IsNew { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
