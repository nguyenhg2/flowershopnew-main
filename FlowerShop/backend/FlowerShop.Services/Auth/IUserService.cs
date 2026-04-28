using System.Collections.Generic;
using System.Threading.Tasks;
using FlowerShop.Entities;

namespace FlowerShop.Services.Auth
{
    public interface IUserService
    {
        Task<User?> Authenticate(string email, string password);
        Task<User> Create(User user, string password);
        Task<User?> GetById(int id);
        Task<List<User>> GetAll();
        Task Update(User user, string? password = null);
        Task Delete(int id);
        Task<(List<User> Users, int TotalCount)> Search(string? keyword, int page, int pageSize);
    }
}
