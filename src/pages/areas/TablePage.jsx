// src/pages/areas/TablePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPlus, FaCog, FaUtensils, FaClock, FaUserFriends, FaRegCalendarAlt, FaPhone } from 'react-icons/fa';
import ManageAreaModal from './ManageAreaModal';
import AddTableModal from './AddTableModal';
import ReservationModal from './ReservationModal';
import './TablePage.css';

// Dữ liệu mẫu ban đầu
const INITIAL_AREAS = [
  { id: 'area1', name: 'Sân vườn', icon: '🌳' },
  { id: 'area2', name: 'Phòng VIP', icon: '👑' },
  { id: 'area3', name: 'Tầng 2', icon: '🏢' },
  { id: 'area4', name: 'Sân thượng', icon: '☁️' },
];

const INITIAL_TABLES = [
  { id: 't1', name: 'B01', areaId: 'area1', status: 'empty', orderId: '', time: '', guests: 0, total: 0 },
  { id: 't2', name: 'B02', areaId: 'area1', status: 'empty', orderId: '', time: '', guests: 0, total: 0 },
  { id: 't3', name: 'B03', areaId: 'area1', status: 'empty', orderId: '', time: '', guests: 0, total: 0 },
  { id: 't4', name: 'B04', areaId: 'area1', status: 'empty', orderId: '', time: '', guests: 0, total: 0 },
  { id: 't5', name: 'B05', areaId: 'area1', status: 'empty', orderId: '', time: '', guests: 0, total: 0 },
  { id: 't6', name: 'V01', areaId: 'area2', status: 'empty', orderId: '', time: '', guests: 0, total: 0 },
  { id: 't7', name: 'T2-01', areaId: 'area3', status: 'empty', orderId: '', time: '', guests: 0, total: 0 },
  { id: 't8', name: 'T2-02', areaId: 'area3', status: 'empty', orderId: '', time: '', guests: 0, total: 0 },
];

