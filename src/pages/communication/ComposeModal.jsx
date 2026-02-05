import React, { useState } from 'react';
import { FaTimes, FaPaperPlane } from 'react-icons/fa';
import './ComposeModal.css';

const ComposeModal = ({ isOpen, onClose, onSend }) => {
  const [recipient, setRecipient] = useState('');
  const [content, setContent] = useState('');

  if (!isOpen) return null;

  const handleSend = () => {
    if (!recipient || !content) return;
    onSend(recipient, content);
    setRecipient('');
    setContent('');
  };

  const recipients = ['Quản lý', 'Kế toán', 'Kho', 'IT Support', 'HR', 'Bếp', 'Thu ngân'];

  return (
    <div className="modal-overlay">
      <div className="compose-modal">
        <div className="modal-header">
          <h3>Soạn tin nhắn mới</h3>
          <button className="btn-close" onClick={onClose}><FaTimes /></button>
        </div>
        
        <div className="modal-body">
          <div className="form-group">
            <label>Người nhận</label>
            <select value={recipient} onChange={(e) => setRecipient(e.target.value)}>
              <option value="">Chọn người nhận</option>
              {recipients.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>Nội dung</label>
            <textarea 
              rows="6" 
              placeholder="Nhập nội dung tin nhắn..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Hủy</button>
          <button className="btn-send" onClick={handleSend}>
            <FaPaperPlane /> Gửi tin nhắn
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComposeModal;