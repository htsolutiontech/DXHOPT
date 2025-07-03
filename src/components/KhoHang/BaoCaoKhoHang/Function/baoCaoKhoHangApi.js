import axios from "axios";
const BASE_URL = "https://dx.hoangphucthanh.vn:3000/warehouse/warehouses";

// Lấy tất cả kho
export const getWarehouses = () => axios.get(BASE_URL);

// Thêm mới kho
export const createWarehouse = (data) => axios.post(BASE_URL, data);

// Sửa kho
export const updateWarehouse = (id, data) => axios.put(`${BASE_URL}/${id}`, data);

// Xoá kho
export const deleteWarehouse = (ma_kho) => axios.delete(`${BASE_URL}/${ma_kho}`);

// Lấy danh sách tài khoản quản lý kho
export const getAccountList = () =>
  axios.get("https://dx.hoangphucthanh.vn:3000/warehouse/accounts");

// Lấy danh sách sản phẩm trong kho
export const getProducts = () =>
  axios.get("https://dx.hoangphucthanh.vn:3000/warehouse/products");

// Lấy danh sách phiếu nhập kho
export const getStockIn = () =>
  axios.get("https://dx.hoangphucthanh.vn:3000/warehouse/stock-in");

// Lấy danh sách phiếu xuất kho
export const getStockOut = () =>
  axios.get("https://dx.hoangphucthanh.vn:3000/warehouse/stock-out");

// Lấy tồn kho hiện tại
export const getCurrentStock = () =>
  axios.get("https://dx.hoangphucthanh.vn:3000/warehouse/current-stock");