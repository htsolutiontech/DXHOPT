import { message } from 'antd';
import { fetchDataList, createItem } from '../../../../utils/api/requestHelpers';

// Hàm tổng hợp và gửi dữ liệu lên bảng Quotations
export async function handleCreateQuotation(thongTin, hangHoa, currentUser) {
  try {
    // 1. Lấy danh sách báo giá để tính stt mới
    const quotations = await fetchDataList('https://dx.hoangphucthanh.vn:3000/crm/quotations');
    const maxStt = quotations.length ? Math.max(...quotations.map(q => Number(q.stt) || 0)) : 0;
    const stt = maxStt + 1;

    // 2. Lấy mã trạng thái báo giá
    const statusList = await fetchDataList('https://dx.hoangphucthanh.vn:3000/crm/quotation-statuses');
    const status = statusList.find(s => s.trang_thai_bao_gia === thongTin.tinh_trang);
    if (!status) throw new Error(`Không tìm thấy trạng thái báo giá "${thongTin.tinh_trang}"`);
    const ma_trang_thai_bao_gia = status.ma_trang_thai_bao_gia;

    // 3. Lấy mã loại báo giá dựa trên input người dùng
    const typeList = await fetchDataList('https://dx.hoangphucthanh.vn:3000/crm/quotation-types');
    const type = typeList.find(t => t.loai_bao_gia === thongTin.loai_bao_gia);
    if (!type) throw new Error(`Không tìm thấy loại báo giá "${thongTin.loai_bao_gia}"`);
    const ma_loai_bao_gia = type.ma_loai_bao_gia;

    // 4. Tính tổng trị giá
    const tong_tri_gia = hangHoa.reduce((sum, h) => sum + (h.tong_cong || 0), 0);

    // 5. Chuẩn bị dữ liệu gửi lên
    const quotationData = {
      stt,
      so_bao_gia: thongTin.so_bao_gia,
      tinh_trang: ma_trang_thai_bao_gia, // phải là mã
      tieu_de: thongTin.tieu_de,
      ten_khach_hang: thongTin.kinh_gui,
      doi_tuong: thongTin.doi_tuong_bao_gia,
      he_so: thongTin.he_so,
      hang_chu_so_huu: thongTin.hang_chu_so_huu,
      ten_file_bao_gia: thongTin.ten_file_bao_gia,
      noi_dung: thongTin.noi_dung_bao_gia,
      dieu_kien_thuong_mai: thongTin.dieu_kien_thuong_mai,
      loai_bao_gia: ma_loai_bao_gia, // phải là mã
      ngay_bao_gia: thongTin.ngay_bao_gia?.format
        ? thongTin.ngay_bao_gia.format('YYYY-MM-DD')
        : thongTin.ngay_bao_gia,
      price_list: thongTin.price_list,
      so_dien_thoai: thongTin.sdt,
      nguoi_lien_he: thongTin.nguoi_lien_he,
      nguoi_phu_trach: currentUser?.ma_nguoi_dung || '',
      tong_tri_gia,
      ghi_chu: thongTin.ghi_chu || thongTin.nguoi_lien_he || '',
    };

    const response = await createItem('https://dx.hoangphucthanh.vn:3000/crm/quotations', quotationData);

    if (response && response.status && response.status >= 400) {
      throw new Error('Thêm mới thất bại từ server');
    }

    message.success('Đã lưu báo giá vào hệ thống!');
    return response;
  } catch (error) {
    message.error('Lỗi lưu báo giá: ' + error.message);
    throw error;
  }
}