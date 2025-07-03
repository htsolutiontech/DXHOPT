import { renderWithErrorHighlight } from '../../../../utils/import/renderHelpers';
import { fetchAndSetList } from '../../../../utils/api/fetchHelpers';

/**
 * Hàm tải danh sách từ API.
 * @param {function} setAccounts - Hàm set state cho danh sách tài khoản.
 * @param {function} setInteractionTypes - Hàm set state cho danh sách tương tác khách hàng.
 * @param {function} setExistingCustomerInteractions - Hàm set state cho danh sách hàng.
 */
export const fetchPreviewData = (setAccounts, setInteractionTypes, setExistingCustomerInteractions) => {
  fetchAndSetList(
    'https://dx.hoangphucthanh.vn:3000/warehouse/accounts',
    setAccounts,
    'Không thể tải danh sách người dùng'
  );
  fetchAndSetList(
    'https://dx.hoangphucthanh.vn:3000/crm/interaction-types',
    setInteractionTypes,
    'Không thể tải danh sách loại tương tác'
  );
  fetchAndSetList(
    'https://dx.hoangphucthanh.vn:3000/crm/customer-interactions',
    setExistingCustomerInteractions,
    'Không thể tải danh sách tương tác khách hàng'
  );
};

/**
 * Kiểm tra xem hàng có tồn tại không.
 * @param {string} value - Giá trị cần kiểm tra.
 * @param {array} existingCustomerInteractions - Danh sách hàng hiện có.
 * @returns {boolean} - Kết quả kiểm tra.
 */
export const isCustomerInteractionExisting = (value, existingCustomerInteractions) => {
  return existingCustomerInteractions.some(
    (cust) => cust.ma_tuong_tac_khach_hang === value || cust.ten_khach_hang === value
  );
};

/**
 * Kiểm tra xem tương tác khách hàng có tồn tại không (theo mã hoặc tên).
 * @param {string} value - Giá trị cần kiểm tra.
 * @param {array} interaction_types - Danh sách tương tác khách hàng.
 * @returns {boolean} - Kết quả kiểm tra.
 */
export const isInteractionTypeExisting = (value, interaction_types) => {
  return interaction_types.some(
    (ct) => ct.ma_loai_tuong_tac === value || ct.loai_tuong_tac === value
  );
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
 * Hàm render cột "Tên tương tác khách hàng".
 * @param {string} maLoaiTuongTac - Mã tương tác khách hàng.
 * @param {object} record - Dữ liệu của dòng hiện tại.
 * @param {array} interaction_types - Danh sách tài khoản.
 * @param {array} errorItems - Danh sách lỗi.
 * @returns {JSX.Element} - Nội dung hiển thị trong ô.
 */
export const renderLoaiTuongTac = (maLoaiTuongTac, record, interaction_types, errorItems) => {
  if (record.invalidLoaiTuongTac) {
    return renderWithErrorHighlight('', record, errorItems, 'Loại tương tác', '(Không tồn tại)');
  }

  if (!maLoaiTuongTac || maLoaiTuongTac.trim() === '') {
    return renderWithErrorHighlight('(Trống)', record, errorItems, 'Loại tương tác');
  }

  const interaction_type = interaction_types.find((acc) => acc.ma_loai_tuong_tac === maLoaiTuongTac);
  return renderWithErrorHighlight(interaction_type?.loai_tuong_tac || maLoaiTuongTac, record, errorItems, 'Loại tương tác');
};