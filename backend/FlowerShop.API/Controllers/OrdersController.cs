using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using FlowerShop.Entities;
using FlowerShop.Repository;
using FlowerShop.Repository.EFCore;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text;

namespace FlowerShop.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderRepositoryEF _orderRepository;
        private readonly IOrderDetailRepositoryEF _orderDetailRepository;
        private readonly IProductRepositoryEF _productRepository;
        private readonly FlowerShopDbContext _context;

        public OrdersController(
            IOrderRepositoryEF orderRepository,
            IOrderDetailRepositoryEF orderDetailRepository,
            IProductRepositoryEF productRepository,
            FlowerShopDbContext context)
        {
            _orderRepository = orderRepository;
            _orderDetailRepository = orderDetailRepository;
            _productRepository = productRepository;
            _context = context;
        }

        private int GetUserId()
        {
            return int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        }

        private bool IsAdmin()
        {
            return User.IsInRole("Admin");
        }

        [HttpGet("my")]
        public async Task<IActionResult> GetMyOrders()
        {
            var userId = GetUserId();
            if (userId == 0) return Unauthorized();
            var orders = await _orderRepository.GetByUserAsync(userId);
            return Ok(orders);
        }

        [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllOrders(
            [FromQuery] string? status,
            [FromQuery] string? keyword,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            var query = _context.Orders
                .Include(o => o.User)
                .Include(o => o.OrderDetails).ThenInclude(od => od.Product)
                .AsQueryable();

            if (!string.IsNullOrEmpty(status))
                query = query.Where(o => o.Status == status);

            if (!string.IsNullOrEmpty(keyword))
            {
                var kw = keyword.ToLower();
                query = query.Where(o =>
                    o.OrderCode.ToLower().Contains(kw) ||
                    o.ReceiverName.ToLower().Contains(kw) ||
                    o.ReceiverPhone.Contains(kw) ||
                    (o.User != null && o.User.FullName.ToLower().Contains(kw)));
            }

            query = query.OrderByDescending(o => o.CreatedAt);
            var totalCount = await query.CountAsync();
            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(new
            {
                items,
                totalCount,
                page,
                pageSize,
                totalPages = (int)Math.Ceiling((double)totalCount / pageSize)
            });
        }

        [HttpGet("revenue")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetRevenue(
            [FromQuery] string period = "month",
            [FromQuery] int? year = null,
            [FromQuery] int? month = null)
        {
            var now = DateTime.Now;
            var targetYear = year ?? now.Year;
            var targetMonth = month ?? now.Month;

            var completedOrders = _context.Orders
                .Where(o => o.Status == "Completed");

            var todayStart = DateTime.Today;
            var todayRevenue = await completedOrders
                .Where(o => o.CreatedAt >= todayStart && o.CreatedAt < todayStart.AddDays(1))
                .SumAsync(o => o.TotalAmount);
            var todayCount = await completedOrders
                .Where(o => o.CreatedAt >= todayStart && o.CreatedAt < todayStart.AddDays(1))
                .CountAsync();

            var monthStart = new DateTime(targetYear, targetMonth, 1);
            var monthEnd = monthStart.AddMonths(1);
            var monthRevenue = await completedOrders
                .Where(o => o.CreatedAt >= monthStart && o.CreatedAt < monthEnd)
                .SumAsync(o => o.TotalAmount);
            var monthCount = await completedOrders
                .Where(o => o.CreatedAt >= monthStart && o.CreatedAt < monthEnd)
                .CountAsync();

            var yearStart = new DateTime(targetYear, 1, 1);
            var yearEnd = yearStart.AddYears(1);
            var yearRevenue = await completedOrders
                .Where(o => o.CreatedAt >= yearStart && o.CreatedAt < yearEnd)
                .SumAsync(o => o.TotalAmount);
            var yearCount = await completedOrders
                .Where(o => o.CreatedAt >= yearStart && o.CreatedAt < yearEnd)
                .CountAsync();

            var totalRevenue = await completedOrders.SumAsync(o => o.TotalAmount);
            var totalCount = await completedOrders.CountAsync();

            var monthlyData = await completedOrders
                .Where(o => o.CreatedAt >= yearStart && o.CreatedAt < yearEnd)
                .GroupBy(o => o.CreatedAt.Month)
                .Select(g => new { month = g.Key, revenue = g.Sum(o => o.TotalAmount), count = g.Count() })
                .OrderBy(x => x.month)
                .ToListAsync();

            var statusCounts = await _context.Orders
                .GroupBy(o => o.Status)
                .Select(g => new { status = g.Key, count = g.Count() })
                .ToListAsync();

            var topProducts = await _context.OrderDetails
                .Include(od => od.Product)
                .Include(od => od.Order)
                .Where(od => od.Order.Status == "Completed")
                .GroupBy(od => new { od.ProductId, od.Product.Name })
                .Select(g => new
                {
                    productId = g.Key.ProductId,
                    productName = g.Key.Name,
                    totalQty = g.Sum(od => od.Quantity),
                    totalRevenue = g.Sum(od => od.Quantity * od.UnitPrice)
                })
                .OrderByDescending(x => x.totalQty)
                .Take(10)
                .ToListAsync();

            return Ok(new
            {
                today = new { revenue = todayRevenue, count = todayCount },
                month = new { revenue = monthRevenue, count = monthCount, year = targetYear, monthNum = targetMonth },
                year = new { revenue = yearRevenue, count = yearCount, yearNum = targetYear },
                total = new { revenue = totalRevenue, count = totalCount },
                monthlyData,
                statusCounts,
                topProducts
            });
        }

        [HttpGet("{id}/invoice")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetInvoiceHtml(int id)
        {
            var order = await _context.Orders
                .Include(o => o.User)
                .Include(o => o.OrderDetails).ThenInclude(od => od.Product)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
                return NotFound(new { message = "Khong tim thay don hang" });

            var rows = new StringBuilder();
            int stt = 1;
            foreach (var od in order.OrderDetails)
            {
                rows.Append($"<tr><td>{stt++}</td><td>{od.Product?.Name ?? ""}</td><td>{od.Quantity}</td><td style=\"text-align:right\">{od.UnitPrice:N0}</td><td style=\"text-align:right\">{(od.Quantity * od.UnitPrice):N0}</td></tr>");
            }

            var html = $@"<!DOCTYPE html>
<html><head><meta charset=""utf-8""/><title>Hoa don #{order.OrderCode}</title>
<style>
body{{font-family:Arial,sans-serif;margin:40px;color:#333}}
h1{{text-align:center;color:#c84b6b;margin-bottom:4px}}
.sub{{text-align:center;color:#888;margin-bottom:24px}}
.info{{display:flex;justify-content:space-between;margin-bottom:20px}}
.info div{{font-size:14px;line-height:1.8}}
table{{width:100%;border-collapse:collapse;margin-bottom:20px}}
th,td{{border:1px solid #ddd;padding:8px;font-size:14px}}
th{{background:#f5f5f5;font-weight:bold}}
.total{{text-align:right;font-size:18px;font-weight:bold;color:#c84b6b}}
.footer{{text-align:center;margin-top:40px;color:#888;font-size:12px}}
</style></head><body>
<h1>MONG LAN FLOWER</h1>
<div class=""sub"">HOA DON BAN HANG</div>
<div class=""info"">
<div><b>Ma don:</b> {order.OrderCode}<br/><b>Ngay:</b> {order.CreatedAt:dd/MM/yyyy HH:mm}<br/><b>Trang thai:</b> {order.Status}</div>
<div><b>Khach hang:</b> {order.ReceiverName}<br/><b>SDT:</b> {order.ReceiverPhone}<br/><b>Dia chi:</b> {order.ShippingAddress}</div>
</div>
<table><thead><tr><th>STT</th><th>San pham</th><th>SL</th><th>Don gia</th><th>Thanh tien</th></tr></thead>
<tbody>{rows}</tbody></table>
<div class=""total"">Tong cong: {order.TotalAmount:N0} VND</div>
{(string.IsNullOrEmpty(order.Note) ? "" : $"<div style=\"margin-top:12px;font-size:14px\"><b>Ghi chu:</b> {order.Note}</div>")}
<div class=""footer"">Cam on quy khach da mua hang tai Mong Lan Flower!</div>
</body></html>";

            return Content(html, "text/html", Encoding.UTF8);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var order = await _orderRepository.GetByIdAsync(id);
            if (order == null)
                return NotFound(new { message = "Khong tim thay don hang" });

            var userId = GetUserId();
            if (order.UserId != userId && !IsAdmin())
                return Forbid();

            return Ok(order);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateOrderDto dto)
        {
            var userId = GetUserId();
            if (userId == 0) return Unauthorized();

            if (dto.Items == null || dto.Items.Count == 0)
                return BadRequest(new { message = "Don hang phai co it nhat 1 san pham" });

            decimal totalAmount = 0;
            var orderDetails = new List<OrderDetail>();

            foreach (var item in dto.Items)
            {
                if (item.Quantity <= 0)
                    return BadRequest(new { message = "So luong phai lon hon 0" });

                var product = await _productRepository.GetByIdAsync(item.ProductId);
                if (product == null)
                    return BadRequest(new { message = $"San pham {item.ProductId} khong ton tai" });
                if (product.Stock < item.Quantity)
                    return BadRequest(new { message = $"San pham {product.Name} chi con {product.Stock} san pham" });

                var unitPrice = product.SalePrice ?? product.Price;
                totalAmount += unitPrice * item.Quantity;

                orderDetails.Add(new OrderDetail
                {
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    UnitPrice = unitPrice
                });

                product.Stock -= item.Quantity;
                product.SoldCount += item.Quantity;
                await _productRepository.UpdateAsync(product);
            }

            var order = new Order
            {
                OrderCode = "ML" + DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
                UserId = userId,
                ReceiverName = dto.ReceiverName ?? "",
                ReceiverPhone = dto.ReceiverPhone ?? "",
                ShippingAddress = dto.ShippingAddress ?? "",
                Note = dto.Note ?? "",
                PaymentMethod = dto.PaymentMethod ?? "COD",
                TotalAmount = totalAmount,
                Status = "Pending"
            };

            await _orderRepository.AddAsync(order);

            foreach (var detail in orderDetails)
            {
                detail.OrderId = order.Id;
                await _orderDetailRepository.AddAsync(detail);
            }

            return CreatedAtAction(nameof(GetById), new { id = order.Id }, order);
        }

        [HttpPut("{id}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateStatusDto dto)
        {
            var order = await _orderRepository.GetByIdAsync(id);
            if (order == null)
                return NotFound(new { message = "Khong tim thay don hang" });

            var validStatuses = new[] { "Pending", "Preparing", "Shipping", "Delivered", "Completed", "Cancelled" };
            if (!validStatuses.Contains(dto.Status))
                return BadRequest(new { message = "Trang thai khong hop le" });

            order.Status = dto.Status;
            if (dto.Status == "Delivered")
                order.DeliveredAt = DateTime.Now;
            await _orderRepository.UpdateAsync(order);
            return Ok(order);
        }

        [HttpPut("{id}/confirm")]
        public async Task<IActionResult> ConfirmReceived(int id)
        {
            var order = await _orderRepository.GetByIdAsync(id);
            if (order == null)
                return NotFound(new { message = "Khong tim thay don hang" });

            var userId = GetUserId();
            if (order.UserId != userId)
                return Forbid();

            if (order.Status != "Delivered")
                return BadRequest(new { message = "Chi xac nhan don hang da giao" });

            order.Status = "Completed";
            await _orderRepository.UpdateAsync(order);
            return Ok(order);
        }

        [HttpPut("{id}/cancel")]
        public async Task<IActionResult> CancelOrder(int id)
        {
            var order = await _orderRepository.GetByIdAsync(id);
            if (order == null)
                return NotFound(new { message = "Khong tim thay don hang" });

            var userId = GetUserId();
            if (order.UserId != userId && !IsAdmin())
                return Forbid();

            if (order.Status == "Completed" || order.Status == "Cancelled"
                || order.Status == "Shipping" || order.Status == "Delivered")
                return BadRequest(new { message = "Khong the huy don hang nay" });

            var details = await _orderDetailRepository.GetByOrderAsync(id);
            foreach (var detail in details)
            {
                var product = await _productRepository.GetByIdAsync(detail.ProductId);
                if (product != null)
                {
                    product.Stock += detail.Quantity;
                    product.SoldCount -= detail.Quantity;
                    await _productRepository.UpdateAsync(product);
                }
            }

            order.Status = "Cancelled";
            await _orderRepository.UpdateAsync(order);
            return Ok(new { message = "Da huy don hang" });
        }
    }

    public class CreateOrderDto
    {
        public string? ReceiverName { get; set; }
        public string? ReceiverPhone { get; set; }
        public string? ShippingAddress { get; set; }
        public string? Note { get; set; }
        public string? PaymentMethod { get; set; }
        public List<OrderItemDto> Items { get; set; } = new();
    }

    public class OrderItemDto
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }

    public class UpdateStatusDto
    {
        public string Status { get; set; } = "";
    }
}
