using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using FlowerShop.Services.Auth;
using FlowerShop.Entities;
using System.Security.Claims;

namespace FlowerShop.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetMe()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var user = await _userService.GetById(userId);
            if (user == null) return NotFound();
            return Ok(new { user.Id, user.FullName, user.Email, user.Phone, user.Role, user.CreatedAt });
        }

        [HttpPut("me")]
        public async Task<IActionResult> UpdateMe([FromBody] UpdateProfileDto dto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var user = await _userService.GetById(userId);
            if (user == null) return NotFound();

            user.FullName = dto.FullName ?? user.FullName;
            user.Phone = dto.Phone ?? user.Phone;
            await _userService.Update(user);
            return Ok(new { user.Id, user.FullName, user.Email, user.Phone, user.Role });
        }

        [HttpPut("me/password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var user = await _userService.GetById(userId);
            if (user == null) return NotFound();

            var check = await _userService.Authenticate(user.Email, dto.OldPassword);
            if (check == null)
                return BadRequest(new { message = "Mat khau cu khong dung" });

            await _userService.Update(user, dto.NewPassword);
            return Ok(new { message = "Doi mat khau thanh cong" });
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll([FromQuery] string? keyword, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var (users, totalCount) = await _userService.Search(keyword, page, pageSize);
            return Ok(new
            {
                items = users.Select(u => new { u.Id, u.FullName, u.Email, u.Phone, u.Role, u.IsActive, u.CreatedAt }),
                totalCount, page, pageSize,
                totalPages = (int)Math.Ceiling((double)totalCount / pageSize)
            });
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateUser([FromBody] AdminCreateUserDto dto)
        {
            if (string.IsNullOrEmpty(dto.Email) || string.IsNullOrEmpty(dto.Password))
                return BadRequest(new { message = "Email va mat khau la bat buoc" });

            var existing = await _userService.Authenticate(dto.Email, "");
            try
            {
                var user = await _userService.Register(
                    dto.FullName ?? "",
                    dto.Email,
                    dto.Password,
                    dto.Phone ?? "",
                    dto.Role ?? "Customer");
                return Ok(new { user.Id, user.FullName, user.Email, user.Phone, user.Role });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] AdminUpdateUserDto dto)
        {
            var user = await _userService.GetById(id);
            if (user == null) return NotFound();

            user.FullName = dto.FullName ?? user.FullName;
            user.Phone = dto.Phone ?? user.Phone;
            user.Role = dto.Role ?? user.Role;

            if (!string.IsNullOrEmpty(dto.Password))
                await _userService.Update(user, dto.Password);
            else
                await _userService.Update(user);

            return Ok(new { user.Id, user.FullName, user.Email, user.Phone, user.Role, user.IsActive });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _userService.GetById(id);
            if (user == null) return NotFound();
            await _userService.Delete(id);
            return Ok(new { message = "Da xoa nguoi dung" });
        }

        [HttpPut("{id}/toggle")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ToggleActive(int id)
        {
            var user = await _userService.GetById(id);
            if (user == null) return NotFound();
            user.IsActive = !user.IsActive;
            await _userService.Update(user);
            return Ok(new { message = user.IsActive ? "Da mo khoa" : "Da khoa", user.IsActive });
        }
    }

    public class UpdateProfileDto
    {
        public string? FullName { get; set; }
        public string? Phone { get; set; }
    }

    public class ChangePasswordDto
    {
        public string OldPassword { get; set; } = "";
        public string NewPassword { get; set; } = "";
    }

    public class AdminCreateUserDto
    {
        public string? FullName { get; set; }
        public string Email { get; set; } = "";
        public string Password { get; set; } = "";
        public string? Phone { get; set; }
        public string? Role { get; set; }
    }

    public class AdminUpdateUserDto
    {
        public string? FullName { get; set; }
        public string? Phone { get; set; }
        public string? Role { get; set; }
        public string? Password { get; set; }
    }
}
