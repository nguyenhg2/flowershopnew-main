using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using FlowerShop.Entities;
using FlowerShop.Repository;

namespace FlowerShop.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IProductRepositoryEF _productRepository;
        private readonly ICategoryRepositoryEF _categoryRepository;

        public ProductsController(IProductRepositoryEF productRepository, ICategoryRepositoryEF categoryRepository)
        {
            _productRepository = productRepository;
            _categoryRepository = categoryRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] string? keyword,
            [FromQuery] int? categoryId,
            [FromQuery] decimal? minPrice,
            [FromQuery] decimal? maxPrice,
            [FromQuery] string? sort,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 12)
        {
            var (products, totalCount) = await _productRepository.SearchAsync(
                keyword, categoryId, minPrice, maxPrice, sort, page, pageSize);

            return Ok(new
            {
                items = products,
                totalCount,
                page,
                pageSize,
                totalPages = (int)Math.Ceiling((double)totalCount / pageSize)
            });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var product = await _productRepository.GetByIdAsync(id);
            if (product == null)
                return NotFound(new { message = "Khong tim thay san pham" });
            return Ok(product);
        }

        [HttpGet("category/{categoryId}")]
        public async Task<IActionResult> GetByCategory(int categoryId)
        {
            var products = await _productRepository.GetByCategoryAsync(categoryId);
            return Ok(products);
        }

        [HttpGet("bestsellers")]
        public async Task<IActionResult> GetBestSellers([FromQuery] int count = 4)
        {
            var products = await _productRepository.GetBestSellersAsync(count);
            return Ok(products);
        }

        [HttpGet("newarrivals")]
        public async Task<IActionResult> GetNewArrivals([FromQuery] int count = 4)
        {
            var products = await _productRepository.GetNewArrivalsAsync(count);
            return Ok(products);
        }

        [HttpGet("onsale")]
        public async Task<IActionResult> GetOnSale([FromQuery] int count = 8)
        {
            var products = await _productRepository.GetOnSaleAsync(count);
            return Ok(products);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] ProductCreateDto dto)
        {
            var category = await _categoryRepository.GetByIdAsync(dto.CategoryId);
            if (category == null)
                return BadRequest(new { message = "Danh muc khong ton tai" });

            var product = new Product
            {
                Name = dto.Name,
                Code = dto.Code ?? "",
                Price = dto.Price,
                SalePrice = dto.SalePrice,
                Stock = dto.Stock,
                CategoryId = dto.CategoryId,
                Description = dto.Description ?? "",
                ImageUrl = dto.ImageUrl ?? "",
                IsNew = dto.IsNew
            };

            await _productRepository.AddAsync(product);
            return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] ProductUpdateDto dto)
        {
            var product = await _productRepository.GetByIdAsync(id);
            if (product == null)
                return NotFound(new { message = "Khong tim thay san pham" });

            product.Name = dto.Name ?? product.Name;
            product.Code = dto.Code ?? product.Code;
            product.Price = dto.Price ?? product.Price;
            product.SalePrice = dto.SalePrice;
            product.Stock = dto.Stock ?? product.Stock;
            product.CategoryId = dto.CategoryId ?? product.CategoryId;
            product.Description = dto.Description ?? product.Description;
            product.ImageUrl = dto.ImageUrl ?? product.ImageUrl;
            product.IsNew = dto.IsNew ?? product.IsNew;

            await _productRepository.UpdateAsync(product);
            return Ok(product);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var product = await _productRepository.GetByIdAsync(id);
            if (product == null)
                return NotFound(new { message = "Khong tim thay san pham" });

            await _productRepository.DeleteAsync(product);
            return Ok(new { message = "Da xoa san pham" });
        }
    }

    public class ProductCreateDto
    {
        public string Name { get; set; } = "";
        public string? Code { get; set; }
        public decimal Price { get; set; }
        public decimal? SalePrice { get; set; }
        public int Stock { get; set; }
        public int CategoryId { get; set; }
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }
        public bool IsNew { get; set; }
    }

    public class ProductUpdateDto
    {
        public string? Name { get; set; }
        public string? Code { get; set; }
        public decimal? Price { get; set; }
        public decimal? SalePrice { get; set; }
        public int? Stock { get; set; }
        public int? CategoryId { get; set; }
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }
        public bool? IsNew { get; set; }
    }
}
