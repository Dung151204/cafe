import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import './AddTableModal.css';

const AddTableModal = ({ isOpen, onClose, areas, onAddTable }) => {
  const [tableName, setTableName] = useState('');
  const [selectedArea, setSelectedArea] = useState(areas[0]?.id || '');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!tableName || !selectedArea) return;
    onAddTable({ name: tableName, areaId: selectedArea });
    setTableName('');
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="table-modal">
        <div className="modal-header">
          <h3>Thêm bàn mới</h3>
          <button className="btn-close" onClick={onClose}><FaTimes /></button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label>Số bàn / Tên bàn</label>
            <input 
              type="text" 
              placeholder="Ví dụ: B09, VIP-01..."
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Khu vực</label>
            <select value={selectedArea} onChange={(e) => setSelectedArea(e.target.value)}>
              {areas.map(area => (
                <option key={area.id} value={area.id}>{area.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-submit-table" onClick={handleSubmit}>Thêm bàn</button>
        </div>
      </div>
    </div>
  );
};

export default AddTableModal;