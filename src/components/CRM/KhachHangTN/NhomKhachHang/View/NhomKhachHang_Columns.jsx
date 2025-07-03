import { Button, Space, Tag } from 'antd';
import { formatDate } from '../../../../utils/format/formatDate';

export const getNhomKhachHangColumns = (handleEdit, handleRemove, canEdit) => [
    { title: 'STT', dataIndex: 'stt', key: 'stt', width: "5%" },
    { title: 'Mã nhóm khách hàng', dataIndex: 'ma_nhom_khach_hang', key: 'ma_nhom_khach_hang', width: "10%", sorter: (a, b) => (a.ma_nhom_khach_hang || '').localeCompare(b.ma_nhom_khach_hang || '') },
    { title: 'Nhóm khách hàng', dataIndex: 'nhom_khach_hang', key: 'nhom_khach_hang', width: "20%", sorter: (a, b) => (a.nhom_khach_hang || '').localeCompare(b.nhom_khach_hang || '') },
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
    { title: 'Mô tả', dataIndex: 'mo_ta', key: 'mo_ta', width: "33%" },
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
