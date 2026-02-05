// src/pages/finance/RevenuePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPlus, FaFilter, FaDownload, FaArrowUp, FaArrowDown, FaMoneyBillWave } from 'react-icons/fa';
import AddTransactionModal from './AddTransactionModal'; // Import modal vừa tạo
import './RevenuePage.css'; // File CSS sẽ tạo ở bước 3

// Dữ liệu mẫu (Fake data để hiển thị đẹp)
const MOCK_DATA = [
  { id: 'TRX-01', type: 'income', category: 'Doanh thu bán hàng', description: 'Ca sáng 28/12', amount: 3500000, date: '08:14 28/12', user: 'Nguyễn Văn An' },
  { id: 'TRX-02', type: 'expense', category: 'Nguyên liệu', description: 'Mua cà phê hạt', amount: 1200000, date: '07:14 28/12', user: 'Nguyễn Văn An' },
  { id: 'TRX-03', type: 'expense', category: 'Lương nhân viên', description: 'Tạm ứng lương', amount: 5000000, date: '06:14 28/12', user: 'Quản lý' },
  { id: 'TRX-04', type: 'income', category: 'Doanh thu bán hàng', description: 'Ca chiều 27/12', amount: 4200000, date: '21:34 27/12', user: 'Trần Thị B' },
  { id: 'TRX-05', type: 'expense', category: 'Hóa đơn', description: 'Tiền điện tháng 12', amount: 800000, date: '09:00 27/12', user: 'Quản lý' },
];

const RevenuePage = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load dữ liệu
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('revenue_data'));
    if (savedData && savedData.length > 0) {
      setTransactions(savedData);
    } else {
      setTransactions(MOCK_DATA);
      localStorage.setItem('revenue_data', JSON.stringify(MOCK_DATA));
    }
  }, []);

  // Tính toán
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const profit = totalIncome - totalExpense;

  const filteredList = transactions.filter(t => filterType === 'all' || t.type === filterType);

  // Thêm mới
  const handleAdd = (newItem) => {
    const updated = [newItem, ...transactions];
    setTransactions(updated);
    localStorage.setItem('revenue_data', JSON.stringify(updated));
    setIsModalOpen(false);
  };

  const formatPrice = (price) => parseInt(price).toLocaleString('vi-VN') + 'đ';

  // Hàm phân tích danh mục cho cột bên phải
  const getCategoryAnalysis = (type) => {
    const items = transactions.filter(t => t.type === type);
    const total = items.reduce((sum, t) => sum + t.amount, 0);
    const grouped = items.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});

    return Object.keys(grouped).map(cat => ({
      name: cat,
      amount: grouped[cat],
      percent: total === 0 ? 0 : (grouped[cat] / total) * 100
    })).sort((a, b) => b.amount - a.amount);
  };

  const incomeAnalysis = getCategoryAnalysis('income');
  const expenseAnalysis = getCategoryAnalysis('expense');

  return (
    <div className="revenue-page">
      {/* HEADER */}
      <div className="page-header">
        <div className="header-left">
           <button className="btn-back" onClick={() => navigate('/dashboard')}>
             <FaArrowLeft /> Về Dashboard
           </button>
           <div className="header-text">
             <h2>Báo cáo Thu/Chi</h2>
             <p>Quản lý tài chính và dòng tiền</p>
           </div>
        </div>
        <div className="header-actions">
           <button className="btn-white"><FaFilter /> Lọc ngày</button>
           <button className="btn-white"><FaDownload /> Xuất báo cáo</button>
           <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
             <FaPlus /> Thêm giao dịch
           </button>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="summary-cards">
        <div className="summary-card income">
          <div className="card-icon"><FaArrowUp /></div>
          <div className="card-info"><span>Tổng thu</span><h3>{formatPrice(totalIncome)}</h3></div>
        </div>
        <div className="summary-card expense">
          <div className="card-icon"><FaArrowDown /></div>
          <div className="card-info"><span>Tổng chi</span><h3>{formatPrice(totalExpense)}</h3></div>
        </div>
        <div className="summary-card profit">
          <div className="card-icon"><FaMoneyBillWave /></div>
          <div className="card-info"><span>Lợi nhuận</span><h3>{formatPrice(profit)}</h3></div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="content-grid">
        
        {/* CỘT TRÁI: DANH SÁCH */}
        <div className="transaction-section">
          <div className="tabs">
            <button className={`tab ${filterType === 'all' ? 'active' : ''}`} onClick={() => setFilterType('all')}>Tất cả</button>
            <button className={`tab ${filterType === 'income' ? 'active' : ''}`} onClick={() => setFilterType('income')}>Thu</button>
            <button className={`tab ${filterType === 'expense' ? 'active' : ''}`} onClick={() => setFilterType('expense')}>Chi</button>
          </div>

          <div className="transaction-list">
            {filteredList.map(item => (
              <div className="trx-item" key={item.id}>
                <div className={`trx-icon ${item.type}`}>
                  {item.type === 'income' ? <FaArrowUp /> : <FaArrowDown />}
                </div>
                <div className="trx-details">
                  <h4>{item.category}</h4>
                  <div className="trx-meta">
                    <span className="trx-tag">{item.description}</span>
                    <span>{item.date} • {item.user}</span>
                  </div>
                </div>
                <div className={`trx-amount ${item.type}`}>
                  {item.type === 'income' ? '+' : '-'}{formatPrice(item.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CỘT PHẢI: PHÂN TÍCH */}
        <div className="analysis-section">
          <h3>Phân tích theo danh mục</h3>
          
          <div className="analysis-group">
            <h4 className="text-green">Thu nhập</h4>
            {incomeAnalysis.map((item, idx) => (
              <div className="analysis-row" key={idx}>
                <div className="row-header"><span>{item.name}</span><strong>{formatPrice(item.amount)}</strong></div>
                <div className="progress-bg"><div className="progress-fill green" style={{width: `${item.percent}%`}}></div></div>
              </div>
            ))}
          </div>

          <div className="analysis-group">
            <h4 className="text-red">Chi phí</h4>
            {expenseAnalysis.map((item, idx) => (
              <div className="analysis-row" key={idx}>
                <div className="row-header"><span>{item.name}</span><strong>{formatPrice(item.amount)}</strong></div>
                <div className="progress-bg"><div className="progress-fill red" style={{width: `${item.percent}%`}}></div></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AddTransactionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAdd}
      />
    </div>
  );
};

export default RevenuePage;