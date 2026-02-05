// src/pages/finance/AddTransactionModal.jsx
import React, { useState } from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import './AddTransactionModal.css';

const AddTransactionModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    type: 'income', // Mặc định là Thu nhập
    category: '',
    description: '',
    amount: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount) return;

    const newTransaction = {
      id: `TRX-${Date.now().toString().slice(-5)}`,
      ...formData,
      amount: Number(formData.amount),
      date: new Date().toLocaleString('vi-VN'),
      user: 'Admin' 
    };

    onSave(newTransaction);
    // Reset form sau khi lưu
    setFormData({ type: 'income', category: '', description: '', amount: '' });
  };

  return (
    <div className="modal-overlay">
      <div className="transaction-modal">
        <div className="modal-header">
          <h3>Thêm giao dịch mới</h3>
          <button className="btn-close-modal" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="form-label">Loại giao dịch</label>
          <div className="type-toggle">
            <div 
              className={`type-option income ${formData.type === 'income' ? 'active' : ''}`}
              onClick={() => setFormData({...formData, type: 'income'})}
            >
              <FaArrowUp /> Thu nhập
            </div>
            <div 
              className={`type-option expense ${formData.type === 'expense' ? 'active' : ''}`}
              onClick={() => setFormData({...formData, type: 'expense'})}
            >
              <FaArrowDown /> Chi phí
            </div>
          </div>

          <div className="form-group">
            <label>Danh mục *</label>
            <input 
              type="text" 
              placeholder={formData.type === 'income' ? "VD: Bán hàng, Tiền thưởng..." : "VD: Nguyên liệu, Điện nước..."}
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Mô tả</label>
            <textarea 
              rows="3"
              placeholder="Nhập chi tiết..." 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Số tiền (VNĐ) *</label>
            <input 
              type="number" 
              placeholder="0" 
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              required
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>Hủy</button>
            <button type="submit" className="btn-submit">Thêm giao dịch</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;