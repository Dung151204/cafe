import React, { useState } from 'react';
import { FaTrash, FaPlus, FaTimes, FaLayerGroup } from 'react-icons/fa';
import './ManageAreaModal.css';

const ManageAreaModal = ({ isOpen, onClose, areas, onAddArea, onDeleteArea }) => {
  const [newAreaName, setNewAreaName] = useState('');

  if (!isOpen) return null;

  const handleAdd = () => {
    if (!newAreaName.trim()) return;
    onAddArea(newAreaName);
    setNewAreaName('');
  };

  return (
    <div className="modal-overlay">
      <div className="area-modal">
        <div className="modal-header">
          <h3>Quản lý Khu vực</h3>
          <button className="btn-close" onClick={onClose}><FaTimes /></button>
        </div>

        <div className="area-list-container">
          <label className="section-label">Danh sách khu vực hiện tại</label>
          <div className="area-list">
            {areas.map(area => (
              <div key={area.id} className="area-item-row">
                <div className="area-info">
                  <div className="area-icon-box">{area.icon || <FaLayerGroup />}</div>
                  <div>
                    <strong>{area.name}</strong>
                    <span>0 bàn</span> {/* Tạm tính */}
                  </div>
                </div>
                <button className="btn-delete-area" onClick={() => onDeleteArea(area.id)}>
                  <FaTrash /> Xóa
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="add-area-section">
          <label className="section-label">Thêm khu vực mới</label>
          <div className="add-area-form">
            <input 
              type="text" 
              placeholder="Nhập tên khu vực (VD: Tầng 3)..." 
              value={newAreaName}
              onChange={(e) => setNewAreaName(e.target.value)}
            />
            <button className="btn-add-area-submit" onClick={handleAdd}>
              <FaPlus /> Thêm khu vực
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageAreaModal;