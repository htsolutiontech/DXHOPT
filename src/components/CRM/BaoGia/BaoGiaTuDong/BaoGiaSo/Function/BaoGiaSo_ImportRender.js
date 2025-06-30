import { renderWithErrorHighlight } from '../../../../../utils/import/renderHelpers';
import { fetchAndSetList } from '../../../../../utils/api/fetchHelpers';

/**
 * Hàm tải danh sách từ API.
 * @param {function} setProducts - Hàm set state cho danh sách hàng hóa.
 * @param {function} setExistingStockIn - Hàm set state cho danh sách nhập kho.
 * @param {function} setExistingStockOut - Hàm set state cho danh sách xuất kho.
 */
export const fetchPreviewData = (setProducts, setExistingStockIn, setExistingStockOut) => {
  fetchAndSetList(
    'https://dx.hoangphucthanh.vn:3000/warehouse/products',
    setProducts,
    'Không thể tải danh sách hàng hóa'
  );
  fetchAndSetList(
    'https://dx.hoangphucthanh.vn:3000/warehouse/stock-in',
    setExistingStockIn,
    'Không thể tải danh sách nhập kho'
  );
  fetchAndSetList(
    'https://dx.hoangphucthanh.vn:3000/warehouse/stock-out',
    setExistingStockOut,
    'Không thể tải danh sách xuất kho'
  );
};

/**
 * Kiểm tra xem hàng hóa có tồn tại không.
 * @param {string} value - Giá trị cần kiểm tra.
 * @param {array} products - Danh sách hàng hóa hiện có.
 * @returns {boolean} - Kết quả kiểm tra.
 */
export const isProductExisting = (value, products) => {
  return products.some(
    (pd) => pd.ma_hang === value || pd.ten_hang === value
  );
};

/**
 * Hàm render cột "Mã hàng".
 * @param {string} maHang - Mã hàng.
 * @param {object} record - Dữ liệu của dòng hiện tại.
 * @param {array} products - Danh sách hàng hóa.
 * @param {array} errorItems - Danh sách lỗi.
 * @returns {JSX.Element} - Nội dung hiển thị trong ô.
 */
export const renderMaHang = (maHang, record, products, errorItems) => {
  if (record.invalidMaHang) {
    return renderWithErrorHighlight('', record, errorItems, 'Mã hàng', '(Không tồn tại)');
  }

  if (!maHang || maHang.trim() === '') {
    return renderWithErrorHighlight('(Trống)', record, errorItems, 'Mã hàng');
  }

  const product = products.find((pd) => pd.ma_hang === maHang);
  return renderWithErrorHighlight(product?.ma_hang || maHang, record, errorItems, 'Mã hàng');
};

/**
 * Render cột "Số lượng báo giá" với kiểm tra tồn kho
 */
export const renderSoLuongBaoGia = (soLuong, record, errorItems) => {
  const displayValue = (soLuong === null || soLuong === undefined) ? '' : soLuong.toString();
  if (record.invalidSoLuongBaoGia) {
    return renderWithErrorHighlight(
      displayValue,
      record,
      errorItems,
      'Số lượng',
      `(Vượt tồn kho: ${record.tonKhoHienCo ?? 0})`
    );
  }
  return renderWithErrorHighlight(displayValue, record, errorItems, 'Số lượng');
};