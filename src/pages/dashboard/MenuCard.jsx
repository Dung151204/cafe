// src/components/dashboard/MenuCard.jsx
import React from 'react';
import './MenuCard.css';

const MenuCard = ({ title, subtitle, icon, onClick, color }) => {
  return (
    <div className="menu-card" onClick={onClick}>
      {/* Icon nằm trong hộp màu nhạt (màu gốc + độ trong suốt) */}
      <div 
        className="icon-wrapper" 
        style={{ color: color, backgroundColor: `${color}15` }} 
      >
        {icon}
      </div>
      
      <div className="card-content">
        <h3>{title}</h3>
        {/* Dòng mô tả nhỏ màu xám */}
        <p className="subtitle">{subtitle}</p>
      </div>
    </div>
  );
};

export default MenuCard;