// Màu sắc cho biểu đồ
export const COLORS = [
  "#52c41a", // Xanh lá (Bình thường)
  "#faad14", // Vàng (Sắp hết)
  "#ff4d4f", // Đỏ (Hết hàng)
  "#1890ff", 
  "#722ed1", 
  "#13c2c2"
];

export const CHART_COLORS = {
  nhap: "#52c41a",
  xuat: "#ff4d4f", 
  ton: "#1890ff",
  gradient1: "#87d068",
  gradient2: "#ff7875"
};

// API endpoints
export const API_ENDPOINTS = {
  WAREHOUSES: "https://dx.hoangphucthanh.vn:3000/warehouse/warehouses",
  PRODUCTS: "https://dx.hoangphucthanh.vn:3000/warehouse/products",
  STOCK_IN: "https://dx.hoangphucthanh.vn:3000/warehouse/stock-in",
  STOCK_OUT: "https://dx.hoangphucthanh.vn:3000/warehouse/stock-out",
  INVENTORY: "https://dx.hoangphucthanh.vn:3000/warehouse/inventory"
};

// Table columns configuration
export const TABLE_COLUMNS = [
  { title: 'Mã hàng', dataIndex: 'ma_hang', key: 'ma_hang', width: 120 },
  { title: 'Tên hàng', dataIndex: 'ten_hang', key: 'ten_hang', width: 200 },
  { title: 'Tổng nhập', dataIndex: 'tong_nhap', key: 'tong_nhap', width: 120 },
  { title: 'Tổng xuất', dataIndex: 'tong_xuat', key: 'tong_xuat', width: 120 },
  { 
    title: 'Tồn cuối kỳ', 
    dataIndex: 'ton_cuoi_ky', 
    key: 'ton_cuoi_ky', 
    width: 120,
    render: (val) => val <= 0 ? 
      <span style={{color:'red',fontWeight:600}}> {val} (Hết hàng)</span> : 
      val < 10 ? 
      <span style={{color:'orange',fontWeight:600}}> {val} (Sắp hết)</span> : 
      val
  },
  { title: 'Đơn vị', dataIndex: 'don_vi', key: 'don_vi', width: 100 },
];
