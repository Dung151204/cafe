import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaCoffee } from "react-icons/fa";
import './LoginPage.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // 1. TÀI KHOẢN ADMIN (Quyền cao nhất, không cần mở ca)
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('user_role', 'admin');
      localStorage.setItem('current_user_name', 'Administrator'); // Tên mặc định
      navigate('/dashboard');
    } 
    // 2. TÀI KHOẢN NHÂN VIÊN (Dùng chung)
    else if (username === 'staff' && password === 'staff123') {
      localStorage.setItem('user_role', 'staff');
      
      // KIỂM TRA: Đã mở ca chưa?
      const activeShift = localStorage.getItem('active_shift');
      
      if (activeShift) {
        // Đã có ca đang chạy -> Lấy tên nhân viên đó -> Vào Dashboard
        const shiftData = JSON.parse(activeShift);
        localStorage.setItem('current_user_name', shiftData.staffName);
        navigate('/dashboard');
      } else {
        // Chưa có ca -> Bắt buộc sang trang Mở ca
        navigate('/ca-lam-viec');
      }
    } 
    else {
      alert("Tên đăng nhập hoặc mật khẩu không đúng!");
    }
  };

  return (
    <div className="login-container">
      <div className="header-section">
        <div className="logo-box"><FaCoffee size={30} color="white" /></div>
        <h1>Hệ thống POS Coffee</h1>
        <p>Đăng nhập để bắt đầu phiên làm việc</p>
      </div>

      <div className="login-card">
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Tên đăng nhập</label>
            <input 
              type="text" placeholder="admin / staff"
              value={username} onChange={(e) => setUsername(e.target.value)} 
              className="custom-input"
            />
          </div>

          <div className="form-group">
            <label>Mật khẩu</label>
            <div className="password-wrapper">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Nhập mật khẩu..."
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="custom-input"
              />
              <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <button type="submit" className="login-btn">Đăng nhập</button>
        </form>
      </div>
      <div className="footer-text">© 2026 Coffee POS System.</div>
    </div>
  );
};

export default LoginPage;