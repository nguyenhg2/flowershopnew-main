using Microsoft.EntityFrameworkCore;
using FlowerShop.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FlowerShop.Repository.EFCore
{
    public class OrderDetailRepositoryEF : IOrderDetailRepositoryEF
    {
        private readonly FlowerShopDbContext _context;

        public OrderDetailRepositoryEF(FlowerShopDbContext context)
        {
            _context = context;
        }

        public async Task<List<OrderDetail>> GetByOrderAsync(int orderId)
        {
            return await _context.OrderDetails
                .Include(od => od.Product)
                .Where(od => od.OrderId == orderId)
                .ToListAsync();
        }

        public async Task AddAsync(OrderDetail detail)
        {
            _context.OrderDetails.Add(detail);
            await _context.SaveChangesAsync();
        }
    }
}
