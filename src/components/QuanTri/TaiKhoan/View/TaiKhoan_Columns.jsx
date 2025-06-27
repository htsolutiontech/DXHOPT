import { Button, Space } from 'antd';
import { formatDate } from '../../../utils/format/formatDate';

export const getNguoiDungColumns = (handleEdit, handleRemove, canEdit) => [
    { title: 'STT', dataIndex: 'stt', key: 'stt', width: "3%" },
    { title: 'Mã người dùng', dataIndex: 'ma_nguoi_dung', key: 'ma_nguoi_dung', width: "10%", sorter: (a, b) => (a.ma_nguoi_dung || '').localeCompare(b.ma_nguoi_dung || '') },
    { title: 'Tên đăng nhập', dataIndex: 'ten_dang_nhap', key: 'ten_dang_nhap', width: "10%", sorter: (a, b) => (a.ten_dang_nhap || '').localeCompare(b.ten_dang_nhap || '') },
    // { title: 'Mật khẩu', dataIndex: 'mat_khau', key: 'mat_khau', width: "25%" },
    { title: 'Họ và tên', dataIndex: 'ho_va_ten', key: 'ho_va_ten', width: "15%", sorter: (a, b) => (a.ho_va_ten || '').localeCompare(b.ho_va_ten || '') },
    { 
        title: 'Vai trò', 
        dataIndex: ['role', 'vai_tro'], 
        key: 'vai_tro', 
        width: "10%", 
        sorter: (a, b) => {
            const aName = a.roles?.vai_tro || '';
            const bName = b.roles?.vai_tro || '';
            return aName.localeCompare(bName, 'vi');
        } 
    },
    { title: 'Email', dataIndex: 'email', key: 'email', width: "10%" },
    { title: 'Số điện thoại', dataIndex: 'so_dien_thoai', key: 'so_dien_thoai', width: "7%" },
    {
        title: 'Ngày tạo',
        dataIndex: 'ngay_tao',
        key: 'ngay_tao',
        render: (text) => formatDate(text),
        width: "7%",
        sorter: (a, b) => new Date(a.ngay_tao) - new Date(b.ngay_tao),
        defaultSortOrder: 'descend',
    },
    {
        title: 'Hành động',
        key: 'hanh_dong',
        render: (_, record) => (
            <Space>
                <Button type="primary" size="small" disabled={!canEdit} onClick={() => handleEdit(record)}>Sửa</Button>
                <Button type="primary" danger size="small" disabled={!canEdit} onClick={() => handleRemove(record)}>Xóa</Button>
            </Space>
        ),
        width: "6%",
    },
];
