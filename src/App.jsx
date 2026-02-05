import { BrowserRouter, Routes, Route } from 'react-router-dom';

// --- 1. IMPORT CÁC TRANG ---
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import PosPage from './pages/pos/PosPage';
import InventoryPage from './pages/warehouse/InventoryPage';
import RevenuePage from './pages/finance/RevenuePage';
import OrderHistoryPage from './pages/orders/lichsu/OrderHistoryPage';
import DeliveryPage from './pages/orders/banhang/DeliveryPage';
import TablePage from './pages/areas/TablePage';
import MessagePage from './pages/communication/MessagePage';

// IMPORT TRANG QUẢN LÝ CA (MỚI)
import ShiftPage from './pages/shift/ShiftPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Mặc định vào là trang Login */}
        <Route path="/" element={<LoginPage />} />

        {/* Trang chủ */}
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* --- QUẢN LÝ CA LÀM VIỆC (QUAN TRỌNG) --- */}
        <Route path="/ca-lam-viec" element={<ShiftPage />} />

        {/* Các chức năng khác */}
        <Route path="/pos" element={<PosPage />} />
        <Route path="/kho-hang" element={<InventoryPage />} />
        <Route path="/thu-chi" element={<RevenuePage />} />
        <Route path="/lich-su-don" element={<OrderHistoryPage />} />
        <Route path="/giao-hang" element={<DeliveryPage />} />
        <Route path="/khu-vuc" element={<TablePage />} />
        <Route path="/tin-nhan" element={<MessagePage />} />

        {/* Nếu gõ linh tinh thì về Login */}
        <Route path="*" element={<LoginPage />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App;