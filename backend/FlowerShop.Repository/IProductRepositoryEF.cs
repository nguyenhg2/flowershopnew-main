using System.Collections.Generic;
using System.Threading.Tasks;
using FlowerShop.Entities;

namespace FlowerShop.Repository
{
    public interface IProductRepositoryEF
    {
        Task<(List<Product> Items, int TotalCount)> SearchAsync(
            string? keyword, int? categoryId, decimal? minPrice, decimal? maxPrice,
            string? sort, int page, int pageSize);
        Task<Product?> GetByIdAsync(int id);
        Task<List<Product>> GetByCategoryAsync(int categoryId);
        Task<List<Product>> GetBestSellersAsync(int count);
        Task<List<Product>> GetNewArrivalsAsync(int count);
        Task<List<Product>> GetOnSaleAsync(int count);
        Task AddAsync(Product product);
        Task UpdateAsync(Product product);
        Task DeleteAsync(Product product);
    }
}
