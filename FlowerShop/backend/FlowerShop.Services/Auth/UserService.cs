using FlowerShop.Common;
using FlowerShop.Entities;
using FlowerShop.Repository;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FlowerShop.Services.Auth
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<User?> Authenticate(string email, string password)
        {
            if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password))
                return null;

            var user = await _userRepository.GetByEmailAsync(email);
            if (user == null || !user.IsActive)
                return null;

            if (user.Salt != null && user.Salt.Length > 0)
            {
                if (!TokenHelper.IsValidPassword(password, user.Salt, user.Password))
                    return null;
            }
            else
            {
                if (user.Password != password)
                    return null;
            }

            return user;
        }

        public async Task<User> Create(User user, string password)
        {
            byte[] salt;
            user.Password = TokenHelper.HashPassword(password, out salt);
            user.Salt = salt;
            user.CreatedAt = DateTime.Now;
            user.IsActive = true;
            await _userRepository.CreateAsync(user);
            return user;
        }

        public async Task<User?> GetById(int id)
        {
            return await _userRepository.GetByIdAsync(id);
        }

        public async Task<List<User>> GetAll()
        {
            return await _userRepository.GetAllAsync();
        }

        public async Task Update(User user, string? password = null)
        {
            if (!string.IsNullOrEmpty(password))
            {
                byte[] salt;
                user.Password = TokenHelper.HashPassword(password, out salt);
                user.Salt = salt;
            }
            await _userRepository.UpdateAsync(user);
        }

        public async Task Delete(int id)
        {
            await _userRepository.DeleteAsync(id);
        }

        public async Task<(List<User> Users, int TotalCount)> Search(string? keyword, int page, int pageSize)
        {
            return await _userRepository.SearchAsync(keyword, page, pageSize);
        }
    }
}
