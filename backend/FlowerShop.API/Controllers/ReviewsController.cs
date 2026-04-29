using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using FlowerShop.Entities;
using FlowerShop.Repository;
using System.Security.Claims;

namespace FlowerShop.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewsController : ControllerBase
    {
        private readonly IReviewRepository _reviewRepository;

        public ReviewsController(IReviewRepository reviewRepository)
        {
            _reviewRepository = reviewRepository;
        }

        [HttpGet("product/{productId}")]
        public async Task<IActionResult> GetByProduct(int productId)
        {
            var reviews = await _reviewRepository.GetByProductAsync(productId);
            return Ok(reviews.Select(r => new
            {
                r.Id, r.Stars, r.Comment, r.CreatedAt,
                userName = r.User?.FullName ?? ""
            }));
        }

        [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll(
            [FromQuery] string? keyword,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            var all = await _reviewRepository.GetAllAsync();

            if (!string.IsNullOrEmpty(keyword))
            {
                var kw = keyword.ToLower();
                all = all.Where(r =>
                    (r.User?.FullName ?? "").ToLower().Contains(kw) ||
                    (r.Product?.Name ?? "").ToLower().Contains(kw) ||
                    (r.Comment ?? "").ToLower().Contains(kw)
                ).ToList();
            }

            var totalCount = all.Count;
            var items = all
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(r => new
                {
                    r.Id, r.Stars, r.Comment, r.CreatedAt,
                    userName = r.User?.FullName ?? "",
                    productName = r.Product?.Name ?? ""
                })
                .ToList();

            return Ok(new
            {
                items,
                totalCount,
                page,
                pageSize,
                totalPages = (int)Math.Ceiling((double)totalCount / pageSize)
            });
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] CreateReviewDto dto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            if (userId == 0) return Unauthorized();

            var review = new Review
            {
                ProductId = dto.ProductId,
                UserId = userId,
                Stars = dto.Stars,
                Comment = dto.Comment ?? ""
            };

            await _reviewRepository.AddAsync(review);
            return Ok(review);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            await _reviewRepository.DeleteAsync(id);
            return Ok(new { message = "Da xoa danh gia" });
        }
    }

    public class CreateReviewDto
    {
        public int ProductId { get; set; }
        public int Stars { get; set; }
        public string? Comment { get; set; }
    }
}
