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
              Mong Lan Flower
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.8 }}>
              Chuyen cung cap hoa tuoi cao cap cho moi dip.
              Giao hang nhanh noi thanh trong 2-4 gio.
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 700, color: '#fff', marginBottom: 12 }}>Danh muc</div>
            <div style={{ fontSize: 14, lineHeight: 2 }}>
              <div style={{ cursor: 'pointer' }} onClick={() => navigate('category', { catId: 1, catName: 'Hoa Sinh Nhat' })}>Hoa Sinh Nhat</div>
              <div style={{ cursor: 'pointer' }} onClick={() => navigate('category', { catId: 2, catName: 'Hoa Khai Truong' })}>Hoa Khai Truong</div>
              <div style={{ cursor: 'pointer' }} onClick={() => navigate('category', { catId: 3, catName: 'Lan Ho Diep' })}>Lan Ho Diep</div>
              <div style={{ cursor: 'pointer' }} onClick={() => navigate('category', { catId: 6, catName: 'Hoa Tinh Yeu' })}>Hoa Tinh Yeu</div>
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 700, color: '#fff', marginBottom: 12 }}>Chinh sach</div>
            <div style={{ fontSize: 14, lineHeight: 2 }}>
              <div>Chinh sach giao hang</div>
              <div>Chinh sach doi tra</div>
              <div>Bao mat thong tin</div>
              <div>Dieu khoan su dung</div>
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 700, color: '#fff', marginBottom: 12 }}>Lien he</div>
            <div style={{ fontSize: 14, lineHeight: 2 }}>
              <div>123 Nguyen Hue, Q.1, TP.HCM</div>
              <div>Hotline: 0901 234 567</div>
              <div>Email: info@monglanflower.vn</div>
              <div style={{ cursor: 'pointer', color: '#f7d6df' }} onClick={() => navigate('contact')}>
                Gui lien he cho chung toi
              </div>
            </div>
          </div>
        </div>
        <div style={{
          borderTop: '1px solid #444',
          paddingTop: 16, textAlign: 'center',
          fontSize: 13, color: '#888'
        }}>
          2025 Mong Lan Flower. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
