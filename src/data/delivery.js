// src/data/delivery.js

export const DELIVERY_DATA = [
  // --- ĐANG GIAO (SHIPPING) ---
  {
    id: "DEL001",
    date: "01:07 28-12",
    status: "shipping", // đang giao
    customer: { name: "Nguyễn Văn A", phone: "0901234567", address: "123 Nguyễn Huệ, Q.1, TP.HCM" },
    driver: { name: "Trần Văn B" },
    estimated: "01:52",
    items: 3,
    total: 245000
  },
  {
    id: "DEL005",
    date: "20:14 28-12",
    status: "shipping",
    customer: { name: "Hoàng Văn G", phone: "0945678901", address: "654 Hai Bà Trưng, Q.1, TP.HCM" },
    driver: { name: "Lê Văn H" },
    estimated: "21:09",
    items: 4,
    total: 380000
  },

  // --- ĐANG CHUẨN BỊ (PREPARING) ---
  {
    id: "DEL002",
    date: "01:27 28-12",
    status: "preparing", // đang chuẩn bị
    customer: { name: "Trần Thị C", phone: "0912345678", address: "456 Lê Lợi, Q.1, TP.HCM" },
    estimated: "02:07",
    items: 2,
    total: 156000
  },

  // --- CHỜ XỬ LÝ (PENDING) ---
  {
    id: "DEL006",
    date: "21:01 28-12",
    status: "pending", // chờ xử lý
    customer: { name: "abc", phone: "1234", address: "aaaaaa" },
    estimated: "22:01",
    items: 1,
    total: 10
  },
  {
    id: "DEL003",
    date: "20:54 28-12",
    status: "pending",
    customer: { name: "Lê Văn D", phone: "0923456789", address: "789 Trần Hưng Đạo, Q.5, TP.HCM" },
    items: 5,
    total: 420000
  },

  // --- HOÀN THÀNH (COMPLETED) ---
  {
    id: "DEL004",
    date: "19:29 28-12",
    status: "completed", // hoàn thành
    customer: { name: "Phạm Thị E", phone: "0934567890", address: "321 Võ Văn Tần, Q.3, TP.HCM" },
    driver: { name: "Nguyễn Văn F" },
    items: 1,
    total: 85000
  }
];