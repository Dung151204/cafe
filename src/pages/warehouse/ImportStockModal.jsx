// src/pages/warehouse/ImportStockModal.jsx
import React, { useState, useEffect } from 'react';
import './ImportStockModal.css';

const ImportStockModal = ({ isOpen, onClose, product, onConfirm }) => {
  const [quantity, setQuantity] = useState('');
  const [newPrice, setNewPrice] = useState('');

  // Reset form khi mở modal
  useEffect(() => {
    if (isOpen && product) {
      setQuantity('');
      setNewPrice(product.importPrice);
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Number(quantity) <= 0) {
      alert("Số lượng nhập phải lớn hơn 0");
      return;
    }
    // Gửi dữ liệu về trang cha
    onConfirm(product.id, Number(quantity), Number(newPrice));
  };

  return (
    <div className="modal-overlay">
      <div className="import-modal">
        <div className="modal-header">
          <h3>Nhập hàng vào kho</h3>
          <button className="btn-close-modal" onClick={onClose}>&times;</button>
        </div>
        
        <div className="product-summary">
          <strong>{product.name}</strong>
          <p>Tồn hiện tại: <span className="highlight-stock">{product.stock} {product.unit}</span></p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Số lượng nhập thêm *</label>
            <input 
              type="number" 
              placeholder="Nhập số lượng..." 
              value={quantity} 
              onChange={(e) => setQuantity(e.target.value)}
              autoFocus
              required 
            />
          </div>

          <div className="form-group">
            <label>Giá nhập mới (VNĐ) *</label>
            <input 
              type="number" 
              value={newPrice} 
              onChange={(e) => setNewPrice(e.target.value)}
              required 
            />
            <small>Cập nhật giá vốn nếu có thay đổi</small>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>Hủy</button>
            <button type="submit" className="btn-submit">Xác nhận nhập kho</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ImportStockModal;