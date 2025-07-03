import React, { lazy, Suspense, useState } from "react";
import { Route, Routes, useNavigate, useLocation, Navigate } from "react-router-dom";

import LayoutApp from "../components/layout/Layout";
import Loading from "../components/common/Loading";
import DashboardLanding from "../components/Dashboard/DashboardLanding";

const Home = lazy(() => import("../components/Home/Home"));
// Import Warehouse
const KhoHang = lazy(() => import("../components/KhoHang/KhoHang/View/KhoHang_Main"));
const HangHoa = lazy(() => import("../components/KhoHang/HangHoa/HangHoa/HangHoa_Main"));
const LoaiHang = lazy(() => import("../components/KhoHang/HangHoa/LoaiHang/LoaiHang_Main"));
const NhaCungCap = lazy(() => import("../components/KhoHang/NhaCungCap/NhaCungCap/NCC_Main"));
const NhapKho = lazy(() => import("../components/KhoHang/NhapKho/NhapKho/NhapKho_Main"));
const NhapKhoThang = lazy(() => import("../components/KhoHang/NhapKho/ThongKeThang/ThongKeThangNK_Main"));
const XuatKho = lazy(() => import("../components/KhoHang/XuatKho/XuatKho/XuatKho_Main"));
const XuatKhoThang = lazy(() => import("../components/KhoHang/XuatKho/ThongKeThang/ThongKeThangXK_Main"));
const XuatKhoKhachHang = lazy(() => import("../components/KhoHang/XuatKho/ThongKeKhachHang/ThongKeKhachHangXK_Main"));
const TonKho = lazy(() => import("../components/KhoHang/TonKho/TonKho/TonKho_Main"));
const TonKhoThang = lazy(() => import("../components/KhoHang/TonKho/ThongKeThang/ThongKeThangTK_Main"));
const BaoCaoKhoHang = lazy(() => import("../components/KhoHang/BaoCaoKhoHang/View/BaoCaoKhoHang_Main"));

// Import CRM
const KhachHang = lazy(() => import("../components/CRM/KhachHang/KhachHang/KhachHang_Main"));
const HopDong = lazy(() => import("../components/CRM/ChungTu/HopDong/HopDong_Main"));
const LoaiHopDong = lazy(() => import("../components/CRM/ChungTu/LoaiHopDong/LoaiHopDong_Main"));
const Bill = lazy(() => import("../components/CRM/ChungTu/Bill/Bill_Main"));
const NguonCoHoi = lazy(() => import("../components/CRM/KhachHangTN/NguonCoHoi/NguonCoHoi_Main"));
const NhomKhachHang = lazy(() => import("../components/CRM/KhachHangTN/NhomKhachHang/NhomKhachHang_Main"));
const KhachHangTiemNang = lazy(() => import("../components/CRM/KhachHangTN/KhachHangTN/KhachHangTN_Main"));
const LoaiTuongTac = lazy(() => import("../components/CRM/ChamSocKH/LoaiTuongTac/LoaiTuongTac_Main"));
const ChamSocKhachHang = lazy(() => import("../components/CRM/ChamSocKH/ChamSocKH/ChamSocKH_Main"));
const LoaiBaoGia = lazy(() => import("../components/CRM/BaoGia/LoaiBaoGia/LoaiBaoGia_Main"));
const TrangThaiBaoGia = lazy(() => import("../components/CRM/BaoGia/TTBaoGia/TTBaoGia_Main"));
const BaoGia = lazy(() => import("../components/CRM/BaoGia/BaoGia/BaoGia_Main"));
const ChiTietBaoGia = lazy(() => import("../components/CRM/BaoGia/ChiTietBaoGia/CTBG_Main"));
const BaoGiaSo = lazy(() => import("../components/CRM/BaoGia/BaoGiaTuDong/BaoGiaSo/BaoGiaSo"));
const DonHang = lazy(() => import("../components/CRM/DatHang/DonHang/DonHang_Main"));
const ChiTietDonHang = lazy(() => import("../components/CRM/DatHang/ChiTietDonHang/CTDH_Main"));
const CTDHThang = lazy(() => import("../components/CRM/DatHang/ThongKeThang/ThongKeThangCTDH_Main"));
const CTDHKhachHang = lazy(() => import("../components/CRM/DatHang/ThongKeKhachHang/ThongKeKhachHangCTDH_Main"));

// Import Administration
const VaiTro = lazy(() => import("../components/QuanTri/VaiTro/VaiTro_Main"));
const TaiKhoan = lazy(() => import("../components/QuanTri/TaiKhoan/TaiKhoan_Main"));
const LichSuDangNhap = lazy(() => import("../components/QuanTri/LichSuDangNhap/Administration.component"));

