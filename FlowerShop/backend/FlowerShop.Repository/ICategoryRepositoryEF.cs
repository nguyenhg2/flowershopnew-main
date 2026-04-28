using System.Collections.Generic;
using System.Threading.Tasks;
using FlowerShop.Entities;

namespace FlowerShop.Repository
{
    public interface ICategoryRepositoryEF
    {
        Task<List<Category>> GetAllAsync();
        Task<Category?> GetByIdAsync(int id);
        Task<Category?> GetByNameAsync(string name);
        Task<Category?> GetBySlugAsync(string slug);
        Task AddAsync(Category category);
        Task UpdateAsync(Category category);
        Task DeleteAsync(Category category);
    }
}
