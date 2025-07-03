import { renderWithErrorHighlight } from '../../../../utils/import/renderHelpers';
import { fetchAndSetList } from '../../../../utils/api/fetchHelpers';

/**
 * Hàm tải danh sách từ API.
 * @param {function} setAccounts - Hàm set state cho danh sách tài khoản.
 * @param {function} setOpportunitySources - Hàm set state cho danh sách nguồn cơ hội.
 * @param {function} setCustomerGroups - Hàm set state cho danh sách nhóm khách
 * @param {function} setExistingCustomers - Hàm set state cho danh sách khách hàng.
 */
export const fetchPreviewData = (setAccounts, setOpportunitySources, setCustomerGroups, setExistingCustomers) => {
  fetchAndSetList(
    'https://dx.hoangphucthanh.vn:3000/warehouse/accounts',
    setAccounts,
    'Không thể tải danh sách người dùng'
  );
  fetchAndSetList(
    'https://dx.hoangphucthanh.vn:3000/crm/opportunity-sources',
    setOpportunitySources,
    'Không thể tải danh sách nguồn cơ hội'
  );
  fetchAndSetList(
    'https://dx.hoangphucthanh.vn:3000/crm/customer-groups',
    setCustomerGroups,
    'Không thể tải danh sách nhóm khách hàng'
  );
  fetchAndSetList(
    'https://dx.hoangphucthanh.vn:3000/crm/potential-customers',
    setExistingCustomers,
    'Không thể tải danh sách khách hàng tiềm năng'
  );
};

/**
 * Kiểm tra xem khách hàng có tồn tại không.
 * @param {string} value - Giá trị cần kiểm tra.
 * @param {array} existingPotentialCustomers - Danh sách khách hàng hiện có.
 * @returns {boolean} - Kết quả kiểm tra.
 */
export const isPotentialCustomerExisting = (value, existingPotentialCustomers) => {
  return existingPotentialCustomers.some(
    (cust) => cust.ma_khach_hang_tiem_nang === value || cust.ten_khach_hang === value
  );
};

/**
 * Hàm render cột "Khách hàng tiềm năng".
 * @param {string} text - Giá trị của ô.
 * @param {object} record - Dữ liệu của dòng hiện tại.
 * @param {array} errorItems - Danh sách lỗi.
 * @param {array} existingPotentialCustomers - Danh sách khách hàng hiện có.
 * @returns {JSX.Element} - Nội dung hiển thị trong ô.
 */
export const renderTenKhachHang = (text, record, errorItems, existingPotentialCustomers) => {
  const customError = isPotentialCustomerExisting(text, existingPotentialCustomers) ? '(Đã tồn tại)' : null;
  return renderWithErrorHighlight(text, record, errorItems, 'Khách hàng tiềm năng', customError);
};

/**
 * Hàm render cột "Người phụ trách".
 * @param {string} maNguoiDung - Mã người dùng.
 * @param {object} record - Dữ liệu của dòng hiện tại.
 * @param {array} accounts - Danh sách tài khoản.
 * @param {array} errorItems - Danh sách lỗi.
 * @returns {JSX.Element} - Nội dung hiển thị trong ô.
 */
export const renderNguoiPhuTrach = (maNguoiDung, record, accounts, errorItems) => {
  if (record.invalidNguoiPhuTrach) {
    return renderWithErrorHighlight('', record, errorItems, 'Người phụ trách', '(Không tồn tại)');
  }

  if (!maNguoiDung || maNguoiDung.trim() === '') {
    return renderWithErrorHighlight('(Trống)', record, errorItems, 'Người phụ trách');
  }

  const account = accounts.find((acc) => acc.ma_nguoi_dung === maNguoiDung);
  return renderWithErrorHighlight(account?.ho_va_ten || maNguoiDung, record, errorItems, 'Người phụ trách');
};

/**
 * Hàm render cột "Nguồn tiếp cận".
 * @param {string} maNguon - Mã người dùng.
 * @param {object} record - Dữ liệu của dòng hiện tại.
 * @param {array} sources - Danh sách tài khoản.
 * @param {array} errorItems - Danh sách lỗi.
 * @returns {JSX.Element} - Nội dung hiển thị trong ô.
 */
export const renderNguonTiepCan = (maNguon, record, sources, errorItems) => {
  if (record.invalidNguonTiepCan) {
    return renderWithErrorHighlight('', record, errorItems, 'Nguồn tiếp cận', '(Không tồn tại)');
  }

  if (!maNguon || maNguon.trim() === '') {
    return renderWithErrorHighlight('(Trống)', record, errorItems, 'Nguồn tiếp cận');
  }

  const source = sources.find((acc) => acc.ma_nguon === maNguon);
  return renderWithErrorHighlight(source?.nguon || maNguon, record, errorItems, 'Nguồn tiếp cận');
};

/**
 * Hàm render cột "Nhóm khách hàng".
 * @param {string} maNhomKhachHang - Mã người dùng.
 * @param {object} record - Dữ liệu của dòng hiện tại.
 * @param {array} customer_groups - Danh sách tài khoản.
 * @param {array} errorItems - Danh sách lỗi.
 * @returns {JSX.Element} - Nội dung hiển thị trong ô.
 */
export const renderNhomKhachHang = (maNhomKhachHang, record, customer_groups, errorItems) => {
  if (record.invalidNhomKhachHang) {
    return renderWithErrorHighlight('', record, errorItems, 'Nhóm khách hàng', '(Không tồn tại)');
  }

  if (!maNhomKhachHang || maNhomKhachHang.trim() === '') {
    return renderWithErrorHighlight('(Trống)', record, errorItems, 'Nhóm khách hàng');
  }

  const customer_group = customer_groups.find((acc) => acc.ma_nhom_khach_hang === maNhomKhachHang);
  return renderWithErrorHighlight(customer_group?.nhom_khach_hang || maNhomKhachHang, record, errorItems, 'Nhóm khách hàng');
};