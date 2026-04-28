import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export default function Footer() {
  const { navigate } = useContext(AppContext);

  return (
    <footer style={{
      background: '#2d2d2d', color: '#ccc',
      padding: '48px 0 24px', marginTop: 64
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 32, marginBottom: 32
        }}>
          <div>
            <div style={{
              fontFamily: 'Playfair Display,serif',
              fontSize: 20, fontWeight: 600,
              color: '#fff', marginBottom: 12
            }}>
              Mộng Lan Flower
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.8 }}>
              Chuyên cung cấp hoa tươi cao cấp cho mọi dịp.
              Giao hàng nhanh nội thành trong 2-4 giờ.
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 700, color: '#fff', marginBottom: 12 }}>Danh mục</div>
            <div style={{ fontSize: 14, lineHeight: 2 }}>
              <div style={{ cursor: 'pointer' }} onClick={() => navigate('category', { catId: 1, catName: 'Hoa sinh nhật' })}>Hoa sinh nhật</div>
              <div style={{ cursor: 'pointer' }} onClick={() => navigate('category', { catId: 2, catName: 'Hoa khai trương' })}>Hoa khai trương</div>
              <div style={{ cursor: 'pointer' }} onClick={() => navigate('category', { catId: 3, catName: 'Lan hồ điệp' })}>Lan hồ điệp</div>
              <div style={{ cursor: 'pointer' }} onClick={() => navigate('category', { catId: 6, catName: 'Hoa tình yêu' })}>Hoa tình yêu</div>
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 700, color: '#fff', marginBottom: 12 }}>Chính sách</div>
            <div style={{ fontSize: 14, lineHeight: 2 }}>
              <div>Chính sách giao hàng</div>
              <div>Chính sách đổi trả</div>
              <div>Bảo mật thông tin</div>
              <div>Điều khoản sử dụng</div>
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 700, color: '#fff', marginBottom: 12 }}>Liên hệ</div>
            <div style={{ fontSize: 14, lineHeight: 2 }}>
              <div>123 Nguyễn Huệ, Q.1, TP.HCM</div>
              <div>Hotline: 0901 234 567</div>
              <div>Email: info@monglanflower.vn</div>
              <div style={{ cursor: 'pointer', color: '#f7d6df' }} onClick={() => navigate('contact')}>
                Gửi liên hệ cho chúng tôi
              </div>
            </div>
          </div>
        </div>
        <div style={{
          borderTop: '1px solid #444',
          paddingTop: 16, textAlign: 'center',
          fontSize: 13, color: '#888'
        }}>
          2025 Mộng Lan Flower. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
