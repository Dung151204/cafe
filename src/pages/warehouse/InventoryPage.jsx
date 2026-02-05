// src/pages/warehouse/InventoryPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPlus, FaSearch, FaBox, FaExclamationTriangle, FaChartLine, FaCheckCircle } from 'react-icons/fa';
import AddProductModal from "./AddProductModal"; 
// 1. Import Modal nhập hàng vừa tạo
import ImportStockModal from "./ImportStockModal"; 
import './InventoryPage.css';

// Dữ liệu mẫu
const MOCK_DATA = [
  { id: 'SP001', name: 'Cà phê hạt Arabica', category: 'Cà phê', unit: 'kg', importPrice: 150000, stock: 25, minStock: 20, maxStock: 100, supplier: 'Công ty Cà phê Việt' },
  { id: 'SP002', name: 'Cà phê hạt Robusta', category: 'Cà phê', unit: 'kg', importPrice: 120000, stock: 15, minStock: 20, maxStock: 100, supplier: 'Công ty Cà phê Việt' },
  { id: 'SP003', name: 'Sữa tươi thanh trùng', category: 'Sữa', unit: 'hộp', importPrice: 30000, stock: 2, minStock: 5, maxStock: 50, supplier: 'Vinamilk' },
  { id: 'SP004', name: 'Syrup Đường đen', category: 'Nguyên liệu', unit: 'chai', importPrice: 85000, stock: 45, minStock: 10, maxStock: 60, supplier: 'Torani' },
  { id: 'SP005', name: 'Bột Matcha Nhật', category: 'Nguyên liệu', unit: 'gói', importPrice: 250000, stock: 8, minStock: 5, maxStock: 20, supplier: 'Supplier Japan' }
];

