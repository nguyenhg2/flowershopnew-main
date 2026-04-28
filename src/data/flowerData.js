export const CATEGORIES = [
  {id:'birthday', name:'Hoa Sinh Nhật', emoji:'🎂', color:'#f7d6df'},
  {id:'opening', name:'Hoa Khai Trương', emoji:'🏮', color:'#fff0d6'},
  {id:'orchid', name:'Lan Hồ Điệp', emoji:'🌸', color:'#ede6ff'},
  {id:'wedding', name:'Hoa Cưới', emoji:'💍', color:'#d6f0f7'},
  {id:'condolence', name:'Hoa Tang Lễ', emoji:'🕊️', color:'#e8e8e8'},
  {id:'love', name:'Hoa Tình Yêu', emoji:'❤️', color:'#ffd6d6'},
];

export const PRODUCTS = [
  {id:1,name:'Bó Hoa Hồng Đỏ Tình Yêu',cat:'love',price:450000,sale:380000,img:'🌹',rating:4.8,reviews:124,sold:312,badge:'hot',desc:'Bó hoa hồng đỏ tươi cao cấp, 20 bông hoa hồng Đà Lạt kết hợp lá xanh sang trọng. Phù hợp làm quà tặng người yêu nhân ngày Valentine, kỷ niệm.',isNew:false},
  {id:2,name:'Giỏ Hoa Sinh Nhật Pastel',cat:'birthday',price:650000,sale:550000,img:'🌷',rating:4.9,reviews:89,sold:201,badge:'sale',desc:'Giỏ hoa sinh nhật tone pastel nhẹ nhàng với hoa cúc, hoa hồng phấn, lisianthus. Màu sắc tươi vui, thích hợp cho mọi lứa tuổi.',isNew:false},
  {id:3,name:'Lan Hồ Điệp Trắng Tinh Khôi',cat:'orchid',price:1200000,sale:null,img:'🌸',rating:5.0,reviews:56,sold:98,badge:null,desc:'Chậu lan hồ điệp trắng cao cấp, 2 cành 12-15 bông. Chăm sóc kỹ lưỡng, hoa tươi lâu 30-45 ngày. Sang trọng, thanh lịch.',isNew:true},
  {id:4,name:'Hoa Khai Trương May Mắn',cat:'opening',price:2500000,sale:2200000,img:'🏵️',rating:4.7,reviews:43,sold:87,badge:'sale',desc:'Kệ hoa khai trương 2 tầng rực rỡ, mang ý nghĩa may mắn, thịnh vượng. Kết hợp hoa cúc, hồng, cát tường màu đỏ-vàng.',isNew:false},
  {id:5,name:'Bó Hoa Cưới Cô Dâu',cat:'wedding',price:800000,sale:null,img:'💐',rating:4.9,reviews:112,sold:234,badge:'hot',desc:'Bó cầm tay cô dâu sang trọng với hoa hồng trắng, baby breath, phong lan trắng. Kết hợp ribbon lụa cao cấp.',isNew:false},
  {id:6,name:'Hoa Hướng Dương Rực Rỡ',cat:'birthday',price:350000,sale:300000,img:'🌻',rating:4.6,reviews:78,sold:156,badge:'sale',desc:'Bó hoa hướng dương tươi sáng, mang năng lượng tích cực. Kết hợp lá xanh tươi, gói giấy kraft thân thiện.',isNew:true},
  {id:7,name:'Giỏ Hoa Chia Buồn',cat:'condolence',price:500000,sale:null,img:'🕊️',rating:4.5,reviews:34,sold:67,badge:null,desc:'Giỏ hoa tang lễ trang nhã, màu trắng và tím nhạt. Thể hiện sự tôn trọng và chia sẻ nỗi đau với gia đình.',isNew:false},
  {id:8,name:'Bó Hoa Tulip Hà Lan',cat:'love',price:520000,sale:460000,img:'🌷',rating:4.8,reviews:67,sold:143,badge:'new',desc:'Bó tulip nhập khẩu Hà Lan đủ màu sắc: đỏ, vàng, tím, hồng. Hoa tươi nhập về 3 lần/tuần.',isNew:true},
  {id:9,name:'Lan Hồ Điệp Tím Hoàng Gia',cat:'orchid',price:1500000,sale:null,img:'🌺',rating:4.9,reviews:29,sold:54,badge:null,desc:'Chậu lan hồ điệp tím cao cấp, 2 cành 10-12 bông. Màu tím quý phái, phù hợp làm quà biếu.',isNew:true},
  {id:10,name:'Kệ Hoa Khai Trương Vạn Phát',cat:'opening',price:3500000,sale:3000000,img:'🌼',rating:4.8,reviews:21,sold:45,badge:'sale',desc:'Kệ hoa khai trương cao cấp 3 tầng, thiết kế hoành tráng. Toàn hoa tươi nhập khẩu, đảm bảo tươi 5-7 ngày.',isNew:false},
  {id:11,name:'Hoa Hồng Vàng Sang Trọng',cat:'love',price:680000,sale:null,img:'🌼',rating:4.7,reviews:45,sold:98,badge:null,desc:'Bó hoa hồng vàng 15 bông, tượng trưng cho tình yêu vĩnh cửu và sự trân trọng. Kết hợp gypsophila trắng.',isNew:false},
  {id:12,name:'Giỏ Hoa Sinh Nhật VIP',cat:'birthday',price:1200000,sale:980000,img:'🎁',rating:5.0,reviews:38,sold:72,badge:'hot',desc:'Giỏ hoa sinh nhật cao cấp kết hợp hoa và chocolate Ferrero Rocher, gấu bông dễ thương. Món quà hoàn hảo.',isNew:false},
];

export const REVIEWS = {
  1:[{id:1,user:'Nguyễn Lan Anh',stars:5,date:'2024-01-15',text:'Hoa rất đẹp, tươi lâu, đóng gói cẩn thận. Giao nhanh trong 2h. Sẽ ủng hộ dài dài!',avatar:'L'},
     {id:2,user:'Trần Minh Khoa',stars:4,date:'2024-01-10',text:'Hoa đẹp, màu sắc chuẩn như ảnh. Hơi trễ so với giờ hẹn 30p nhưng thông cảm được.',avatar:'M'}],
  3:[{id:3,user:'Phạm Thu Hương',stars:5,date:'2024-01-20',text:'Lan đẹp tuyệt vời! Mua tặng sếp nhân ngày khai trương, được khen ngợi nhiều. Rất hài lòng!',avatar:'H'}],
};

export const BANNERS = [
  {bg:'linear-gradient(135deg,#c84b6b,#8b2d47)',title:'Valentine 2024',sub:'Ưu đãi đặc biệt - Giảm 20% tất cả hoa hồng',cta:'Mua Ngay'},
  {bg:'linear-gradient(135deg,#c9973a,#8b6520)',title:'Khai Xuân Giáp Thìn',sub:'Miễn phí giao hàng cho đơn từ 500k',cta:'Khám Phá'},
  {bg:'linear-gradient(135deg,#4a7c59,#2d5a3a)',title:'Lan Hồ Điệp Mới Về',sub:'Hàng nhập khẩu chính hãng, giá tốt nhất',cta:'Xem Ngay'},
];
