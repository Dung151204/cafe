// src/components/inventory/AddProductModal.jsx
import React, { useState } from 'react';
import './AddProductModal.css';

const AddProductModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    unit: '',
    importPrice: '',
    stock: '',
    minStock: '',
    maxStock: '',
    supplier: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Tạo object sản phẩm mới
    const newItem = {
      id: `SP-${Date.now().toString().slice(-4)}`,
      name: formData.name,
      category: formData.category,
      unit: formData.unit,
      importPrice: Number(formData.importPrice),
      stock: Number(formData.stock),
      minStock: Number(formData.minStock),
      maxStock: Number(formData.maxStock),
      supplier: "Nhà cung cấp mới" // Tạm thời hardcode hoặc thêm input
    };
    onSave(newItem);
    // Reset form
    setFormData({ name: '', category: '', unit: '', importPrice: '', stock: '', minStock: '', maxStock: '', supplier: '' });
  };

  return (
    <div className="modal-overlay">
      <div className="add-product-modal">
        <div className="modal-header">
          <h3>Thêm sản phẩm mới</h3>
          <button className="btn-close-modal" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Tên sản phẩm *</label>
              <input name="name" placeholder="Nhập tên sản phẩm" required value={formData.name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Danh mục *</label>
              <input name="category" placeholder="Ví dụ: Cà phê, Sữa" required value={formData.category} onChange={handleChange} />
            </div>
            
            <div className="form-group">
              <label>Đơn vị tính *</label>
              <input name="unit" placeholder="kg, hộp, chai..." required value={formData.unit} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Giá nhập (VNĐ/đơn vị) *</label>
              <input type="number" name="importPrice" placeholder="0" required value={formData.importPrice} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Tồn kho ban đầu</label>
              <input type="number" name="stock" placeholder="0" value={formData.stock} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Tồn tối thiểu *</label>
              <input type="number" name="minStock" placeholder="0" required value={formData.minStock} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Tồn tối đa *</label>
              <input type="number" name="maxStock" placeholder="0" required value={formData.maxStock} onChange={handleChange} />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>Hủy</button>
            <button type="submit" className="btn-submit">+ Thêm sản phẩm</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;