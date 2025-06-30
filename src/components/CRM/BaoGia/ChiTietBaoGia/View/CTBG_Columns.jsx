import { getCountryName } from '../../../../utils/convert/countryCodes';
import { getUnitName } from '../../../../utils/convert/unitCodes';

export const getChiTietBaoGiaColumns = () => [
    // { title: 'Mã CTBG', dataIndex: 'ma_chi_tiet_bao_gia', key: 'ma_chi_tiet_bao_gia', width: "3%", defaultSortOrder: 'descend' }, // Ẩn cột này bằng cách comment hoặc xóa dòng này
    { title: 'STT', dataIndex: 'stt', key: 'stt', width: "3%", sorter: (a, b) => (Number(a.stt) || 0) - (Number(b.stt) || 0) },
    { title: 'Số báo giá', dataIndex: 'so_bao_gia', key: 'so_bao_gia', width: "7%", sorter: (a, b) => (a.so_bao_gia || '').localeCompare(b.so_bao_gia || '') },
    { title: 'Mục phần', dataIndex: 'muc_phan', key: 'muc_phan', width: "10%" },
    { title: 'Mô tả', dataIndex: 'mo_ta', key: 'mo_ta', width: "11%" },
    { title: 'Mã hàng', dataIndex: 'ma_hang', key: 'ma_hang', width: "5%" },
    { title: 'Số lượng', dataIndex: 'so_luong', key: 'so_luong', width: "5%", sorter: (a, b) => (Number(a.so_luong) || 0) - (Number(b.so_luong) || 0) },
    { title: 'Đơn vị tính', dataIndex: 'don_vi_tinh', key: 'don_vi_tinh', render: (value) => getUnitName(value), width: "5%" },
    { title: 'Hãng chủ sở hữu', dataIndex: 'hang_chu_so_huu', key: 'hang_chu_so_huu', width: "6%" },
    { title: 'Xuất xứ', dataIndex: 'xuat_xu', key: 'xuat_xu', render: (code) => getCountryName(code), width: "6%" },
    { title: 'Đơn giá', dataIndex: 'don_gia', key: 'don_gia', render: (value) => value?.toLocaleString('vi-VN'), width: "7%", sorter: (a, b) => (Number(a.don_gia) || 0) - (Number(b.don_gia) || 0) },
    { title: 'Thành tiền', dataIndex: 'thanh_tien', key: 'thanh_tien', render: (value) => value?.toLocaleString('vi-VN'), width: "7%", sorter: (a, b) => (Number(a.thanh_tien) || 0) - (Number(b.thanh_tien) || 0) },
    { title: 'Thuế GTGT', dataIndex: 'thue_gtgt', key: 'thue_gtgt', width: "5%", sorter: (a, b) => (Number(a.ty_le_thue_gtgt) || 0) - (Number(b.ty_le_thue_gtgt) || 0), render: (value) => value?.toLocaleString('vi-VN') },
    { title: 'Tổng cộng', dataIndex: 'tong_cong', key: 'tong_cong', render: (value) => value?.toLocaleString('vi-VN'), width: "7%", sorter: (a, b) => (Number(a.tong_cong) || 0) - (Number(b.tong_cong) || 0) },
    { title: 'Tỷ lệ thuế GTGT', dataIndex: 'ty_le_thue_gtgt', key: 'ty_le_thue_gtgt', width: "5%", render: value => value ? `${(Number(value) * 100).toFixed(2).replace(/\.00$/, '')}%` : '0%' },
    { title: 'Tỷ lệ thuế NK', dataIndex: 'ty_le_thue_nhap_khau', key: 'ty_le_thue_nhap_khau', width: "5%", render: value => value ? `${(Number(value) * 100).toFixed(2).replace(/\.00$/, '')}%` : '0%' },
    { title: 'Chiết khấu', dataIndex: 'chiet_khau', key: 'chiet_khau', width: "5%", render: value => value ? `${(Number(value) * 100).toFixed(2).replace(/\.00$/, '')}%` : '0%' },
];
