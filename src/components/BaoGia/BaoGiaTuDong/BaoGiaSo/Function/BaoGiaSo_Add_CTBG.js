import { message } from 'antd';
import { fetchDataList, createItem } from '../../../../utils/api/requestHelpers';

// Hàm lưu chi tiết báo giá vào Quotation_Details
export async function handleCreateQuotationDetails(so_bao_gia, hangHoa) {
  try {
    // 2. Tạo dữ liệu cho từng dòng hàng hóa với mã duy nhất
    const detailRows = hangHoa.map((row, idx) => {
      const stt = idx + 1;
      // Sinh mã duy nhất: CTBG_<so_bao_gia>_<stt>
      const ma_chi_tiet_bao_gia = `CTBG_${so_bao_gia}_${stt}`;
      return {
        ma_chi_tiet_bao_gia,
        stt,
        so_bao_gia,
        muc_phan: '', // Nếu có phân mục thì truyền, không thì để rỗng
        mo_ta: row.mo_ta,
        ma_hang: row.ma_hang,
        so_luong: row.so_luong,
        don_vi_tinh: row.don_vi_ban_hang,
        hang_chu_so_huu: row.hang_chu_so_huu,
        xuat_xu: row.nuoc_xuat_xu,
        don_gia: Math.round(row.don_gia),
        thanh_tien: Math.round(row.thanh_tien),
        thue_gtgt: Math.round(row.thue_gtgt),
        tong_cong: Math.round(row.tong_cong),
        hinh_anh: row.ma_hang ? `/image/HangHoa/${row.ma_hang}.jpg` : '',
        ghi_chu: row.ghi_chu || '',
        ty_le_thue_gtgt: row.ty_le_thue_gtgt,
        ty_le_thue_nhap_khau: row.ty_le_thue_nk,
        chiet_khau: row.chiet_khau,
      };
    });

    // 3. Gửi từng dòng lên API và log ra console
    for (const detail of detailRows) {
      console.log('Gửi chi tiết báo giá lên DB:', detail);
      await createItem('https://dx.hoangphucthanh.vn:3000/crm/quotation-details', detail);
    }

    message.success('Đã lưu chi tiết báo giá vào hệ thống!');
    return true;
  } catch (error) {
    message.error('Lỗi lưu chi tiết báo giá: ' + error.message);
    throw error;
  }
}