function MainAppRoutes() {
  const navigate = useNavigate();
  const location = useLocation();

  // Nếu đang ở / hoặc /home thì show dashboard landing
  if (location.pathname === "/" || location.pathname === "/home") {
    return (
      <DashboardLanding
        onSelectSystem={(key) => {
          if (key === 'warehouse') navigate('/system/warehouse');
          else if (key === 'crm') navigate('/system/crm');
          else if (key === 'admin') navigate('/system/admin');
          // ... các phân hệ khác
        }}
      />
    );
  }

  // Menu con theo phân hệ
  let menuType = null;
  if (location.pathname.startsWith("/system/warehouse")) menuType = "warehouse";
  if (location.pathname.startsWith("/system/crm")) menuType = "crm";
  if (location.pathname.startsWith("/system/admin")) menuType = "admin";
  // ...các phân hệ khác...

  // Điều hướng mặc định vào menu con đầu tiên
  if (location.pathname === "/system/warehouse") {
    return <Navigate to="/system/warehouse/products" replace />;
  }
  if (location.pathname === "/system/crm") {
    return <Navigate to="/system/crm/customers" replace />;
  }
  if (location.pathname === "/system/admin") {
    return <Navigate to="/system/admin/login_history" replace />;
  }

  return (
    <LayoutApp menuType={menuType}>
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* Route chính, redirect từ "/" đến "/home" */}
          <Route path="/" element={<Home />} />
          {/* Route Home */}
          <Route path="/home" element={<Home />} />

          {/* Route Warehouses */}
          <Route path="/system/warehouse/warehouse" element={<KhoHang />} />

          {/* Route Suppliers */}
          <Route path="/system/warehouse/suppliers" element={<NhaCungCap />} />

          {/* Route Customers */}
          <Route path="/system/crm/customers" element={<KhachHang />} />

          {/* Route Contracts */}
          <Route path="/system/crm/contracts" element={<HopDong />} />
          <Route path="/system/crm/contract_type" element={<LoaiHopDong />} />
          <Route path="/system/crm/bill" element={<Bill />} />

          {/* Route Quotations */}
          <Route path="/system/crm/quotation_type" element={<LoaiBaoGia />} />
          <Route path="/system/crm/quotation_status" element={<TrangThaiBaoGia />} />
          <Route path="/system/crm/quotations" element={<BaoGia />} />
          <Route path="/system/crm/quotation_detail" element={<ChiTietBaoGia />} />
          <Route path="/system/crm/auto_number_quote" element={<BaoGiaSo />} />
          <Route path="/system/crm/auto_number_quote/:so_bao_gia" element={<BaoGiaSo />} />
          
          {/* Route Potential Customer */}
          <Route path="/system/crm/opportunity_source" element={<NguonCoHoi />} />
          <Route path="/system/crm/customer_group" element={<NhomKhachHang />} />
          <Route path="/system/crm/potential_customer" element={<KhachHangTiemNang />} />

          {/* Route Customer Interaction */}
          <Route path="/system/crm/interaction_type" element={<LoaiTuongTac />} />
          <Route path="/system/crm/customer_interaction" element={<ChamSocKhachHang />} />

          {/* Route Products */}
          <Route path="/system/warehouse/product_type" element={<LoaiHang />} />
          <Route path="/system/warehouse/products" element={<HangHoa />} />

          {/* Route Stock In */}
          <Route path="/system/warehouse/stock_in" element={<NhapKho />} />
          <Route path="/system/warehouse/stock_in_with_month" element={<NhapKhoThang />} />

          {/* Route Stock Out */}
          <Route path="/system/warehouse/stock_out" element={<XuatKho />} />
          <Route path="/system/warehouse/stock_out_with_month" element={<XuatKhoThang />} />
          <Route path="/system/warehouse/stock_out_with_customer" element={<XuatKhoKhachHang />} />

          {/* Route Inventory */}
          <Route path="/system/warehouse/inventory" element={<TonKho />} />
          <Route path="/system/warehouse/inventory_with_month" element={<TonKhoThang />} />

          {/* Route Order */}
          <Route path="/system/crm/order" element={<DonHang />} />
          <Route path="/system/crm/order_detail" element={<ChiTietDonHang />} />
          <Route path="/system/crm/order_detail_with_month" element={<CTDHThang />} />
          <Route path="/system/crm/order_detail_with_customer" element={<CTDHKhachHang />} />

          {/* Route Administration */}
          <Route path="/system/admin/login_history" element={<LichSuDangNhap />} />
          <Route path="/system/admin/role" element={<VaiTro />} />
          <Route path="/system/admin/accounts" element={<TaiKhoan />} />

          {/* Route Report */}
          <Route path="/system/warehouse/warehouse_report" element={<BaoCaoKhoHang />} />
        
          {/* Route 404 hoặc catch-all (tùy chọn) */}
          <Route path="*" element={<Home />} /> {/* Hoặc redirect đến trang 404 */}
        </Routes>
      </Suspense>
    </LayoutApp>
  );
}

export default MainAppRoutes;