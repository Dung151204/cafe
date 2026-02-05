import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCoffee, FaDollarSign, FaShoppingCart, FaArrowUp, FaClock, FaWifi, FaChair, FaStore, FaUserClock } from "react-icons/fa";
import MenuCard from "./MenuCard"; 
import './DashboardPage.css';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [staffName, setStaffName] = useState('Admin'); 
  
  const [stats, setStats] = useState({
    revenue: 0, totalOrders: 0, pending: 0, completed: 0, occupiedTables: 0, totalTables: 0
  });

  useEffect(() => {
    // 1. Kiểm tra quyền & Ca làm việc
    const role = localStorage.getItem('user_role');
    const activeShiftStr = localStorage.getItem('active_shift');
    
    // Nếu là Staff mà không có ca -> Đẩy sang trang Mở ca
    if (role === 'staff' && !activeShiftStr) {
      navigate('/ca-lam-viec');
      return;
    }

    const storedName = localStorage.getItem('current_user_name');
    if (storedName) setStaffName(storedName);

    // --- 2. LẤY DỮ LIỆU TỪ CẢ 2 NGUỒN (SỬA LẠI ĐOẠN NÀY) ---
    const posOrders = JSON.parse(localStorage.getItem('all_orders')) || [];
    const deliveryOrders = JSON.parse(localStorage.getItem('delivery_orders')) || [];
    const allTables = JSON.parse(localStorage.getItem('tables_data')) || [];
    
    // Gộp đơn hàng tại quầy và đơn giao hàng lại thành 1 danh sách chung
    const mergedOrders = [...posOrders, ...deliveryOrders];

    // Lấy ID ca hiện tại
    const activeShift = activeShiftStr ? JSON.parse(activeShiftStr) : null;
    const currentShiftId = activeShift ? activeShift.id : null;
    const todayStr = new Date().toLocaleDateString('vi-VN'); 

    // --- 3. TÍNH TOÁN THỐNG KÊ ---
    let rev = 0, ord = 0, pend = 0, comp = 0;

    mergedOrders.forEach(order => {
      let shouldCount = false;

      // Logic lọc theo Ca (Staff) hoặc theo Ngày (Admin)
      if (role === 'staff') {
        // Nếu là Staff: Chỉ tính đơn thuộc ca hiện tại (so sánh shiftId)
        // Lưu ý: Đơn giao hàng tạo trong ca này cũng sẽ có shiftId
        if (order.shiftId === currentShiftId) {
          shouldCount = true;
        }
      } else {
        // Nếu là Admin: Tính tất cả đơn trong ngày hôm nay
        // Kiểm tra xem chuỗi ngày có chứa ngày hôm nay không
        if (order.date && order.date.includes(todayStr)) {
          shouldCount = true;
        }
      }

      if (shouldCount) {
        ord++; // Tăng tổng số đơn

        // Phân loại trạng thái để cộng tiền
        if (order.status === 'completed') { 
          rev += order.totalAmount; 
          comp++; 
        } 
        // Các trạng thái này đều tính là "Đang chờ" (Chưa thu tiền xong)
        // Bao gồm: pending (chờ xử lý), preparing (đang chuẩn bị), shipping (đang giao)
        else if (['pending', 'preparing', 'shipping'].includes(order.status)) {
          pend++;
        }
      }
    });

    setStats({
      revenue: rev, 
      totalOrders: ord, 
      pending: pend, 
      completed: comp,
      occupiedTables: allTables.filter(t => t.status === 'occupied').length,
      totalTables: allTables.length
    });
  }, [navigate]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => date.toLocaleTimeString('en-GB', { hour12: false });
  const formatDate = (date) => date.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' });
  const formatPrice = (price) => price.toLocaleString('vi-VN') + 'đ';

  const menuItems = [
    { id: 1, title: 'Bán Hàng', icon: '☕', path: '/pos', color: '#1890ff' },
    { id: 2, title: 'Kho Hàng', icon: '📦', path: '/kho-hang', color: '#52c41a' },
    { id: 3, title: 'Thu Chi', icon: '💰', path: '/thu-chi', color: '#faad14' },
    { id: 4, title: 'Lịch sử Đơn', icon: '📜', path: '/lich-su-don', color: '#722ed1' },
    { id: 5, title: 'Giao Hàng', icon: '🛵', path: '/giao-hang', color: '#eb2f96' },
    { id: 6, title: 'Khu Vực', icon: '🗺️', path: '/khu-vuc', color: '#2f54eb' },
    { id: 7, title: 'Quản lý Ca', icon: '🕰️', path: '/ca-lam-viec', color: '#08979c' },
    { id: 8, title: 'Tin Nhắn', icon: '💬', path: '/tin-nhan', color: '#fa541c' },
  ];

  return (
    <div className="dashboard-container">
      <div className="stats-section">
        
        {/* THẺ DOANH THU */}
        <div className="stat-card revenue-card">
          <div className="stat-content-left">
            <div className="stat-header"><FaDollarSign className="header-icon blue-icon"/> <span>Tổng doanh thu (Ca)</span></div>
            <h1 className="stat-number">{formatPrice(stats.revenue)}</h1>
            <div className="stat-footer"><span className="trend-up"><FaArrowUp /> +0%</span><span className="trend-text">tăng trưởng</span></div>
          </div>
          <div className="stat-icon-box blue-box"><FaDollarSign /></div>
        </div>

        {/* THẺ ĐƠN HÀNG */}
        <div className="stat-card orders-card">
          <div className="stat-content-left">
            <div className="stat-header"><FaShoppingCart className="header-icon orange-icon"/> <span>Tổng đơn hàng (Ca)</span></div>
            <h1 className="stat-number">{stats.totalOrders}</h1>
            <div className="stat-footer">
              <span className="pending-text">{stats.pending} đang xử lý</span>
              <span className="dot">•</span>
              <span className="completed-text">{stats.completed} xong</span>
            </div>
          </div>
          <div className="stat-icon-box orange-box"><FaShoppingCart /></div>
        </div>

        {/* THẺ BÀN */}
        <div className="stat-card tables-card" style={{backgroundColor: '#ECFDF5', borderColor: '#D1FAE5'}}>
          <div className="stat-content-left">
            <div className="stat-header"><FaStore className="header-icon green-icon" style={{color: '#10B981'}}/> <span>Bàn đang phục vụ</span></div>
            <h1 className="stat-number">{stats.occupiedTables} <span style={{fontSize: '16px', color: '#64748B', fontWeight: '500'}}>/ {stats.totalTables}</span></h1>
            <div className="stat-footer"><span style={{color: '#10B981', fontWeight: '600'}}>Trạng thái</span><span className="dot">•</span><span className="trend-text">hiện tại</span></div>
          </div>
          <div className="stat-icon-box green-box" style={{backgroundColor: '#D1FAE5', color: '#10B981'}}><FaChair /></div>
        </div>
      </div>

      <div className="section-header"><h3>Truy cập nhanh</h3><p>Chọn chức năng để bắt đầu</p></div>
      <div className="grid-menu">
        {menuItems.map((item) => (
          <MenuCard key={item.id} title={item.title} subtitle="Chức năng quản lý" icon={item.icon} color={item.color} onClick={() => navigate(item.path)} />
        ))}
      </div>

      <div className="footer-spacer"></div>
      <div className="footer-wrapper">
        <footer className="dashboard-footer">
          <div className="footer-left"><div className="store-logo"><FaCoffee /></div><div className="store-details"><strong>The Coffee House</strong><p>Chi nhánh Trung tâm</p></div></div>
          <div className="footer-center">
            <div className="shift-info"><FaUserClock className="clock-icon"/><div className="shift-text"><span className="label">Người trực ca</span><span className="value">{staffName}</span></div></div>
            <div className="divider"></div>
            <div className="time-info"><span className="label">Thời gian</span><span className="value time-counter">{formatTime(currentTime)}</span></div>
          </div>
          <div className="footer-right"><div className="user-details"><span className="label">Trạng thái</span><strong>Đang hoạt động</strong></div><div className="status-badge"><FaWifi /> Trực tuyến</div></div>
        </footer>
        <div className="footer-copyright">{formatDate(currentTime)}</div>
      </div>
    </div>
  );
};

export default DashboardPage;