const InventoryPage = () => {
  const navigate = useNavigate();
  const [inventory, setInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all'); 
  
  // State quản lý bộ lọc theo trạng thái (all, danger, warning, normal)
  const [filterStatus, setFilterStatus] = useState('all'); 
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // State cho Modal nhập hàng
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('inventory_data'));
    if (savedData && savedData.length > 0) {
      setInventory(savedData);
    } else {
      setInventory(MOCK_DATA);
      localStorage.setItem('inventory_data', JSON.stringify(MOCK_DATA));
    }
  }, []);

  // Tính toán thống kê
  const stats = {
    total: inventory.length,
    danger: inventory.filter(i => i.stock <= i.minStock).length, // Cần nhập
    warning: inventory.filter(i => i.stock <= i.minStock && i.stock > 0).length, // Sắp hết
    normal: inventory.filter(i => i.stock > i.minStock).length // Bình thường
  };

  // --- LOGIC LỌC SẢN PHẨM ---
  const filteredItems = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeTab === 'all' || item.category === activeTab;

    // Logic lọc theo trạng thái khi bấm vào thẻ
    let matchesStatus = true;
    if (filterStatus === 'danger') {
      matchesStatus = item.stock <= item.minStock; // Thẻ Đỏ
    } else if (filterStatus === 'warning') {
      matchesStatus = item.stock <= item.minStock && item.stock > 0; // Thẻ Cam
    } else if (filterStatus === 'normal') {
      matchesStatus = item.stock > item.minStock; // Thẻ Xanh
    }

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = ['all', ...new Set(inventory.map(item => item.category))];

  // Thêm sản phẩm mới
  const handleAddProduct = (newItem) => {
    const updatedInventory = [newItem, ...inventory];
    setInventory(updatedInventory);
    localStorage.setItem('inventory_data', JSON.stringify(updatedInventory));
    setIsAddModalOpen(false);
  };

  // --- HÀM MỞ MODAL NHẬP HÀNG ---
  const openImportModal = (product) => {
    setSelectedProduct(product);
    setIsImportModalOpen(true);
  };

  // --- HÀM XỬ LÝ NHẬP KHO (Lưu dữ liệu) ---
  const handleImportStock = (productId, quantityToAdd, newPrice) => {
    const updatedInventory = inventory.map(item => {
      if (item.id === productId) {
        return {
          ...item,
          stock: item.stock + quantityToAdd, // Cộng dồn tồn kho
          importPrice: newPrice // Cập nhật giá mới
        };
      }
      return item;
    });

    setInventory(updatedInventory);
    localStorage.setItem('inventory_data', JSON.stringify(updatedInventory));
    setIsImportModalOpen(false);
    setSelectedProduct(null);
    alert("Đã nhập kho thành công!");
  };

  const formatPrice = (price) => parseInt(price).toLocaleString('vi-VN') + 'đ';

  return (
    <div className="inventory-page">
      <div className="page-header">
        <div className="header-left">
           <button className="btn-back" onClick={() => navigate('/dashboard')}>
             <FaArrowLeft /> Về Dashboard
           </button>
           <div className="header-text">
             <h2>Quản lý Kho hàng</h2>
             <p>Theo dõi tồn kho và nguyên liệu</p>
           </div>
        </div>
        <div className="header-actions">
           <div className="search-box">
              <FaSearch className="search-icon"/>
              <input type="text" placeholder="Tìm sản phẩm..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
           </div>
           <button className="btn-add-product" onClick={() => setIsAddModalOpen(true)}>
             <FaPlus /> Thêm sản phẩm
           </button>
        </div>
      </div>

      {/* STATS CARDS - ĐÃ GẮN SỰ KIỆN CLICK */}
      <div className="stats-container">
        <div 
          className={`stat-card blue ${filterStatus === 'all' ? 'active' : ''}`}
          onClick={() => setFilterStatus('all')}
        >
           <div className="card-label">Tổng mặt hàng</div>
           <div className="card-value">{stats.total}</div>
        </div>
        <div 
          className={`stat-card red ${filterStatus === 'danger' ? 'active' : ''}`}
          onClick={() => setFilterStatus('danger')}
        >
           <div className="card-label">Cần nhập hàng</div>
           <div className="card-value"><FaExclamationTriangle /> {stats.danger}</div>
        </div>
        <div 
          className={`stat-card orange ${filterStatus === 'warning' ? 'active' : ''}`}
          onClick={() => setFilterStatus('warning')}
        >
           <div className="card-label">Sắp hết</div>
           <div className="card-value"><FaChartLine /> {stats.warning}</div>
        </div>
        <div 
          className={`stat-card green ${filterStatus === 'normal' ? 'active' : ''}`}
          onClick={() => setFilterStatus('normal')}
        >
           <div className="card-label">Bình thường</div>
           <div className="card-value"><FaCheckCircle /> {stats.normal}</div>
        </div>
      </div>

      <div className="tabs-container">
        {categories.map(cat => (
          <button key={cat} className={`tab-btn ${activeTab === cat ? 'active' : ''}`} onClick={() => setActiveTab(cat)}>
            {cat === 'all' ? 'Tất cả' : cat}
          </button>
        ))}
      </div>

      <div className="inventory-grid">
        {filteredItems.length === 0 ? (
          <div style={{gridColumn: '1 / -1', textAlign: 'center', padding: 40, color: '#888'}}>
            Không tìm thấy sản phẩm nào phù hợp.
          </div>
        ) : (
          filteredItems.map(item => {
            const progressPercent = Math.min((item.stock / item.maxStock) * 100, 100);
            let statusClass = 'normal';
            let statusLabel = '';
            if (item.stock === 0) { statusClass = 'out'; statusLabel = 'Hết hàng'; }
            else if (item.stock <= item.minStock) { statusClass = 'low'; statusLabel = '⚠ Cần nhập'; }

            return (
              <div className="inv-card" key={item.id}>
                <div className="card-top">
                  <div className="item-icon"><FaBox /></div>
                  <div className="item-header">
                    <h4>{item.name}</h4>
                    <span className="cat-badge">{item.category}</span>
                  </div>
                  {statusLabel && <span className={`status-tag ${statusClass}`}>{statusLabel}</span>}
                </div>

                <div className="stock-progress">
                  <div className="progress-info">
                     <span>Tồn kho</span>
                     <strong>{item.stock} / {item.maxStock} {item.unit}</strong>
                  </div>
                  <div className="progress-bar-bg">
                     <div className={`progress-bar-fill ${statusClass}`} style={{width: `${progressPercent}%`}}></div>
                  </div>
                </div>

                <div className="card-details">
                  <div className="detail-row"><span>Tồn tối thiểu:</span><strong>{item.minStock} {item.unit}</strong></div>
                  <div className="detail-row"><span>Nhà cung cấp:</span><span className="supplier-name">{item.supplier}</span></div>
                  <div className="detail-row highlight-price"><span>Giá nhập:</span><strong>{formatPrice(item.importPrice)} / {item.unit}</strong></div>
                </div>

                {/* NÚT NHẬP HÀNG - ĐÃ GẮN HÀM */}
                <button className="btn-import" onClick={() => openImportModal(item)}>
                  Nhập hàng
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL THÊM SẢN PHẨM */}
      <AddProductModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddProduct}
      />

      {/* MODAL NHẬP KHO (MỚI) */}
      <ImportStockModal 
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        product={selectedProduct}
        onConfirm={handleImportStock}
      />
    </div>
  );
};

export default InventoryPage;