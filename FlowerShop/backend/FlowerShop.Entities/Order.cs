using System;
using System.Collections.Generic;

namespace FlowerShop.Entities
{
    public class Order
    {
        public int Id { get; set; }
        public string OrderCode { get; set; } = "";
        public int UserId { get; set; }
        public User User { get; set; } = null!;
        public string ReceiverName { get; set; } = "";
        public string ReceiverPhone { get; set; } = "";
        public string ShippingAddress { get; set; } = "";
        public string Note { get; set; } = "";
        public string PaymentMethod { get; set; } = "COD";
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = "Pending";
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public List<OrderDetail> OrderDetails { get; set; } = new();
    }
}
