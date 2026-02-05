// src/pages/orders/DeliveryPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPlus, FaUser, FaPhoneAlt, FaMapMarkerAlt, FaCheckCircle, FaTrashAlt } from 'react-icons/fa';
import CreateOrderModal from './CreateOrderModal'; 
import './DeliveryPage.css';

const DeliveryPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Load dữ liệu
  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem('delivery_orders')) || [];
    setOrders(savedOrders);
  }, []);

  // 2. Cập nhật trạng thái
  const updateStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem('delivery_orders', JSON.stringify(updatedOrders));
  };

  // 3. Xóa đơn
  const deleteOrder = (orderId) => {
    if(window.confirm("Bạn có chắc muốn xóa đơn này?")) {
      const updatedOrders = orders.filter(order => order.id !== orderId);
      setOrders(updatedOrders);
      localStorage.setItem('delivery_orders', JSON.stringify(updatedOrders));
    }
  }

  // 4. Tính toán thống kê
  const stats = {
    pending: orders.filter(d => d.status === 'pending').length,
    preparing: orders.filter(d => d.status === 'preparing').length,
    shipping: orders.filter(d => d.status === 'shipping').length,
    completed: orders.filter(d => d.status === 'completed').length,
  };

  const filteredOrders = activeTab === 'all' ? orders : orders.filter(d => d.status === activeTab);

  // Hàm format tiền an toàn
  const formatPrice = (price) => {
    return price ? parseInt(price).toLocaleString('vi-VN') + 'đ' : '0đ';
  };

  return (
    <div className="delivery-container">
      {/* HEADER */}
      <header className="delivery-header">
        <div className="header-left">
          <button className="btn-back" onClick={() => navigate('/dashboard')}>
            <FaArrowLeft /> Dashboard
          </button>
          <div className="header-text">
            <h2>Quản lý Giao hàng</h2>
            <p>Theo dõi và xử lý đơn hàng</p>
          </div>
        </div>
        <button className="btn-create-order" onClick={() => setIsModalOpen(true)}>
          <FaPlus /> Tạo đơn mới
        </button>
      </header>

      {/* STATS CARDS */}
      <div className="stats-row">
        <div className="stat-box box-pending" onClick={() => setActiveTab('pending')} style={{cursor: 'pointer'}}>
          <span>Chờ xử lý</span><h3>{stats.pending}</h3>
        </div>
        <div className="stat-box box-preparing" onClick={() => setActiveTab('preparing')} style={{cursor: 'pointer'}}>
          <span>Đang chuẩn bị</span><h3>{stats.preparing}</h3>
        </div>
        <div className="stat-box box-shipping" onClick={() => setActiveTab('shipping')} style={{cursor: 'pointer'}}>
          <span>Đang giao</span><h3>{stats.shipping}</h3>
        </div>
        <div className="stat-box box-completed" onClick={() => setActiveTab('completed')} style={{cursor: 'pointer'}}>
          <span>Hoàn thành</span><h3>{stats.completed}</h3>
        </div>
      </div>

      {/* TABS */}
      <div className="tabs-container">
        {[
          { id: 'all', label: 'Tất cả' },
          { id: 'pending', label: 'Chờ xử lý' },
          { id: 'preparing', label: 'Đang chuẩn bị' },
          { id: 'shipping', label: 'Đang giao' },
          { id: 'completed', label: 'Hoàn thành' }
        ].map(tab => (
          <button key={tab.id} className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ORDERS GRID */}
      <div className="orders-grid">
        {filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
            <div className="order-card" key={order.id}>
              <div className="card-top">
                <div className="order-id-group">
                  <strong>{order.id}</strong>
                  <span>{order.date}</span>
                </div>
                <span className={`status-badge badge-${order.status}`}>
                  {order.status === 'pending' && '🕒 Chờ xử lý'}
                  {order.status === 'preparing' && '👨‍🍳 Đang chuẩn bị'}
                  {order.status === 'shipping' && '🛵 Đang giao'}
                  {order.status === 'completed' && '✅ Hoàn thành'}
                </span>
              </div>

              <div className="card-body">
                <div className="info-row">
                  <div className="icon-circle"><FaUser /></div>
                  <div className="info-text">
                    <span className="info-label">Khách hàng</span>
                    <strong>{order.customer?.name || 'Khách lẻ'}</strong>
                  </div>
                </div>
                <div className="info-row">
                  <div className="icon-circle"><FaPhoneAlt /></div>
                  <div className="info-text">
                    <span className="info-label">Số điện thoại</span>
                    <strong>{order.customer?.phone || '---'}</strong>
                  </div>
                </div>
                <div className="info-row">
                  <div className="icon-circle"><FaMapMarkerAlt /></div>
                  <div className="info-text">
                    <span className="info-label">Địa chỉ</span>
                    <span style={{fontSize: 13}}>{order.customer?.address || '---'}</span>
                  </div>
                </div>
              </div>

              <div className="card-footer">
                {/* SỬA LỖI Ở ĐÂY: Dùng itemCount và totalAmount */}
                <span className="item-count">{order.itemCount || 0} món</span>
                <span className="total-price">{formatPrice(order.totalAmount)}</span>
              </div>

              <div style={{padding: '10px 15px', borderTop: '1px solid #eee', display: 'flex', gap: '10px', justifyContent: 'flex-end'}}>
                {order.status !== 'completed' && (
                  <button onClick={() => deleteOrder(order.id)} style={{border: 'none', background: 'transparent', color: 'red', cursor: 'pointer'}}>
                    <FaTrashAlt />
                  </button>
                )}

                {order.status === 'pending' && (
                  <button onClick={() => updateStatus(order.id, 'preparing')} style={{padding: '6px 12px', background: '#3B82F6', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 13}}>
                    Nhận đơn
                  </button>
                )}
                {order.status === 'preparing' && (
                  <button onClick={() => updateStatus(order.id, 'shipping')} style={{padding: '6px 12px', background: '#F59E0B', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 13}}>
                    Giao hàng
                  </button>
                )}
                {order.status === 'shipping' && (
                  <button onClick={() => updateStatus(order.id, 'completed')} style={{padding: '6px 12px', background: '#10B981', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 13}}>
                    Hoàn tất
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p style={{ gridColumn: "1 / -1", textAlign: "center", color: "#888", marginTop: "20px" }}>Chưa có đơn hàng nào.</p>
        )}
      </div>

      {/* Modal tạo đơn */}
      <CreateOrderModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default DeliveryPage;