using Microsoft.EntityFrameworkCore;
using FlowerShop.Entities;
using FlowerShop.Common;
using System;

namespace FlowerShop.Repository.EFCore
{
    public class FlowerShopDbContext : DbContext
    {
        public FlowerShopDbContext(DbContextOptions<FlowerShopDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderDetail> OrderDetails { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<Banner> Banners { get; set; }
        public DbSet<Contact> Contacts { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Product>()
                .HasOne(p => p.Category)
                .WithMany()
                .HasForeignKey(p => p.CategoryId);

            modelBuilder.Entity<Order>()
                .HasOne(o => o.User)
                .WithMany()
                .HasForeignKey(o => o.UserId);

            modelBuilder.Entity<OrderDetail>()
                .HasOne(od => od.Order)
                .WithMany(o => o.OrderDetails)
                .HasForeignKey(od => od.OrderId);

            modelBuilder.Entity<OrderDetail>()
                .HasOne(od => od.Product)
                .WithMany()
                .HasForeignKey(od => od.ProductId);

            modelBuilder.Entity<Review>()
                .HasOne(r => r.Product)
                .WithMany()
                .HasForeignKey(r => r.ProductId);

            modelBuilder.Entity<Review>()
                .HasOne(r => r.User)
                .WithMany()
                .HasForeignKey(r => r.UserId);

            modelBuilder.Entity<Product>().Property(p => p.Price).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<Product>().Property(p => p.SalePrice).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<Order>().Property(o => o.TotalAmount).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<OrderDetail>().Property(od => od.UnitPrice).HasColumnType("decimal(18,2)");

            SeedData(modelBuilder);
        }

        private void SeedData(ModelBuilder modelBuilder)
        {
            byte[] adminSalt;
            string adminPass = TokenHelper.HashPassword("admin123", out adminSalt);

            byte[] customerSalt;
            string customerPass = TokenHelper.HashPassword("123456", out customerSalt);

            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1, FullName = "Administrator", Email = "admin@flowershop.com",
                    Phone = "0123456789", Password = adminPass, Salt = adminSalt,
                    Role = "Admin", IsActive = true, CreatedAt = new DateTime(2025, 1, 1)
                },
                new User
                {
                    Id = 2, FullName = "Nguyen Van Khach", Email = "khach@gmail.com",
                    Phone = "0987654321", Password = customerPass, Salt = customerSalt,
                    Role = "Customer", IsActive = true, CreatedAt = new DateTime(2025, 1, 1)
                }
            );

            modelBuilder.Entity<Category>().HasData(
                new Category { Id = 1, Name = "Hoa Sinh Nhật", Slug = "birthday", Description = "Hoa chúc mừng sinh nhật", IsActive = true },
                new Category { Id = 2, Name = "Hoa Khai Trương", Slug = "opening", Description = "Hoa khai trương", IsActive = true },
                new Category { Id = 3, Name = "Lan Hồ Điệp", Slug = "orchid", Description = "Lan hồ điệp cao cấp", IsActive = true },
                new Category { Id = 4, Name = "Hoa Cưới", Slug = "wedding", Description = "Hoa cưới cô dâu", IsActive = true },
                new Category { Id = 5, Name = "Hoa Tang Lễ", Slug = "condolence", Description = "Hoa chia buồn", IsActive = true },
                new Category { Id = 6, Name = "Hoa Tình Yêu", Slug = "love", Description = "Hoa tặng người yêu", IsActive = true }
            );

            modelBuilder.Entity<Product>().HasData(
                new Product { Id = 1, Name = "Bó Hoa Hồng Đỏ Tình Yêu", Code = "SP001", Price = 450000, SalePrice = 380000, Stock = 50, ImageUrl = "/images/rose-red.svg", Description = "Bó hoa hồng đỏ tươi cao cấp, 20 bông.", CategoryId = 6, SoldCount = 312, IsNew = false, IsActive = true, CreatedAt = new DateTime(2025, 1, 1) },
                new Product { Id = 2, Name = "Giỏ Hoa Sinh Nhật Pastel", Code = "SP002", Price = 650000, SalePrice = 550000, Stock = 30, ImageUrl = "/images/birthday-pastel.svg", Description = "Giỏ hoa tone pastel nhẹ nhàng.", CategoryId = 1, SoldCount = 201, IsNew = false, IsActive = true, CreatedAt = new DateTime(2025, 1, 1) },
                new Product { Id = 3, Name = "Lan Hồ Điệp Trắng Tinh Khôi", Code = "SP003", Price = 1200000, SalePrice = null, Stock = 20, ImageUrl = "/images/orchid-white.svg", Description = "Chậu lan hồ điệp trắng cao cấp.", CategoryId = 3, SoldCount = 98, IsNew = true, IsActive = true, CreatedAt = new DateTime(2025, 1, 1) },
                new Product { Id = 4, Name = "Hoa Khai Trương May Mắn", Code = "SP004", Price = 2500000, SalePrice = 2200000, Stock = 15, ImageUrl = "/images/opening-lucky.svg", Description = "Kệ hoa khai trương 2 tầng.", CategoryId = 2, SoldCount = 87, IsNew = false, IsActive = true, CreatedAt = new DateTime(2025, 1, 1) },
                new Product { Id = 5, Name = "Bó Hoa Cưới Cô Dâu", Code = "SP005", Price = 800000, SalePrice = null, Stock = 25, ImageUrl = "/images/wedding-bouquet.svg", Description = "Bó cẩm tay cô dâu sang trọng.", CategoryId = 4, SoldCount = 234, IsNew = false, IsActive = true, CreatedAt = new DateTime(2025, 1, 1) },
                new Product { Id = 6, Name = "Hoa Hướng Dương Rực Rỡ", Code = "SP006", Price = 350000, SalePrice = 300000, Stock = 40, ImageUrl = "/images/sunflower.svg", Description = "Bó hoa hướng dương tươi sáng.", CategoryId = 1, SoldCount = 156, IsNew = true, IsActive = true, CreatedAt = new DateTime(2025, 1, 1) },
                new Product { Id = 7, Name = "Giỏ Hoa Chia Buồn", Code = "SP007", Price = 500000, SalePrice = null, Stock = 20, ImageUrl = "/images/condolence.svg", Description = "Giỏ hoa tang lễ trang nhã.", CategoryId = 5, SoldCount = 67, IsNew = false, IsActive = true, CreatedAt = new DateTime(2025, 1, 1) },
                new Product { Id = 8, Name = "Bó Hoa Tulip Hà Lan", Code = "SP008", Price = 520000, SalePrice = 460000, Stock = 35, ImageUrl = "/images/tulip.svg", Description = "Bó tulip nhập khẩu Hà Lan.", CategoryId = 6, SoldCount = 143, IsNew = true, IsActive = true, CreatedAt = new DateTime(2025, 1, 1) },
                new Product { Id = 9, Name = "Lan Hồ Điệp Tím Hoàng Gia", Code = "SP009", Price = 1500000, SalePrice = null, Stock = 10, ImageUrl = "/images/orchid-purple.svg", Description = "Chậu lan hồ điệp tím cao cấp.", CategoryId = 3, SoldCount = 54, IsNew = true, IsActive = true, CreatedAt = new DateTime(2025, 1, 1) },
                new Product { Id = 10, Name = "Kệ Hoa Khai Trương Vượng Phát", Code = "SP010", Price = 3500000, SalePrice = 3000000, Stock = 8, ImageUrl = "/images/opening-big.svg", Description = "Kệ hoa khai trương 3 tầng.", CategoryId = 2, SoldCount = 45, IsNew = false, IsActive = true, CreatedAt = new DateTime(2025, 1, 1) },
                new Product { Id = 11, Name = "Hoa Hồng Vàng Sang Trọng", Code = "SP011", Price = 680000, SalePrice = null, Stock = 30, ImageUrl = "/images/rose-yellow.svg", Description = "Bó hoa hồng vàng 15 bông.", CategoryId = 6, SoldCount = 98, IsNew = false, IsActive = true, CreatedAt = new DateTime(2025, 1, 1) },
                new Product { Id = 12, Name = "Giỏ Hoa Sinh Nhật VIP", Code = "SP012", Price = 1200000, SalePrice = 980000, Stock = 12, ImageUrl = "/images/birthday-vip.svg", Description = "Giỏ hoa sinh nhật kem chocolate.", CategoryId = 1, SoldCount = 72, IsNew = false, IsActive = true, CreatedAt = new DateTime(2025, 1, 1) }
            );

            modelBuilder.Entity<Banner>().HasData(
                new Banner { Id = 1, Title = "Valentine 2025", Subtitle = "Giảm 20% tất cả hoa hồng", BackgroundCss = "linear-gradient(135deg,#c84b6b,#8b2d47)", ButtonText = "Mua Ngay", LinkUrl = "/category/love", SortOrder = 1, IsActive = true },
                new Banner { Id = 2, Title = "Lan Hồ Điệp Mới Về", Subtitle = "Hàng nhập khẩu chính hãng", BackgroundCss = "linear-gradient(135deg,#4a7c59,#2d5a3a)", ButtonText = "Xem Ngay", LinkUrl = "/category/orchid", SortOrder = 2, IsActive = true }
            );
        }
    }
}
