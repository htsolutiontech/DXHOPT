import { renderWithErrorHighlight } from '../../../utils/import/renderHelpers';
import { fetchAndSetList } from '../../../utils/api/fetchHelpers';

/**
 * Hàm tải danh sách từ API.
 * @param {function} setAccounts - Hàm set state cho danh sách tài khoản.
 * @param {function} setExistingQuotationStatuses - Hàm set state cho danh sách trạng thái báo giá.
 */
export const fetchPreviewData = (setAccounts, setExistingQuotationStatuses) => {
  fetchAndSetList(
    'https://dx.hoangphucthanh.vn:3000/warehouse/accounts',
    setAccounts,
    'Không thể tải danh sách người dùng'
  );
  fetchAndSetList(
    'https://dx.hoangphucthanh.vn:3000/crm/quotation-statuses',
    setExistingQuotationStatuses,
    'Không thể tải danh sách trạng thái báo giá'
  );
};

/**
 * Kiểm tra xem trạng thái báo giá có tồn tại không.
 * @param {string} value - Giá trị cần kiểm tra.
 * @param {array} existingQuotationStatuses - Danh sách trạng thái báo giá hiện có.
 * @returns {boolean} - Kết quả kiểm tra.
 */
export const isQuotationStatusExisting = (value, existingQuotationStatuses) => {
  return existingQuotationStatuses.some(
    (item) => item.trang_thai_bao_gia === value
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
 * Hàm render cột "Mã trạng thái báo giá".
 * @param {string} text - Giá trị của ô.
 * @param {object} record - Dữ liệu của dòng hiện tại.
 * @param {array} errorItems - Danh sách lỗi.
 * @param {array} existingQuotationStatuses - Danh sách trạng thái báo giá hiện có.
 * @returns {JSX.Element} - Nội dung hiển thị trong ô.
 */
// ...renderMaTrangThaiBaoGia không cần kiểm tra trùng mã nữa, chỉ cần hiển thị mã tự sinh...
export const renderMaTrangThaiBaoGia = (text, record, errorItems) => {
  return renderWithErrorHighlight(text, record, errorItems, 'Mã trạng thái báo giá');
};

/**
 * Hàm render cột "Báo giá".
 * @param {string} text - Giá trị của ô.
 * @param {object} record - Dữ liệu của dòng hiện tại.
 * @param {array} errorItems - Danh sách lỗi.
 * @param {array} existingQuotationStatuses - Danh sách trạng thái báo giá hiện có.
 * @returns {JSX.Element} - Nội dung hiển thị trong ô.
 */
export const renderTrangThaiBaoGia = (text, record, errorItems, existingQuotationStatuses) => {
  const customError = isQuotationStatusExisting(text, existingQuotationStatuses) ? '(Đã tồn tại)' : null;
  return renderWithErrorHighlight(text, record, errorItems, 'Trạng thái báo giá', customError);
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