const TablePage = () => {
  const navigate = useNavigate();
  // State khởi tạo rỗng để đợi load từ LocalStorage
  const [areas, setAreas] = useState([]);
  const [tables, setTables] = useState([]);
  const [activeArea, setActiveArea] = useState('');
  
  const [showAreaModal, setShowAreaModal] = useState(false);
  const [showTableModal, setShowTableModal] = useState(false);
  const [showResModal, setShowResModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);

  // --- 1. LOAD DỮ LIỆU KHI MỞ TRANG ---
  useEffect(() => {
    // Load Khu vực
    const savedAreas = localStorage.getItem('areas_data');
    if (savedAreas) {
      const parsedAreas = JSON.parse(savedAreas);
      setAreas(parsedAreas);
      setActiveArea(parsedAreas[0]?.id);
    } else {
      setAreas(INITIAL_AREAS);
      setActiveArea(INITIAL_AREAS[0].id);
      localStorage.setItem('areas_data', JSON.stringify(INITIAL_AREAS));
    }

    // Load Bàn
    const savedTables = localStorage.getItem('tables_data');
    if (savedTables) {
      setTables(JSON.parse(savedTables));
    } else {
      setTables(INITIAL_TABLES);
      localStorage.setItem('tables_data', JSON.stringify(INITIAL_TABLES));
    }
  }, []);

  // --- HÀM LƯU TRỮ ---
  const saveAreas = (newAreas) => {
    setAreas(newAreas);
    localStorage.setItem('areas_data', JSON.stringify(newAreas));
  };

  const saveTables = (newTables) => {
    setTables(newTables);
    localStorage.setItem('tables_data', JSON.stringify(newTables));
  };

  const filteredTables = tables.filter(t => t.areaId === activeArea);
  
  const stats = {
    empty: tables.filter(t => t.status === 'empty').length,
    occupied: tables.filter(t => t.status === 'occupied').length,
    reserved: tables.filter(t => t.status === 'reserved').length,
    total: tables.length
  };

  const handleAddArea = (name) => {
    saveAreas([...areas, { id: `area-${Date.now()}`, name, icon: '📍' }]);
  };

  const handleDeleteArea = (id) => {
    if (window.confirm('Xóa khu vực này sẽ xóa cả các bàn bên trong?')) {
      saveAreas(areas.filter(a => a.id !== id));
      saveTables(tables.filter(t => t.areaId !== id));
      if (activeArea === id) setActiveArea(areas[0]?.id || '');
    }
  };

  const handleAddTable = ({ name, areaId }) => {
    const newTable = { id: `tbl-${Date.now()}`, name, areaId, status: 'empty', total: 0 };
    saveTables([...tables, newTable]);
  };

  const handleTableClick = (table) => {
    if (table.status === 'empty') {
      setSelectedTable(table);
      setShowResModal(true);
    } 
    else if (table.status === 'reserved') {
      const action = window.confirm(`Khách đặt ${table.resName} đã đến?`);
      if (action) {
        const updated = tables.map(t => t.id === table.id ? { ...t, status: 'empty', resName: null } : t);
        saveTables(updated);
        alert("Đã nhận khách! Vui lòng chọn món.");
      }
    } 
    else if (table.status === 'occupied') {
        // Chuyển sang POS với dữ liệu
        navigate('/pos', { 
          state: { 
            activeTableOrder: {
              tableId: table.id,
              tableName: table.name,
              orderId: table.orderId,
              items: table.items || [] 
            } 
          } 
        });
    }
  };

  const handleConfirmReservation = (info) => {
    const updated = tables.map(t => {
      if (t.id === selectedTable.id) {
        return { ...t, status: 'reserved', resName: info.resName, resPhone: info.resPhone, resTime: info.resTime, guests: info.guests };
      }
      return t;
    });
    saveTables(updated);
    setShowResModal(false);
  };

  const formatPrice = (price) => (price || 0).toLocaleString('vi-VN') + 'đ';

  return (
    <div className="table-page">
      <div className="page-header">
        <div className="header-left">
           <button className="btn-back" onClick={() => navigate('/dashboard')}><FaArrowLeft /> Dashboard</button>
           <div className="header-text">
             <h2>Quản lý bàn</h2>
             <p>{new Date().toLocaleString('vi-VN', {weekday: 'short', hour:'2-digit', minute:'2-digit'})}</p>
           </div>
        </div>
        <div className="header-status">
           <span className="dot green"></span> Trống: <strong>{stats.empty}</strong>
           <span className="dot red"></span> Có khách: <strong>{stats.occupied}</strong>
           <span className="dot yellow"></span> Đã đặt: <strong>{stats.reserved}</strong>
           <span className="dot gray"></span> Tổng: <strong>{stats.total} bàn</strong>
        </div>
        <div className="header-actions">
           <button className="btn-white" onClick={() => navigate('/pos')}><FaUtensils /> Chọn món</button>
           <button className="btn-blue" onClick={() => setShowTableModal(true)}><FaPlus /> Thêm bàn</button>
           <button className="btn-gray" onClick={() => setShowAreaModal(true)}><FaCog /> Quản lý khu vực</button>
        </div>
      </div>

      <div className="area-tabs">
        {areas.map(area => {
          const reservedCount = tables.filter(t => t.areaId === area.id && t.status === 'reserved').length;
          return (
            <button key={area.id} className={`area-tab ${activeArea === area.id ? 'active' : ''}`} onClick={() => setActiveArea(area.id)}>
              {area.icon} {area.name}
              {reservedCount > 0 && <span className="tab-badge">{reservedCount}</span>}
            </button>
          );
        })}
      </div>

      <div className="table-grid">
        {filteredTables.map(table => (
          <div key={table.id} className={`table-card ${table.status}`} onClick={() => handleTableClick(table)} style={{cursor: 'pointer'}}>
            <div className="card-header">
              <span className={`status-dot ${table.status}`}></span>
              <h3>{table.name}</h3>
              <span className="status-label">
                {table.status === 'empty' && 'Trống'}
                {table.status === 'occupied' && 'Có khách'}
                {table.status === 'reserved' && 'Đã đặt'}
              </span>
            </div>
            <div className="card-body">
              {table.status === 'empty' ? (
                <div className="empty-state"><div className="icon-empty"><FaUserFriends /></div><p>Chạm để đặt bàn</p></div>
              ) : table.status === 'occupied' ? (
                <div className="occupied-info">
                  <div className="row"><span>Mã đơn:</span> <strong>{table.orderId || '---'}</strong></div>
                  <div className="row"><FaClock className="icon"/> {table.time || 'Vừa xong'}</div>
                  <div className="row"><FaUserFriends className="icon"/> {table.guests || 2} người</div>
                  <div className="total-price">Tổng: {formatPrice(table.total)}</div>
                </div>
              ) : (
                <div className="reserved-info">
                  <div className="row"><FaRegCalendarAlt className="icon"/> <strong>{table.resName}</strong></div>
                  <div className="row"><FaPhone className="icon"/> {table.resPhone || '---'}</div>
                  <div className="row"><FaClock className="icon"/> {table.resTime}</div>
                  <div className="row"><FaUserFriends className="icon"/> {table.guests} người</div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <ManageAreaModal isOpen={showAreaModal} onClose={() => setShowAreaModal(false)} areas={areas} onAddArea={handleAddArea} onDeleteArea={handleDeleteArea} />
      <AddTableModal isOpen={showTableModal} onClose={() => setShowTableModal(false)} areas={areas} onAddTable={handleAddTable} />
      <ReservationModal isOpen={showResModal} onClose={() => setShowResModal(false)} tableName={selectedTable?.name} onConfirm={handleConfirmReservation} />
    </div>
  );
};

export default TablePage;