using System.Collections.Generic;
using System.Threading.Tasks;
using FlowerShop.Entities;

namespace FlowerShop.Repository
{
    public interface IOrderDetailRepositoryEF
    {
        Task<List<OrderDetail>> GetByOrderAsync(int orderId);
        Task AddAsync(OrderDetail detail);
    }
}
