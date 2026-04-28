using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FlowerShop.Entities;
using FlowerShop.Repository.EFCore;

namespace FlowerShop.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BannersController : ControllerBase
    {
        private readonly FlowerShopDbContext _context;

        public BannersController(FlowerShopDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetActive()
        {
            var banners = await _context.Banners
                .Where(b => b.IsActive)
                .OrderBy(b => b.SortOrder)
                .ToListAsync();
            return Ok(banners);
        }

        [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll()
        {
            var banners = await _context.Banners.OrderBy(b => b.SortOrder).ToListAsync();
            return Ok(banners);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] Banner banner)
        {
            _context.Banners.Add(banner);
            await _context.SaveChangesAsync();
            return Ok(banner);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] Banner dto)
        {
            var banner = await _context.Banners.FindAsync(id);
            if (banner == null) return NotFound();

            banner.Title = dto.Title;
            banner.Subtitle = dto.Subtitle;
            banner.BackgroundCss = dto.BackgroundCss;
            banner.ButtonText = dto.ButtonText;
            banner.LinkUrl = dto.LinkUrl;
            banner.SortOrder = dto.SortOrder;
            banner.IsActive = dto.IsActive;

            await _context.SaveChangesAsync();
            return Ok(banner);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var banner = await _context.Banners.FindAsync(id);
            if (banner == null) return NotFound();
            _context.Banners.Remove(banner);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Da xoa banner" });
        }
    }
}
