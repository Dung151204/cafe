// src/components/pos/ProductCard.jsx
import React from 'react';
import './ProductCard.css'; // <--- BẠN ĐANG THIẾU DÒNG NÀY

const ProductCard = ({ product, onAddToCart }) => {
  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN') + 'đ';
  };

  return (
    <div className="product-card" onClick={onAddToCart}>
      <div className="product-img">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="product-info">
        <h4 className="product-name">{product.name}</h4>
        <p className="product-price">{formatPrice(product.price)}</p>
      </div>
    </div>
  );
};

export default ProductCard;