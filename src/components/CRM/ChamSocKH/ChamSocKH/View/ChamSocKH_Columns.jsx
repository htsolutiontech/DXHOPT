import { Button, Space, Tag } from 'antd';
import { formatDate } from '../../../../utils/format/formatDate';

export const getTuongTacKhachHangColumns = (handleEdit, handleRemove, canEdit) => [
    { title: 'STT', dataIndex: 'stt', key: 'stt', width: "3%" },
    { title: 'Tên khách hàng', dataIndex: 'ten_khach_hang', key: 'ten_khach_hang', width: "15%", sorter: (a, b) => (a.ten_khach_hang || '').localeCompare(b.ten_khach_hang || '') },
    { 
        title: 'Người phụ trách', 
        dataIndex: ['accounts', 'ho_va_ten'], 
        key: 'nguoi_phu_trach', 
        width: "10%", 
        sorter: (a, b) => {
            const aName = a.accounts?.ho_va_ten || '';
            const bName = b.accounts?.ho_va_ten || '';
            return aName.localeCompare(bName, 'vi');
        } 
    },
    { 
        title: 'Loại tương tác', 
        dataIndex: ['interaction_type', 'loai_tuong_tac'], 
        key: 'loai_tuong_tac', 
        width: "10%", 
        sorter: (a, b) => {
            const aName = a.interaction_type?.loai_tuong_tac || '';
            const bName = b.interaction_type?.loai_tuong_tac || '';
            return aName.localeCompare(bName, 'vi');
        } 
    },
    { title: 'Hình thức gọi', dataIndex: 'hinh_thuc_goi', key: 'hinh_thuc_goi', width: "10%" },
    {
        title: 'Thời gian',
        dataIndex: 'thoi_gian',
        key: 'thoi_gian',
        render: (text) => formatDate(text),
        width: "10%",
        sorter: (a, b) => new Date(a.thoi_gian) - new Date(b.thoi_gian),
        defaultSortOrder: 'descend',
    },
    { title: 'Nội dung tương tác', dataIndex: 'noi_dung_tuong_tac', key: 'noi_dung_tuong_tac', width: "20%" },
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
