import { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import dayjs from './dayjs-plugins';
import { API_ENDPOINTS } from '../constants';

export const useWarehouseData = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [stockIn, setStockIn] = useState([]);
  const [stockOut, setStockOut] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [wRes, pRes, inRes, outRes, invRes] = await Promise.all([
          axios.get(API_ENDPOINTS.WAREHOUSES),
          axios.get(API_ENDPOINTS.PRODUCTS),
          axios.get(API_ENDPOINTS.STOCK_IN),
          axios.get(API_ENDPOINTS.STOCK_OUT),
          axios.get(API_ENDPOINTS.INVENTORY),
        ]);

        setWarehouses(wRes.data.data || []);
        setProducts(pRes.data.data || []);
        setStockIn(inRes.data.data || []);
        setStockOut(outRes.data.data || []);
        setInventory(invRes.data.data || []);
      } catch (error) {
        console.error('Error fetching warehouse data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    warehouses,
    products,
    stockIn,
    stockOut,
    inventory,
    loading
  };
};

export const useWarehouseFilters = () => {
  const [selectedWarehouse, setSelectedWarehouse] = useState({ ma_kho: 'ALL', ten_kho: 'Tất cả kho' });
  const [dateRange, setDateRange] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filterByAll = useCallback((arr, dateField, from, to, ma_kho, ma_hang) => {
    return arr.filter(item => {
      let ok = true;
      if (ma_kho && ma_kho !== 'ALL') ok = ok && item.ten_kho === ma_kho;
      if (ma_hang) ok = ok && item.ma_hang === ma_hang;
      if (from && to && item[dateField]) {
        const d = dayjs(item[dateField]);
        const fromDay = dayjs(from).startOf('day');
        const toDay = dayjs(to).endOf('day');
        ok = ok && d.isSameOrAfter(fromDay) && d.isSameOrBefore(toDay);
      }
      return ok;
    });
  }, []);

  const resetFilters = useCallback(() => {
    setSelectedWarehouse({ ma_kho: 'ALL', ten_kho: 'Tất cả kho' });
    setDateRange([]);
    setSelectedProduct(null);
  }, []);

  return {
    selectedWarehouse,
    setSelectedWarehouse,
    dateRange,
    setDateRange,
    selectedProduct,
    setSelectedProduct,
    filterByAll,
    resetFilters
  };
};

export const useWarehouseCalculations = (
  { stockIn, stockOut, inventory, products },
  { selectedWarehouse, dateRange, selectedProduct, filterByAll }
) => {
  // Tổng hợp nhập-xuất-tồn cho từng sản phẩm
  const bangNhapXuatTon = useMemo(() => {
    // Debug log để kiểm tra giá trị filter
    console.log('Filter debug:', {
      selectedWarehouse,
      dateRange,
      selectedProduct,
      stockInLength: stockIn.length,
      stockOutLength: stockOut.length,
      inventoryLength: inventory.length,
      productsLength: products.length
    });
    // Mặc định là "Tất cả kho" nếu không có warehouse được chọn
    const ma_kho = selectedWarehouse?.ma_kho || 'ALL';
    // Sử dụng đúng trường ngày theo API
    const nhap = filterByAll(stockIn, 'ngay_nhap_hang', dateRange[0], dateRange[1], ma_kho, selectedProduct?.ma_hang);
    const xuat = filterByAll(stockOut, 'ngay_xuat_hang', dateRange[0], dateRange[1], ma_kho, selectedProduct?.ma_hang);
    // Xử lý inventory cho trường hợp "Tất cả kho"
    const ton = ma_kho === 'ALL' 
      ? inventory.filter(t => (!selectedProduct || t.ma_hang === selectedProduct.ma_hang))
      : inventory.filter(t => t.ten_kho === ma_kho && (!selectedProduct || t.ma_hang === selectedProduct.ma_hang));
    return (selectedProduct ? products.filter(p => p.ma_hang === selectedProduct.ma_hang) : products).map(prod => {
      const nhapHang = nhap.filter(i => i.ma_hang === prod.ma_hang);
      const xuatHang = xuat.filter(o => o.ma_hang === prod.ma_hang);
      // Tính tổng tồn kho cho trường hợp "Tất cả kho"
      const tonCuoiKy = ma_kho === 'ALL' 
        ? ton.filter(t => t.ma_hang === prod.ma_hang).reduce((sum, t) => sum + (t.ton_hien_tai || 0), 0)
        : (ton.find(t => t.ma_hang === prod.ma_hang)?.ton_hien_tai || 0);
      const tongNhap = nhapHang.reduce((sum, i) => sum + (i.so_luong_nhap || 0), 0);
      const tongXuat = xuatHang.reduce((sum, o) => sum + (o.so_luong_xuat || 0), 0);
      return {
        ten_hang: prod.ten_hang,
        ma_hang: prod.ma_hang,
        tong_nhap: tongNhap,
        tong_xuat: tongXuat,
        ton_cuoi_ky: tonCuoiKy,
        don_vi: prod.don_vi_ban_hang,
      };
    }).filter(row => row.tong_nhap > 0 || row.tong_xuat > 0 || row.ton_cuoi_ky > 0);
  }, [selectedWarehouse, dateRange, selectedProduct, stockIn, stockOut, inventory, products, filterByAll]);

  // Tổng hợp theo tháng
  const tongHopTheoThang = useMemo(() => {
    // Mặc định là "Tất cả kho" nếu không có warehouse được chọn
    const ma_kho = selectedWarehouse?.ma_kho || 'ALL';
    const nhap = filterByAll(stockIn, 'ngay_nhap_hang', dateRange[0], dateRange[1], ma_kho, selectedProduct?.ma_hang);
    const xuat = filterByAll(stockOut, 'ngay_xuat_hang', dateRange[0], dateRange[1], ma_kho, selectedProduct?.ma_hang);
    
    const nhapTheoThang = {};
    nhap.forEach(i => {
      const thang = dayjs(i.ngay_nhap_hang).format('YYYY-MM');
      nhapTheoThang[thang] = (nhapTheoThang[thang] || 0) + (i.so_luong_nhap || 0);
    });
    
    const xuatTheoThang = {};
    xuat.forEach(o => {
      const thang = dayjs(o.ngay_xuat_hang).format('YYYY-MM');
      xuatTheoThang[thang] = (xuatTheoThang[thang] || 0) + (o.so_luong_xuat || 0);
    });
    
    const allMonths = Array.from(new Set([...Object.keys(nhapTheoThang), ...Object.keys(xuatTheoThang)])).sort();
    let tonTruoc = 0;
    
    return allMonths.map(month => {
      const nhap = nhapTheoThang[month] || 0;
      const xuat = xuatTheoThang[month] || 0;
      const ton = tonTruoc + nhap - xuat;
      tonTruoc = ton;
      return {
        month,
        tong_nhap: nhap,
        tong_xuat: xuat,
        ton_cuoi_ky: ton
      };
    });
  }, [selectedWarehouse, dateRange, selectedProduct, stockIn, stockOut, filterByAll]);

  // Data cho PieChart
  const pieData = useMemo(() => [
    { name: "Bình thường", value: bangNhapXuatTon.filter(r => r.ton_cuoi_ky >= 10).length },
    { name: "Sắp hết", value: bangNhapXuatTon.filter(r => r.ton_cuoi_ky > 0 && r.ton_cuoi_ky < 10).length },
    { name: "Hết hàng", value: bangNhapXuatTon.filter(r => r.ton_cuoi_ky <= 0).length },
  ], [bangNhapXuatTon]);

  return {
    bangNhapXuatTon,
    tongHopTheoThang,
    pieData
  };
};
