import { Button, Space, Tag } from 'antd';
import { formatDate } from '../../../../utils/format/formatDate';

export const getTTBaoGiaColumns = (handleEdit, handleRemove, canEdit) => [
    { title: 'STT', dataIndex: 'stt', key: 'stt', width: "5%" },
    { title: 'Mã trạng thái báo giá', dataIndex: 'ma_trang_thai_bao_gia', key: 'ma_trang_thai_bao_gia', width: "10%", sorter: (a, b) => (a.ma_trang_thai_bao_gia || '').localeCompare(b.ma_trang_thai_bao_gia || '') },
    { title: 'Trạng thái báo giá', dataIndex: 'trang_thai_bao_gia', key: 'trang_thai_bao_gia', width: "20%", sorter: (a, b) => (a.trang_thai_bao_gia || '').localeCompare(b.trang_thai_bao_gia || '') },
    {
        title: 'Người cập nhật',
        dataIndex: ['accounts', 'ho_va_ten'],
        key: 'nguoi_cap_nhat',
        width: "8%",
        sorter: (a, b) => {
            const aName = a.accounts?.ho_va_ten || '';
            const bName = b.accounts?.ho_va_ten || '';
            return aName.localeCompare(bName, 'vi');
        }
    },
    {
        title: 'Ngày cập nhật',
        dataIndex: 'ngay_cap_nhat',
        key: 'ngay_cap_nhat',
        render: (text) => formatDate(text),
        width: "8%",
        sorter: (a, b) => new Date(a.ngay_cap_nhat) - new Date(b.ngay_cap_nhat),
        defaultSortOrder: 'descend',
    },
    { title: 'Mô tả', dataIndex: 'mo_ta', key: 'mo_ta', width: "35%" },
    {
        title: 'Hành động',
        key: 'hanh_dong',
        render: (_, record) => (
            <Space>
                <Button type="primary" size="small" disabled={!canEdit} onClick={() => handleEdit(record)}>Sửa</Button>
                <Button type="primary" danger size="small" disabled={!canEdit} onClick={() => handleRemove(record)}>Xóa</Button>
            </Space>
        ),
        width: "8%",
    },
];
