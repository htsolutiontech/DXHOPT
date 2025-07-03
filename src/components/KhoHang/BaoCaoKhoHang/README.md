# 📊 BaoCaoKhoHang Module

## Tổng quan
Module báo cáo kho hàng đã được **tái cấu trúc hoàn toàn** từ 1 file lớn (634 dòng) thành 8 file nhỏ để dễ quản lý, maintain và tái sử dụng. 

**Kết quả**: ✅ Build thành công, ✅ Dev server hoạt động, ✅ UI/UX được cải thiện, ✅ ResizeObserver error đã được suppress.

## Cấu trúc thư mục

```
BaoCaoKhoHang/
├── Components/           # UI Components
│   ├── PageHeader.jsx    # Header với tiêu đề page
│   ├── FilterControls.jsx # Bộ lọc (kho, tháng, sản phẩm)
│   ├── SummaryCards.jsx  # Cards tóm tắt số liệu
│   ├── ChartSection.jsx  # Biểu đồ (ComposedChart, PieChart)
│   └── DataTable.jsx     # Bảng dữ liệu chi tiết
├── hooks/               # Custom React Hooks
│   └── useWarehouseData.js # Data fetching và state management
├── constants/           # Hằng số và cấu hình
│   └── index.js         # Colors, API endpoints, table columns
├── View/               # Main component
│   └── BaoCaoKhoHang_Main.jsx # Component chính đã được refactor
└── index.js            # Export barrel file
```

## Components

### 1. PageHeader
- Hiển thị tiêu đề trang với gradient background
- Responsive design
- Props: không có

### 2. FilterControls
- Bộ lọc cho kho hàng, thời gian, sản phẩm
- Nút làm mới dữ liệu
- Props: warehouses, products, selectedWarehouse, setSelectedWarehouse, dateRange, setDateRange, selectedProduct, setSelectedProduct, onRefresh

### 3. SummaryCards
- 6 thẻ tóm tắt với icons và số liệu
- Gradient backgrounds và hover effects
- Props: bangNhapXuatTon

### 4. ChartSection
- ComposedChart cho biểu đồ nhập-xuất-tồn theo tháng
- PieChart cho phân tích tồn kho
- Custom tooltips và labels
- Props: tongHopTheoThang, pieData, bangNhapXuatTon

### 5. DataTable
- Bảng dữ liệu chi tiết với pagination
- Conditional rendering cho trạng thái hàng hóa
- Loading state
- Props: bangNhapXuatTon, loading

## Custom Hooks

### useWarehouseData()
- Fetch dữ liệu từ API
- Quản lý loading state
- Returns: { warehouses, products, stockIn, stockOut, inventory, loading }

### useWarehouseFilters()
- Quản lý state của các bộ lọc
- Filter logic cho dữ liệu
- Returns: { selectedWarehouse, setSelectedWarehouse, dateRange, setDateRange, selectedProduct, setSelectedProduct, filterByAll }

### useWarehouseCalculations()
- Tính toán dữ liệu cho biểu đồ và bảng
- Memoized calculations
- Returns: { bangNhapXuatTon, tongHopTheoThang, pieData }

## Constants

### COLORS
- Màu sắc cho PieChart
- Màu cho trạng thái hàng hóa

### CHART_COLORS
- Màu sắc cho ComposedChart
- Gradient colors

### API_ENDPOINTS
- URLs cho các API calls

## Sử dụng

```jsx
import { BaoCaoKhoHang_Main } from './components/BaoCaoKhoHang';

// Hoặc import riêng lẻ
import { 
  PageHeader, 
  FilterControls, 
  useWarehouseData 
} from './components/BaoCaoKhoHang';
```

## Performance Optimizations

- Sử dụng useMemo cho expensive calculations
- useCallback cho event handlers
- Component splitting để giảm bundle size
- Lazy loading có thể implement trong tương lai

## Lợi ích của việc refactor

1. **Maintainability**: Mỗi component có responsibility riêng
2. **Reusability**: Components có thể tái sử dụng
3. **Testability**: Dễ dàng test từng component riêng
4. **Performance**: Code splitting và lazy loading
5. **Developer Experience**: Dễ đọc và debug hơn
6. **Scalability**: Dễ dàng thêm features mới
