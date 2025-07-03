import React, { useState, useEffect } from "react";
import { Typography, Tag, Spin, Row } from "antd";
import KhoHang_Add from "../Function/KhoHang_Add";
import KhoHang_Update from "../Function/KhoHang_Update";
import KhoHang_Delete from "../Function/KhoHang_Delete";
import KhoHang_Filter from "../Function/KhoHang_Filter";
import { getWarehouses, getAccountList } from "../Function/khoHangApi";
import dayjs from "dayjs/esm/index.js";
import axios from "axios";
import WarehouseCard from "./WarehouseCard";
import WarehouseFilterBar from "./WarehouseFilterBar";
const { Title } = Typography;


export default function KhoHang_Main() {
  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");
  const [openAdd, setOpenAdd] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selected, setSelected] = useState(null);
  // Đã bỏ filter người quản lý
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [month, setMonth] = useState(dayjs());
  const [exchangeRate, setExchangeRate] = useState(null);
  const [stockIn, setStockIn] = useState([]);
  const [stockOut, setStockOut] = useState([]);
  const [products, setProducts] = useState([]);
  const [availableMonths, setAvailableMonths] = useState([]);

  useEffect(() => {
    fetchWarehouses();
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchStockIn();
    fetchStockOut();
  }, [month]);

  const fetchWarehouses = async () => {
    setLoading(true);
    try {
      const res = await getWarehouses();
      let data = res.data?.data || [];
      if (!Array.isArray(data)) data = data ? [data] : [];
      setList(data);
    } finally {
      setLoading(false);
    }
  };

  // Đã bỏ fetchAccounts

  const fetchProducts = async () => {
    const res = await axios.get("https://dx.hoangphucthanh.vn:3000/warehouse/products");
    const productsData = res.data?.data || [];
    setProducts(productsData);
    
    // Tạo danh sách tháng từ price list trong products
    const monthsFromPriceList = new Set();
    
    productsData.forEach(product => {
      if (product.ngay_gia) {
        const month = dayjs(product.ngay_gia);
        monthsFromPriceList.add(month.format('YYYY-MM'));
      }
      if (product.price_list) {
        // Price list có thể có format như "2024-11" hoặc tương tự
        const priceListMonth = dayjs(product.price_list, ['YYYY-MM', 'MM/YYYY', 'YYYY-MM-DD'], true);
        if (priceListMonth.isValid()) {
          monthsFromPriceList.add(priceListMonth.format('YYYY-MM'));
        }
      }
    });
    
    // Chuyển Set thành Array và sort
    const sortedMonths = Array.from(monthsFromPriceList).sort().reverse();
    setAvailableMonths(sortedMonths);
    
    // Set month mặc định là tháng gần nhất từ price list
    if (sortedMonths.length > 0 && !month) {
      setMonth(dayjs(sortedMonths[0], 'YYYY-MM'));
    }
  };

  const fetchStockIn = async () => {
    if (!month) return setStockIn([]);
    const res = await axios.get("https://dx.hoangphucthanh.vn:3000/warehouse/stock-in");
    const monthStr = month.format("YYYY-MM");
    const filtered = (res.data?.data || []).filter(item =>
      item.ngay_nhap_hang && dayjs(item.ngay_nhap_hang).format("YYYY-MM") === monthStr
    );
    setStockIn(filtered);
  };

  const fetchStockOut = async () => {
    if (!month) return setStockOut([]);
    const res = await axios.get("https://dx.hoangphucthanh.vn:3000/warehouse/stock-out");
    const monthStr = month.format("YYYY-MM");
    const filtered = (res.data?.data || []).filter(item =>
      item.ngay_xuat_hang && dayjs(item.ngay_xuat_hang).format("YYYY-MM") === monthStr
    );
    setStockOut(filtered);
  };

  // For each product, we need to calculate:
  // 1. Total value of goods imported (entries), exported (sales), and remaining in stock (inventory)
  // 2. Based on the actual monthly price of that product
  // Product prices are defined per month in a 'price_list' array for each product
  // The calculation must always use the price for the selected month (if available)
  const calcWarehouseValue = (ma_kho) => {
    const monthStr = month ? month.format('YYYY-MM') : null;
    if (!monthStr) return {
      importEuro: 0,
      importVND: null,
      exportEuro: 0,
      exportVND: null,
      remainEuro: 0,
      remainVND: null
    };

    // Helper to get actual price for a product in the selected month
    const getActualPrice = (product) => {
      if (Array.isArray(product.price_list)) {
        const priceObj = product.price_list.find(pl => {
          if (!pl.month) return false;
          const plMonth = dayjs(pl.month, ['YYYY-MM', 'MM/YYYY', 'YYYY-MM-DD'], true).format('YYYY-MM');
          return plMonth === monthStr;
        });
        return priceObj?.gia_thuc ?? product.gia_thuc ?? 0;
      }
      return product.gia_thuc ?? 0;
    };

    // Tính tổng giá trị nhập kho
    let importEuro = 0;
    stockIn.filter(item => item.ten_kho === ma_kho).forEach(item => {
      const prod = products.find(p => p.ma_hang === item.ma_hang);
      if (prod) {
        const price = getActualPrice(prod);
        importEuro += price * (item.so_luong_nhap || 0);
      }
    });

    // Tính tổng giá trị xuất kho
    let exportEuro = 0;
    stockOut.filter(item => item.ten_kho === ma_kho).forEach(item => {
      const prod = products.find(p => p.ma_hang === item.ma_hang);
      if (prod) {
        const price = getActualPrice(prod);
        exportEuro += price * (item.so_luong_xuat || 0);
      }
    });

    // Giá trị tồn kho = nhập - xuất
    let remainEuro = importEuro - exportEuro;
    return {
      importEuro,
      importVND: exchangeRate ? Math.round(importEuro * exchangeRate) : null,
      exportEuro,
      exportVND: exchangeRate ? Math.round(exportEuro * exchangeRate) : null,
      remainEuro,
      remainVND: exchangeRate ? Math.round(remainEuro * exchangeRate) : null
    };
  };

  const filteredList = list.filter((kho) =>
    kho.ten_kho.toLowerCase().includes(search.toLowerCase())
  ).filter(kho => {
    if (statusFilter === "") return true;
    return kho.tinh_trang === statusFilter;
  });

  const handleEdit = (kho) => {
    setSelected(kho);
    setOpenUpdate(true);
  };

  const handleDelete = (kho) => {
    setSelected(kho);
    setOpenDelete(true);
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={3} style={{ marginBottom: 24 }}>Danh sách Kho Hàng</Title>
      
      <WarehouseFilterBar
        search={search}
        setSearch={setSearch}
        month={month}
        setMonth={setMonth}
        exchangeRate={exchangeRate}
        setExchangeRate={setExchangeRate}
        availableMonths={availableMonths}
        onAdd={() => setOpenAdd(true)}
        onResetFilters={() => {
          setSearch("");
          setMonth(null);
          setExchangeRate(null);
          setStatusFilter("");
        }}
      />
      <div style={{ marginBottom: 24 }}>
        <Tag
          color={statusFilter === "" ? "blue" : "default"}
          onClick={() => setStatusFilter("")}
          style={{ cursor: 'pointer' }}
        >
          Tất cả trạng thái
        </Tag>
        <Tag
          color={statusFilter === "Đang hoạt động" ? "green" : "default"}
          onClick={() => setStatusFilter("Đang hoạt động")}
          style={{ cursor: 'pointer' }}
        >
          Đang hoạt động
        </Tag>
        <Tag
          color={statusFilter === "Bảo trì" ? "orange" : "default"}
          onClick={() => setStatusFilter("Bảo trì")}
          style={{ cursor: 'pointer' }}
        >
          Bảo trì
        </Tag>
      </div>
      <Spin spinning={loading}>
        <Row gutter={[16, 16]}>
          {filteredList.map((kho) => (
            <WarehouseCard
              kho={kho}
              value={calcWarehouseValue(kho.ma_kho)}
              onEdit={handleEdit}
              onDelete={handleDelete}
              key={kho.ma_kho}
            />
          ))}
        </Row>
      </Spin>
      {/* Dialogs */}
      <KhoHang_Add
        open={openAdd}
        onSuccess={() => {
          setOpenAdd(false);
          fetchWarehouses();
        }}
        onCancel={() => setOpenAdd(false)}
      />
      <KhoHang_Update
        data={selected}
        open={openUpdate}
        onSuccess={() => {
          setOpenUpdate(false);
          fetchWarehouses();
        }}
        onCancel={() => setOpenUpdate(false)}
      />
      <KhoHang_Delete
        data={selected}
        open={openDelete}
        onSuccess={() => {
          setOpenDelete(false);
          fetchWarehouses();
        }}
        onCancel={() => setOpenDelete(false)}
      />
    </div>
  );
}
