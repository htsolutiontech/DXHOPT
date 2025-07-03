import { renderWithErrorHighlight } from '../../../../utils/import/renderHelpers';
import { fetchAndSetList } from '../../../../utils/api/fetchHelpers';

/**
 * Hàm tải danh sách từ API.
 * @param {function} setAccounts - Hàm set state cho danh sách tài khoản.
 * @param {function} setExistingCustomerGroups - Hàm set state cho danh sách nhóm khách hàng.
 */
export const fetchPreviewData = (setAccounts, setExistingCustomerGroups) => {
  fetchAndSetList(
    'https://dx.hoangphucthanh.vn:3000/warehouse/accounts',
    setAccounts,
    'Không thể tải danh sách người dùng'
  );
  fetchAndSetList(
    'https://dx.hoangphucthanh.vn:3000/crm/customer-groups',
    setExistingCustomerGroups,
    'Không thể tải danh sách nhóm khách hàng'
  );
};

/**
 * Kiểm tra xem nhóm khách hàng có tồn tại không.
 * @param {string} value - Giá trị cần kiểm tra.
 * @param {array} existingCustomerGroups - Danh sách nhóm khách hàng hiện có.
 * @returns {boolean} - Kết quả kiểm tra.
 */
export const isCustomerGroupExisting = (value, existingCustomerGroups) => {
  return existingCustomerGroups.some(
    (item) => item.nhom_khach_hang === value
  );
};

/**
 * Kiểm tra xem tài khoản có tồn tại không.
 * @param {string} value - Giá trị cần kiểm tra.
 * @param {array} accounts - Danh sách tài khoản.
 * @returns {boolean} - Kết quả kiểm tra.
 */
export const isAccountExisting = (value, accounts) => {
  return accounts.some((acc) => acc.ma_nguoi_dung === value);
};

/**
 * Hàm render cột "Mã nhóm khách hàng".
 * @param {string} text - Giá trị của ô.
 * @param {object} record - Dữ liệu của dòng hiện tại.
 * @param {array} errorItems - Danh sách lỗi.
 * @param {array} existingCustomerGroups - Danh sách nhóm khách hàng hiện có.
 * @returns {JSX.Element} - Nội dung hiển thị trong ô.
 */
// ...renderMaNhomKhachHang không cần kiểm tra trùng mã nữa, chỉ cần hiển thị mã tự sinh...
export const renderMaNhomKhachHang = (text, record, errorItems) => {
  return renderWithErrorHighlight(text, record, errorItems, 'Mã nhóm khách hàng');
};

/**
 * Hàm render cột "Khách hàng".
 * @param {string} text - Giá trị của ô.
 * @param {object} record - Dữ liệu của dòng hiện tại.
 * @param {array} errorItems - Danh sách lỗi.
 * @param {array} existingCustomerGroups - Danh sách nhóm khách hàng hiện có.
 * @returns {JSX.Element} - Nội dung hiển thị trong ô.
 */
export const renderNhomKhachHang = (text, record, errorItems, existingCustomerGroups) => {
  const customError = isCustomerGroupExisting(text, existingCustomerGroups) ? '(Đã tồn tại)' : null;
  return renderWithErrorHighlight(text, record, errorItems, 'Nhóm khách hàng', customError);
};

/**
 * Hàm render cột "Người cập nhật".
 * @param {string} maNguoiDung - Mã người dùng.
 * @param {object} record - Dữ liệu của dòng hiện tại.
 * @param {array} accounts - Danh sách tài khoản.
 * @param {array} errorItems - Danh sách lỗi.
 * @returns {JSX.Element} - Nội dung hiển thị trong ô.
 */
export const renderNguoiCapNhat = (maNguoiDung, record, accounts, errorItems) => {
  if (record.invalidNguoiCapNhat) {
    return renderWithErrorHighlight('', record, errorItems, 'Người cập nhật', '(Không tồn tại)');
  }

  if (!maNguoiDung || maNguoiDung.trim() === '') {
    return renderWithErrorHighlight('(Trống)', record, errorItems, 'Người cập nhật');
  }

  const account = accounts.find((acc) => acc.ma_nguoi_dung === maNguoiDung);
  return renderWithErrorHighlight(account?.ho_va_ten || maNguoiDung, record, errorItems, 'Người cập nhật');
};