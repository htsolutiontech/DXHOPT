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
export async function getAccountList() {
  // Đổi lại URL cho đúng API backend của bạn!
  return axios.get("https://dx.hoangphucthanh.vn:3000/warehouse/accounts");
}