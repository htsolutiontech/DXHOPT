import { renderWithErrorHighlight } from '../../../utils/import/renderHelpers';
import { fetchAndSetList } from '../../../utils/api/fetchHelpers';

/**
 * Hàm tải danh sách từ API.
 * @param {function} setAccounts - Hàm set state cho danh sách tài khoản.
 * @param {function} setExistingQuotationTypes - Hàm set state cho danh sách loại báo giá.
 */
export const fetchPreviewData = (setAccounts, setExistingQuotationTypes) => {
  fetchAndSetList(
    'https://dx.hoangphucthanh.vn:3000/warehouse/accounts',
    setAccounts,
    'Không thể tải danh sách người dùng'
  );
  fetchAndSetList(
    'https://dx.hoangphucthanh.vn:3000/crm/quotation-types',
    setExistingQuotationTypes,
    'Không thể tải danh sách loại báo giá'
  );
};

/**
 * Kiểm tra xem loại báo giá có tồn tại không.
 * @param {string} value - Giá trị cần kiểm tra.
 * @param {array} existingQuotationTypes - Danh sách loại báo giá hiện có.
 * @returns {boolean} - Kết quả kiểm tra.
 */
export const isQuotationTypeExisting = (value, existingQuotationTypes) => {
  return existingQuotationTypes.some(
    (item) => item.loai_bao_gia === value
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
 * Hàm render cột "Mã loại báo giá".
 * @param {string} text - Giá trị của ô.
 * @param {object} record - Dữ liệu của dòng hiện tại.
 * @param {array} errorItems - Danh sách lỗi.
 * @param {array} existingQuotationTypes - Danh sách loại báo giá hiện có.
 * @returns {JSX.Element} - Nội dung hiển thị trong ô.
 */
// ...renderMaLoaiBaoGia không cần kiểm tra trùng mã nữa, chỉ cần hiển thị mã tự sinh...
export const renderMaLoaiBaoGia = (text, record, errorItems) => {
  return renderWithErrorHighlight(text, record, errorItems, 'Mã loại báo giá');
};

/**
 * Hàm render cột "Báo giá".
 * @param {string} text - Giá trị của ô.
 * @param {object} record - Dữ liệu của dòng hiện tại.
 * @param {array} errorItems - Danh sách lỗi.
 * @param {array} existingQuotationTypes - Danh sách loại báo giá hiện có.
 * @returns {JSX.Element} - Nội dung hiển thị trong ô.
 */
export const renderLoaiBaoGia = (text, record, errorItems, existingQuotationTypes) => {
  const customError = isQuotationTypeExisting(text, existingQuotationTypes) ? '(Đã tồn tại)' : null;
  return renderWithErrorHighlight(text, record, errorItems, 'Loại báo giá', customError);
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