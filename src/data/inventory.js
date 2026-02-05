// src/data/inventory.js

export const INVENTORY_DATA = [
  { 
    id: 'SP001', 
    name: 'Cà phê hạt Arabica', 
    category: 'Cà phê', 
    unit: 'kg', 
    importPrice: 150000, // Giá nhập
    stock: 25, 
    minStock: 20, 
    maxStock: 100,
    supplier: 'Công ty Cà phê Việt'
  },
  { 
    id: 'SP002', 
    name: 'Cà phê hạt Robusta', 
    category: 'Cà phê', 
    unit: 'kg', 
    importPrice: 120000, 
    stock: 15, 
    minStock: 20, 
    maxStock: 100,
    supplier: 'Công ty Cà phê Việt'
  },
  { 
    id: 'SP003', 
    name: 'Sữa tươi thanh trùng', 
    category: 'Sữa', 
    unit: 'hộp', 
    importPrice: 30000, 
    stock: 2, 
    minStock: 5, 
    maxStock: 50,
    supplier: 'Vinamilk'
  },
  { 
    id: 'SP004', 
    name: 'Syrup Đường đen', 
    category: 'Nguyên liệu', 
    unit: 'chai', 
    importPrice: 85000, 
    stock: 45, 
    minStock: 10, 
    maxStock: 60,
    supplier: 'Torani'
  },
  { 
    id: 'SP005', 
    name: 'Bột Matcha Nhật', 
    category: 'Nguyên liệu', 
    unit: 'gói', 
    importPrice: 250000, 
    stock: 8, 
    minStock: 5, 
    maxStock: 20,
    supplier: 'Supplier Japan'
  }
];