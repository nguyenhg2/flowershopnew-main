using System.Collections.Generic;
using System.Threading.Tasks;
using FlowerShop.Entities;

namespace FlowerShop.Repository
{
    public interface IOrderRepositoryEF
    {
        Task<List<Order>> GetAllAsync();
        Task<(List<Order> Items, int TotalCount)> GetAllPagedAsync(int page, int pageSize);
        Task<List<Order>> GetByUserAsync(int userId);
        Task<Order?> GetByIdAsync(int id);
        Task<List<Order>> GetByStatusAsync(string status);
        Task AddAsync(Order order);
        Task UpdateAsync(Order order);
    }
}
