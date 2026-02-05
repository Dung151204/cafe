// src/pages/communication/MessagePage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPen, FaSearch, FaPaperclip, FaPaperPlane } from 'react-icons/fa';
import ComposeModal from './ComposeModal';
import SuccessModal from './SuccessModal';
import './MessagePage.css';

// 1. DỮ LIỆU MẪU CÓ CẤU TRÚC LỊCH SỬ CHAT (HISTORY)
const MOCK_MESSAGES = [
  { 
    id: 1, 
    sender: 'Quản lý', 
    role: 'Quản lý', 
    subject: 'Cập nhật menu mùa hè', 
    preview: 'Vui lòng cập nhật menu mới...', 
    time: '00:24 28-12', 
    isRead: false,
    // Thay vì 1 content, ta dùng mảng history để lưu hội thoại
    history: [
      { id: 'm1', text: 'Vui lòng cập nhật menu mới cho mùa hè vào hệ thống. Danh sách sản phẩm mới đã được gửi kèm. Hạn chót: 30/06/2025.', isMe: false, time: '00:24 28-12' }
    ]
  },
  { 
    id: 2, 
    sender: 'Kế toán', 
    role: 'Kế toán', 
    subject: 'Báo cáo doanh thu tháng 12', 
    preview: 'Đề nghị gửi báo cáo chi tiết...', 
    time: '23:24 27-12', 
    isRead: false, 
    history: [
      { id: 'm1', text: 'Đề nghị gửi báo cáo chi tiết doanh thu và chi phí tháng 12 trước ngày 05/01.', isMe: false, time: '23:24 27-12' }
    ]
  },
  { 
    id: 3, 
    sender: 'Kho', 
    role: 'Kho', 
    subject: 'Cảnh báo tồn kho thấp', 
    preview: 'Một số nguyên liệu sắp hết...', 
    time: '22:24 27-12', 
    isRead: true, 
    history: [
      { id: 'm1', text: 'Một số nguyên liệu sắp hết, cần đặt hàng bổ sung ngay: Cà phê Arabica, Sữa tươi.', isMe: false, time: '22:24 27-12' }
    ]
  },
];

const MessagePage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [selectedId, setSelectedId] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [replyText, setReplyText] = useState('');
  
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const selectedMessage = messages.find(m => m.id === selectedId);

  const filteredMessages = messages.filter(m => 
    m.sender.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- HÀM XỬ LÝ GỬI PHẢN HỒI (REPLY) ---
  const handleReply = () => {
    if(!replyText.trim()) return;

    // 1. Tạo tin nhắn mới
    const newMessage = {
      id: `reply-${Date.now()}`,
      text: replyText,
      isMe: true, // Đánh dấu là tin của mình
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    // 2. Cập nhật vào danh sách messages
    const updatedMessages = messages.map(msg => {
      if (msg.id === selectedId) {
        return {
          ...msg,
          // Thêm tin mới vào lịch sử
          history: [...msg.history, newMessage], 
          // Cập nhật preview bên sidebar
          preview: "Bạn: " + replyText 
        };
      }
      return msg;
    });

    setMessages(updatedMessages);
    setReplyText('');
    
    // Cuộn xuống cuối (Có thể thêm useRef sau này để mượt hơn)
    setTimeout(() => {
        const chatBody = document.querySelector('.msg-content-body');
        if(chatBody) chatBody.scrollTop = chatBody.scrollHeight;
    }, 100);
  };

  // --- HÀM XỬ LÝ GỬI TIN MỚI (TỪ MODAL) ---
  const handleSendNew = (recipient, content) => {
    const newMsgId = Date.now();
    const newThread = {
      id: newMsgId,
      sender: recipient, // Người nhận sẽ hiện tên ở Sidebar
      role: recipient,
      subject: 'Tin nhắn mới',
      preview: "Bạn: " + content,
      time: 'Vừa xong',
      isRead: true,
      history: [
        { id: 'm1', text: content, isMe: true, time: 'Vừa xong' }
      ]
    };

    setMessages([newThread, ...messages]); // Đưa lên đầu
    setSelectedId(newMsgId); // Chọn tin nhắn vừa tạo
    setIsComposeOpen(false);
    setIsSuccessOpen(true);
  };

  return (
    <div className="messages-layout">
      {/* SIDEBAR TRÁI */}
      <div className="sidebar">
        <div className="sidebar-header">
          <button className="btn-back" onClick={() => navigate('/dashboard')}>
            <FaArrowLeft /> Về Dashboard
          </button>
          <div className="header-title">
            <h2>Hộp thư nội bộ</h2>
            <span>{messages.filter(m => !m.isRead).length} tin nhắn chưa đọc</span>
          </div>
        </div>

        <div className="search-bar">
          <FaSearch className="search-icon"/>
          <input 
            type="text" 
            placeholder="Tìm kiếm tin nhắn..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="message-list">
          {filteredMessages.map(msg => (
            <div 
              key={msg.id} 
              className={`message-item ${selectedId === msg.id ? 'active' : ''} ${!msg.isRead ? 'unread' : ''}`}
              onClick={() => setSelectedId(msg.id)}
            >
              <div className="avatar">{msg.sender.charAt(0)}</div>
              <div className="msg-preview">
                <div className="msg-top">
                  <strong>{msg.sender}</strong>
                  {!msg.isRead && <span className="badge-new">New</span>}
                </div>
                <div className="msg-subject">{msg.subject}</div>
                <div className="msg-body-preview">{msg.preview}</div>
                <span className="msg-time">{msg.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* NỘI DUNG PHẢI */}
      <div className="content-area">
        <div className="content-header">
           {selectedMessage ? (
             <div className="msg-info">
               <div className="avatar-large">{selectedMessage.sender.charAt(0)}</div>
               <div>
                 <h3>{selectedMessage.subject}</h3>
                 <span>{selectedMessage.role} • {selectedMessage.time}</span>
               </div>
             </div>
           ) : <div></div>}
           
           <button className="btn-compose" onClick={() => setIsComposeOpen(true)}>
             <FaPen /> <span style={{marginLeft: 5}}>Soạn tin mới</span>
           </button>
        </div>

        <div className="msg-content-body">
          {selectedMessage ? (
            // MAP QUA LỊCH SỬ CHAT ĐỂ HIỂN THỊ
            selectedMessage.history.map((chat) => (
              <div key={chat.id} className={`chat-bubble-container ${chat.isMe ? 'me' : 'other'}`}>
                <div className="msg-bubble">
                  <p>{chat.text}</p>
                  <span className="chat-time">{chat.time}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="empty-state">Chọn một tin nhắn để xem nội dung</p>
          )}
        </div>

        <div className="reply-box">
          <button className="btn-attach"><FaPaperclip /> Đính kèm</button>
          <input 
            type="text" 
            placeholder="Nhập nội dung phản hồi..." 
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleReply()}
          />
          <button className="btn-reply-send" onClick={handleReply}>
            <FaPaperPlane /> Gửi
          </button>
        </div>
      </div>

      {/* MODALS */}
      <ComposeModal 
        isOpen={isComposeOpen} 
        onClose={() => setIsComposeOpen(false)} 
        onSend={handleSendNew}
      />
      <SuccessModal 
        isOpen={isSuccessOpen} 
        onClose={() => setIsSuccessOpen(false)} 
      />
    </div>
  );
};

export default MessagePage;