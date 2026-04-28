using System.Collections.Generic;
using System.Threading.Tasks;
using FlowerShop.Entities;

namespace FlowerShop.Repository
{
    public interface IReviewRepository
    {
        Task<List<Review>> GetByProductAsync(int productId);
        Task<List<Review>> GetAllAsync();
        Task AddAsync(Review review);
        Task DeleteAsync(int id);
    }
}
