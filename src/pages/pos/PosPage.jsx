// src/pages/pos/PosPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaUser, FaTrash, FaMinus, FaPlus, FaSave } from 'react-icons/fa';
import ProductCard from '../../components/pos/ProductCard';
import PaymentModal from '../../components/pos/PaymentModal';
import { PRODUCTS_DATA } from '../../data/products';
import './PosPage.css';

const CATEGORIES_FIXED = [
  { id: 'coffee', name: 'Cà phê', icon: '☕' },
  { id: 'tea', name: 'Trà', icon: '🍃' },
  { id: 'smoothie', name: 'Sinh tố', icon: '🥤' },
  { id: 'food', name: 'Đồ ăn', icon: '🥪' },
  { id: 'topping', name: 'Topping', icon: '➕' },
];

const PosPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeCategory, setActiveCategory] = useState('coffee');
  const [cart, setCart] = useState([]); 
  const [selectedTableId, setSelectedTableId] = useState(''); 
  const [customerName, setCustomerName] = useState(''); 
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  
  const [availableAreas, setAvailableAreas] = useState([]);
  const [availableTables, setAvailableTables] = useState([]);

  const activeTableOrder = location.state && location.state.activeTableOrder;
  const isDeliveryOrder = location.state && location.state.deliveryCustomer;

  useEffect(() => {
    const storedAreas = JSON.parse(localStorage.getItem('areas_data')) || [];
    const storedTables = JSON.parse(localStorage.getItem('tables_data')) || [];
    setAvailableAreas(storedAreas);
    setAvailableTables(storedTables);

    if (isDeliveryOrder) {
      const { customerName, phone } = location.state.deliveryCustomer;
      setCustomerName(`${customerName} - ${phone}`);
      setSelectedTableId(''); 
    } 
    else if (activeTableOrder) {
      setCustomerName(activeTableOrder.tableName);
      setCart(activeTableOrder.items || []);
      setSelectedTableId(activeTableOrder.tableId);
    }
  }, [location, isDeliveryOrder, activeTableOrder]);

  const filteredProducts = PRODUCTS_DATA.filter(p => p.category === activeCategory);

  const handleAddToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      return existing 
        ? prev.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) 
        : [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, amt) => {
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(item.quantity + amt, 1) } : item));
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(item => item.id !== id));

  const totalAmount = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const formatPrice = (price) => price.toLocaleString('vi-VN') + 'đ';

  const updateTableInStorage = (status, shouldClearCart) => {
    const currentTables = JSON.parse(localStorage.getItem('tables_data')) || [];
    const updatedTables = currentTables.map(t => {
      if (t.id === selectedTableId) {
         if (status === 'occupied') {
             return { 
               ...t, 
               status: 'occupied', 
               items: cart, 
               total: totalAmount,
               time: new Date().toLocaleTimeString('vi-VN', {hour:'2-digit', minute:'2-digit'}),
               orderId: t.orderId || `OD-${Date.now().toString().slice(-4)}`
             };
         } else {
             return { ...t, status: 'empty', items: [], total: 0, orderId: '', time: '' };
         }
      }
      return t;
    });
    localStorage.setItem('tables_data', JSON.stringify(updatedTables));
    if (shouldClearCart) {
        setCart([]);
        setSelectedTableId('');
        setCustomerName('');
    }
  };

  const handleSaveOrder = () => {
    if (!selectedTableId) {
        alert("Vui lòng chọn bàn để báo bếp!");
        return;
    }
    updateTableInStorage('occupied', true);
    alert("Đã lưu đơn! Bàn sẽ chuyển sang trạng thái 'Có khách'.");
    navigate('/khu-vuc'); 
  };

  const handlePaymentSuccess = (paymentMethodCode) => {
    const status = paymentMethodCode === 'later' ? 'pending' : 'completed';
    
    let methodDisplay = 'Tiền mặt';
    if(paymentMethodCode === 'card') methodDisplay = 'Thẻ';
    if(paymentMethodCode === 'transfer') methodDisplay = 'Chuyển khoản';
    if(paymentMethodCode === 'later') methodDisplay = 'Thanh toán sau';

    // --- BƯỚC 1: LẤY ID CA LÀM VIỆC HIỆN TẠI ---
    const activeShift = JSON.parse(localStorage.getItem('active_shift'));
    const currentShiftId = activeShift ? activeShift.id : null;

    const orderData = {
      id: `DH-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleString('vi-VN'),
      customer: { name: customerName || "Khách lẻ" },
      tableId: selectedTableId || "Mang về",
      items: cart,
      itemCount: cart.length,
      totalAmount: totalAmount,
      paymentMethod: methodDisplay, 
      status: status,
      // --- BƯỚC 2: GẮN ID CA VÀO ĐƠN HÀNG ---
      shiftId: currentShiftId 
    };

    if (isDeliveryOrder) {
      const deliveryOrders = JSON.parse(localStorage.getItem('delivery_orders')) || [];
      const newDelivery = { ...orderData, status: 'pending', id: `DEL-${Date.now().toString().slice(-6)}` };
      localStorage.setItem('delivery_orders', JSON.stringify([newDelivery, ...deliveryOrders]));
      alert("Đã tạo đơn giao hàng thành công!");
      navigate('/giao-hang');
    } else {
      const historyOrders = JSON.parse(localStorage.getItem('all_orders')) || [];
      localStorage.setItem('all_orders', JSON.stringify([orderData, ...historyOrders]));

      if (selectedTableId) {
          updateTableInStorage('empty', true);
      } else {
          setCart([]);
      }

      setIsPaymentModalOpen(false);
      
      if(status === 'pending') alert("Đã lưu vào công nợ (Thanh toán sau)!");
      else alert("Thanh toán thành công!");
      
      navigate('/lich-su-don'); 
    }
  };

  return (
    <div className="pos-layout">
      <header className="pos-header">
        <div className="header-left">
          <button className="btn-back" onClick={() => navigate(activeTableOrder ? '/khu-vuc' : '/dashboard')}>
            <FaArrowLeft /> {activeTableOrder ? "Quay lại Khu vực" : "Dashboard"}
          </button>
          <div className="header-title">
            <strong>Bán hàng tại quầy</strong>
          </div>
        </div>
      </header>

      <div className="pos-content">
        <div className="category-sidebar" style={{ width: 90, background: 'white', borderRight: '1px solid #ddd', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 20 }}>
          {CATEGORIES_FIXED.map((cat) => (
            <div key={cat.id} onClick={() => setActiveCategory(cat.id)} style={{ width: 70, height: 70, marginBottom: 15, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: 12, cursor: 'pointer', backgroundColor: activeCategory === cat.id ? '#eff6ff' : 'transparent', color: activeCategory === cat.id ? '#2563EB' : '#666', border: activeCategory === cat.id ? '1px solid #2563EB' : '1px solid transparent' }}>
              <div style={{ fontSize: 24, marginBottom: 5 }}>{cat.icon}</div>
              <span style={{ fontSize: 11 }}>{cat.name}</span>
            </div>
          ))}
        </div>

        <div className="product-list-section">
          <div className="product-grid">
            {filteredProducts.map((item) => (
              <ProductCard key={item.id} product={item} onAddToCart={() => handleAddToCart(item)} />
            ))}
          </div>
        </div>

        <div className="cart-sidebar">
          <div className="cart-header">
            <h3>Đơn hàng</h3>
            <span className="badge-count">{cart.length} món</span>
          </div>

          <div className="customer-info">
             <div className="input-group">
                <FaUser className="input-icon"/>
                <input type="text" placeholder="Tên khách hàng..." value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
             </div>
             <div className="input-group">
                <select className="table-select" value={selectedTableId} onChange={(e) => setSelectedTableId(e.target.value)} disabled={isDeliveryOrder}>
                  <option value="">Khách mang về / Chờ lấy</option>
                  
                  {availableAreas.map(area => (
                    <optgroup key={area.id} label={area.name}>
                      {availableTables.filter(t => t.areaId === area.id).map(table => (
                        <option key={table.id} value={table.id}>{table.name}</option>
                      ))}
                    </optgroup>
                  ))}

                </select>
             </div>
          </div>

          <div className="cart-items-list">
            {cart.map((item) => (
                <div className="cart-item" key={item.id}>
                  <div className="item-info"><strong>{item.name}</strong><span>{formatPrice(item.price)}</span></div>
                  <div className="item-actions">
                    <button onClick={() => updateQuantity(item.id, -1)}><FaMinus size={10}/></button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)}><FaPlus size={10}/></button>
                  </div>
                  <div className="item-total">{formatPrice(item.price * item.quantity)}</div>
                  <button className="btn-remove" onClick={() => removeFromCart(item.id)}><FaTrash /></button>
                </div>
              ))}
          </div>

          <div className="cart-footer">
            <div className="price-row total"><span>Tổng cộng:</span><span className="total-price">{formatPrice(totalAmount)}</span></div>
            
            <div style={{display: 'flex', gap: '10px', marginTop: '10px'}}>
                <button 
                    className="btn-checkout" 
                    style={{backgroundColor: '#F59E0B', flex: 1}} 
                    disabled={cart.length === 0} 
                    onClick={handleSaveOrder}
                >
                    <FaSave style={{marginRight: 5}}/> Báo bếp
                </button>

                <button 
                    className="btn-checkout" 
                    style={{flex: 1}} 
                    disabled={cart.length === 0} 
                    onClick={() => setIsPaymentModalOpen(true)}
                >
                    Thanh toán
                </button>
            </div>
          </div>
        </div>
      </div>

      <PaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        totalAmount={totalAmount}
        onPaymentSuccess={handlePaymentSuccess}
        tableName={selectedTableId ? `Bàn ${selectedTableId}` : (customerName || "Khách mang về")}
      />
    </div>
  );
};

export default PosPage;