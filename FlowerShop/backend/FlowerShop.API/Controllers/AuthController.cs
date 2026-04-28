using Microsoft.AspNetCore.Mvc;
using FlowerShop.Common;
using FlowerShop.Services.Auth;
using FlowerShop.Entities;

namespace FlowerShop.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IConfiguration _config;

        public AuthController(IUserService userService, IConfiguration config)
        {
            _userService = userService;
            _config = config;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
                return BadRequest(new { message = "Email va mat khau khong duoc de trong" });

            var user = await _userService.Authenticate(request.Email, request.Password);
            if (user == null)
                return Unauthorized(new { message = "Email hoac mat khau khong dung" });

            var secretKey = _config["Jwt:SecretKey"] ?? "FlowerShopSecretKeyForJwtTokenMustBeLongEnough2025";
            var token = TokenHelper.GenerateToken(secretKey, 480, user.Id.ToString(), user.Email, user.Role);

            return Ok(new
            {
                token,
                user = new
                {
                    user.Id,
                    user.FullName,
                    user.Email,
                    user.Phone,
                    user.Role
                }
            });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
                return BadRequest(new { message = "Email va mat khau khong duoc de trong" });

            if (request.Password.Length < 6)
                return BadRequest(new { message = "Mat khau phai co it nhat 6 ky tu" });

            var existing = await _userService.Search(request.Email, 1, 1);
            if (existing.Users.Any(u => u.Email == request.Email))
                return BadRequest(new { message = "Email da ton tai" });

            var user = new User
            {
                FullName = request.FullName ?? "",
                Email = request.Email,
                Phone = request.Phone ?? "",
                Role = "Customer"
            };

            var created = await _userService.Create(user, request.Password);

            return Ok(new { message = "Dang ky thanh cong", userId = created.Id });
        }
    }

    public class LoginRequest
    {
        public string Email { get; set; } = "";
        public string Password { get; set; } = "";
    }

    public class RegisterRequest
    {
        public string? FullName { get; set; }
        public string Email { get; set; } = "";
        public string Password { get; set; } = "";
        public string? Phone { get; set; }
    }
}
