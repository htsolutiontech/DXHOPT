import { Button, Space, Tag } from 'antd';
import { formatDate } from '../../../utils/format/formatDate';

export const getVaiTroColumns = (handleEdit, handleRemove, canEdit) => [
    { title: 'STT', dataIndex: 'stt', key: 'stt', width: "5%" },
    { title: 'Mã vai trò', dataIndex: 'ma_vai_tro', key: 'ma_vai_tro', width: "10%", sorter: (a, b) => (a.ma_vai_tro || '').localeCompare(b.ma_vai_tro || '') },
    { title: 'Vai trò', dataIndex: 'vai_tro', key: 'vai_tro', width: "15%", sorter: (a, b) => (a.vai_tro || '').localeCompare(b.vai_tro || '') },
    { title: 'Người cập nhật', dataIndex: 'nguoi_cap_nhat', key: 'nguoi_cap_nhat', width: "20%", sorter: (a, b) => (a.nguoi_cap_nhat || '').localeCompare(b.nguoi_cap_nhat || '') },
    {
        title: 'Ngày cập nhật',
        dataIndex: 'ngay_cap_nhat',
        key: 'ngay_cap_nhat',
        render: (text) => formatDate(text),
        width: "10%",
        sorter: (a, b) => new Date(a.ngay_cap_nhat) - new Date(b.ngay_cap_nhat),
        defaultSortOrder: 'descend',
    },
    { title: 'Ghi chú', dataIndex: 'ghi_chu', key: 'ghi_chu', width: "30%" },
    {
        title: 'Hành động',
        key: 'hanh_dong',
        render: (_, record) => (
            <Space>
                <Button type="primary" size="small" disabled={!canEdit} onClick={() => handleEdit(record)}>Sửa</Button>
                <Button type="primary" danger size="small" disabled={!canEdit} onClick={() => handleRemove(record)}>Xóa</Button>
            </Space>
        ),
        width: "10%",
    },
];
