import { renderWithErrorHighlight } from '../../../../utils/import/renderHelpers';
import { fetchAndSetList } from '../../../../utils/api/fetchHelpers';

/**
 * Hàm tải danh sách từ API.
 * @param {function} setAccounts - Hàm set state cho danh sách tài khoản.
 * @param {function} setExistingSources - Hàm set state cho danh sách nguồn cơ hội.
 */
export const fetchPreviewData = (setAccounts, setExistingSources) => {
  fetchAndSetList(
    'https://dx.hoangphucthanh.vn:3000/warehouse/accounts',
    setAccounts,
    'Không thể tải danh sách người dùng'
  );
  fetchAndSetList(
    'https://dx.hoangphucthanh.vn:3000/crm/opportunity-sources',
    setExistingSources,
    'Không thể tải danh sách nguồn cơ hội'
  );
};

/**
 * Kiểm tra xem nguồn cơ hội có tồn tại không.
 * @param {string} value - Giá trị cần kiểm tra.
 * @param {array} existingSources - Danh sách nguồn cơ hội hiện có.
 * @returns {boolean} - Kết quả kiểm tra.
 */
export const isSourceExisting = (value, existingSources) => {
  return existingSources.some(
    (item) => item.nguon === value
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
 * Hàm render cột "Mã nguồn cơ hội".
 * @param {string} text - Giá trị của ô.
 * @param {object} record - Dữ liệu của dòng hiện tại.
 * @param {array} errorItems - Danh sách lỗi.
 * @param {array} existingSources - Danh sách nguồn cơ hội hiện có.
 * @returns {JSX.Element} - Nội dung hiển thị trong ô.
 */
// ...renderMaNguon không cần kiểm tra trùng mã nữa, chỉ cần hiển thị mã tự sinh...
export const renderMaNguon = (text, record, errorItems) => {
  return renderWithErrorHighlight(text, record, errorItems, 'Mã nguồn cơ hội');
};

/**
 * Hàm render cột "Nguồn".
 * @param {string} text - Giá trị của ô.
 * @param {object} record - Dữ liệu của dòng hiện tại.
 * @param {array} errorItems - Danh sách lỗi.
 * @param {array} existingSources - Danh sách nguồn cơ hội hiện có.
 * @returns {JSX.Element} - Nội dung hiển thị trong ô.
 */
export const renderNguon = (text, record, errorItems, existingSources) => {
  const customError = isSourceExisting(text, existingSources) ? '(Đã tồn tại)' : null;
  return renderWithErrorHighlight(text, record, errorItems, 'Nguồn', customError);
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