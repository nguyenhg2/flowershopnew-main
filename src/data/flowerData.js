export const CATEGORIES = [
  { id: 'birthday', name: 'Hoa sinh nhật', color: '#f7d6df' },
  { id: 'opening', name: 'Hoa khai trương', color: '#fff0d6' },
  { id: 'orchid', name: 'Lan hồ điệp', color: '#ede6ff' },
  { id: 'wedding', name: 'Hoa cưới', color: '#d6f0f7' },
  { id: 'condolence', name: 'Hoa tang lễ', color: '#e8e8e8' },
  { id: 'love', name: 'Hoa tình yêu', color: '#ffd6d6' },
];

export const PRODUCTS = [
  { id: 1, name: 'Bó hoa hồng đỏ tình yêu', cat: 'love', price: 450000, sale: 380000, img: 'https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=400', rating: 4.8, reviews: 124, sold: 312, badge: 'hot', desc: 'Bó hoa hồng đỏ tươi cao cấp, 20 bông hoa hồng Đà Lạt kết hợp lá xanh sang trọng. Phù hợp làm quà tặng người yêu nhân ngày Valentine, kỷ niệm.', isNew: false },
  { id: 2, name: 'Giỏ hoa sinh nhật Pastel', cat: 'birthday', price: 650000, sale: 550000, img: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=400', rating: 4.9, reviews: 89, sold: 201, badge: 'sale', desc: 'Giỏ hoa sinh nhật tone pastel nhẹ nhàng với hoa cúc, hoa hồng phấn, lisianthus. Màu sắc tươi vui, thích hợp cho mọi lứa tuổi.', isNew: false },
  { id: 3, name: 'Lan hồ điệp trắng tinh khôi', cat: 'orchid', price: 1200000, sale: null, img: 'https://images.unsplash.com/photo-1566873535350-a3f5d4a804b7?w=400', rating: 5.0, reviews: 56, sold: 98, badge: null, desc: 'Chậu lan hồ điệp trắng cao cấp, 2 cành 12-15 bông. Chăm sóc kỹ lưỡng, hoa tươi lâu 30-45 ngày. Sang trọng, thanh lịch.', isNew: true },
  { id: 4, name: 'Hoa khai trương may mắn', cat: 'opening', price: 2500000, sale: 2200000, img: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=400', rating: 4.7, reviews: 43, sold: 87, badge: 'sale', desc: 'Kệ hoa khai trương 2 tầng rực rỡ, mang ý nghĩa may mắn, thịnh vượng. Kết hợp hoa cúc, hồng, cát tường màu đỏ-vàng.', isNew: false },
  { id: 5, name: 'Bó hoa cưới cô dâu', cat: 'wedding', price: 800000, sale: null, img: 'https://images.unsplash.com/photo-1522057306606-8d84a78e65a6?w=400', rating: 4.9, reviews: 112, sold: 234, badge: 'hot', desc: 'Bó cầm tay cô dâu sang trọng với hoa hồng trắng, baby breath, phong lan trắng. Kết hợp ribbon lụa cao cấp.', isNew: false },
  { id: 6, name: 'Hoa hướng dương rực rỡ', cat: 'birthday', price: 350000, sale: 300000, img: 'https://images.unsplash.com/photo-1551945326-df678bdce81c?w=400', rating: 4.6, reviews: 78, sold: 156, badge: 'sale', desc: 'Bó hoa hướng dương tươi sáng, mang năng lượng tích cực. Kết hợp lá xanh tươi, gói giấy kraft thân thiện.', isNew: true },
  { id: 7, name: 'Giỏ hoa chia buồn', cat: 'condolence', price: 500000, sale: null, img: 'https://images.unsplash.com/photo-1487611459768-bd414656ea10?w=400', rating: 4.5, reviews: 34, sold: 67, badge: null, desc: 'Giỏ hoa tang lễ trang nhã, màu trắng và tím nhạt. Thể hiện sự tôn trọng và chia sẻ nỗi đau với gia đình.', isNew: false },
  { id: 8, name: 'Bó hoa tulip Hà Lan', cat: 'love', price: 520000, sale: 460000, img: 'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=400', rating: 4.8, reviews: 67, sold: 143, badge: 'new', desc: 'Bó tulip nhập khẩu Hà Lan đủ màu sắc: đỏ, vàng, tím, hồng. Hoa tươi nhập về 3 lần/tuần.', isNew: true },
  { id: 9, name: 'Lan hồ điệp tím hoàng gia', cat: 'orchid', price: 1500000, sale: null, img: 'https://images.unsplash.com/photo-1612363148951-15f16817648f?w=400', rating: 4.9, reviews: 29, sold: 54, badge: null, desc: 'Chậu lan hồ điệp tím cao cấp, 2 cành 10-12 bông. Màu tím quý phái, phù hợp làm quà biếu.', isNew: true },
  { id: 10, name: 'Kệ hoa khai trương Vạn Phát', cat: 'opening', price: 3500000, sale: 3000000, img: 'https://images.unsplash.com/photo-1477414956199-7dafc86a4f1a?w=400', rating: 4.8, reviews: 21, sold: 45, badge: 'sale', desc: 'Kệ hoa khai trương cao cấp 3 tầng, thiết kế hoành tráng. Toàn hoa tươi nhập khẩu, đảm bảo tươi 5-7 ngày.', isNew: false },
  { id: 11, name: 'Hoa hồng vàng sang trọng', cat: 'love', price: 680000, sale: null, img: 'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=400', rating: 4.7, reviews: 45, sold: 98, badge: null, desc: 'Bó hoa hồng vàng 15 bông, tượng trưng cho tình yêu vĩnh cửu và sự trân trọng. Kết hợp gypsophila trắng.', isNew: false },
  { id: 12, name: 'Giỏ hoa sinh nhật VIP', cat: 'birthday', price: 1200000, sale: 980000, img: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=400', rating: 5.0, reviews: 38, sold: 72, badge: 'hot', desc: 'Giỏ hoa sinh nhật cao cấp kết hợp hoa và chocolate Ferrero Rocher, gấu bông dễ thương. Món quà hoàn hảo.', isNew: false },
];

export const REVIEWS = {
  1: [{ id: 1, user: 'Nguyễn Lan Anh', stars: 5, date: '2024-01-15', text: 'Hoa rất đẹp, tươi lâu, đóng gói cẩn thận. Giao nhanh trong 2h. Sẽ ủng hộ dài dài!', avatar: 'L' },
  { id: 2, user: 'Trần Minh Khoa', stars: 4, date: '2024-01-10', text: 'Hoa đẹp, màu sắc chuẩn như ảnh. Hơi trễ so với giờ hẹn 30p nhưng thông cảm được.', avatar: 'M' }],
  3: [{ id: 3, user: 'Phạm Thu Hương', stars: 5, date: '2024-01-20', text: 'Lan đẹp tuyệt vời! Mua tặng sếp nhân ngày khai trương, được khen ngợi nhiều. Rất hài lòng!', avatar: 'H' }],
};

export const BANNERS = [
  { bg: 'linear-gradient(135deg,#c84b6b,#8b2d47)', title: 'Valentine 2024', sub: 'Ưu đãi đặc biệt - Giảm 20% tất cả hoa hồng', cta: 'Mua ngay' },
  { bg: 'linear-gradient(135deg,#c9973a,#8b6520)', title: 'Khai Xuân Giáp Thìn', sub: 'Miễn phí giao hàng cho đơn từ 500k', cta: 'Khám phá' },
  { bg: 'linear-gradient(135deg,#4a7c59,#2d5a3a)', title: 'Lan hồ điệp mới về', sub: 'Hàng nhập khẩu chính hãng, giá tốt nhất', cta: 'Xem ngay' },
];
