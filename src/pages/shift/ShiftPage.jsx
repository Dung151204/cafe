import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMoneyBill, FaUser, FaLock, FaArrowLeft, FaClock } from 'react-icons/fa';
import './ShiftPage.css';

const ShiftPage = () => {
  const navigate = useNavigate();
  const [activeShift, setActiveShift] = useState(null);
  
  // Form mở ca
  const [staffName, setStaffName] = useState('');
  const [startCash, setStartCash] = useState('');

  // Kiểm tra lúc load trang: Có ca nào đang chạy không?
  useEffect(() => {
    const savedShift = JSON.parse(localStorage.getItem('active_shift'));
    if (savedShift) {
      setActiveShift(savedShift);
    }
  }, []);

  const formatPrice = (price) => parseInt(price).toLocaleString('vi-VN') + 'đ';

  // --- MỞ CA ---
  const handleOpenShift = () => {
    if (!staffName || !startCash) {
      alert("Vui lòng nhập tên nhân viên và tiền đầu ca!");
      return;
    }

    const newShift = {
      id: `SHIFT-${Date.now()}`,
      staffName: staffName,
      startCash: parseInt(startCash),
      startTime: new Date().toLocaleString('vi-VN'),
      status: 'active'
    };

    // Lưu ca vào bộ nhớ
    localStorage.setItem('active_shift', JSON.stringify(newShift));
    // Lưu tên nhân viên để hiển thị khắp app
    localStorage.setItem('current_user_name', staffName);
    
    setActiveShift(newShift);
    alert(`Xin chào ${staffName}! Ca làm việc đã bắt đầu.`);
    navigate('/dashboard'); // Vào Dashboard ngay
  };

  // --- KẾT CA ---
  const handleEndShift = () => {
    if (window.confirm("Xác nhận kết thúc ca làm việc và đăng xuất?")) {
      // (Optional) Lưu vào lịch sử ca nếu cần
      
      // Xóa dữ liệu ca hiện tại
      localStorage.removeItem('active_shift');
      localStorage.removeItem('current_user_name');
      
      // Reset state
      setActiveShift(null);
      setStaffName('');
      setStartCash('');
      
      alert("Đã kết ca thành công!");
      navigate('/'); // Quay về trang Login để người sau đăng nhập
    }
  };

  return (
    <div className="shift-page-container">
      <div className="shift-card">
        {/* TRƯỜNG HỢP 1: CHƯA CÓ CA -> HIỆN FORM MỞ CA */}
        {!activeShift ? (
          <div className="open-shift-section">
            <div className="shift-header">
              <div style={{fontSize: 40, marginBottom: 10}}>☕</div>
              <h2>Mở Ca Làm Việc</h2>
              <p>Nhập thông tin đầu ca để vào hệ thống</p>
            </div>
            
            <div className="shift-form">
              <div className="form-group">
                <label><FaUser /> Tên nhân viên trực</label>
                <input 
                  type="text" placeholder="Ví dụ: Nguyễn Văn A..." 
                  value={staffName} onChange={(e) => setStaffName(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label><FaMoneyBill /> Tiền mặt trong két</label>
                <input 
                  type="number" placeholder="Ví dụ: 1000000" 
                  value={startCash} onChange={(e) => setStartCash(e.target.value)}
                />
              </div>

              <button className="btn-open-shift" onClick={handleOpenShift}>
                <FaClock /> Bắt đầu ca làm
              </button>
            </div>
            
            <button className="btn-logout-link" onClick={() => navigate('/')}>Quay lại Đăng nhập</button>
          </div>
        ) : (
          /* TRƯỜNG HỢP 2: ĐANG CÓ CA -> HIỆN THÔNG TIN & NÚT KẾT CA */
          <div className="active-shift-section">
            <div className="shift-header">
              <button className="btn-back-dash" onClick={() => navigate('/dashboard')}>
                 <FaArrowLeft /> Về Dashboard
              </button>
              <h2 style={{color: '#10B981'}}>● Ca Đang Hoạt Động</h2>
            </div>

            <div className="shift-info-box">
               <div className="info-row">
                 <span>Nhân viên:</span>
                 <strong>{activeShift.staffName}</strong>
               </div>
               <div className="info-row">
                 <span>Bắt đầu lúc:</span>
                 <span>{activeShift.startTime}</span>
               </div>
               <div className="info-row highlight">
                 <span>Tiền đầu ca:</span>
                 <strong>{formatPrice(activeShift.startCash)}</strong>
               </div>
            </div>

            <div className="shift-actions">
              <button className="btn-end-shift" onClick={handleEndShift}>
                <FaLock /> Kết thúc ca & Đăng xuất
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShiftPage;