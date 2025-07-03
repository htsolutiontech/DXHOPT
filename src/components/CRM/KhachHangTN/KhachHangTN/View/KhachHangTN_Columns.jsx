import { Button, Space, Tag } from 'antd';
import { formatDate } from '../../../../utils/format/formatDate';

export const getKhachHangTiemNangColumns = (handleEdit, handleRemove, canEdit) => [
    { title: 'STT', dataIndex: 'stt', key: 'stt', width: "2%" },
    { title: 'Tên khách hàng', dataIndex: 'ten_khach_hang', key: 'ten_khach_hang', width: "10%", sorter: (a, b) => (a.ten_khach_hang || '').localeCompare(b.ten_khach_hang || '') },
    { 
        title: 'Người phụ trách', 
        dataIndex: ['accounts', 'ho_va_ten'], 
        key: 'nguoi_phu_trach', 
        width: "5%", 
        sorter: (a, b) => {
            const aName = a.accounts?.ho_va_ten || '';
            const bName = b.accounts?.ho_va_ten || '';
            return aName.localeCompare(bName, 'vi');
        } 
    },
    { title: 'Hành động tiếp theo', dataIndex: 'hanh_dong_tiep_theo', key: 'hanh_dong_tiep_theo', width: "7%", sorter: (a, b) => (a.hanh_dong_tiep_theo || '').localeCompare(b.hanh_dong_tiep_theo || '') },
    {
        title: 'Ngày liên lạc tiếp theo',
        dataIndex: 'ngay_lien_lac_tiep_theo',
        key: 'ngay_lien_lac_tiep_theo',
        render: (text) => formatDate(text),
        width: "3%",
        sorter: (a, b) => new Date(a.ngay_lien_lac_tiep_theo) - new Date(b.ngay_lien_lac_tiep_theo),
        defaultSortOrder: 'descend',
    },
    { title: 'Số lần đã liên lạc', dataIndex: 'so_lan_da_lien_lac', key: 'so_lan_da_lien_lac', width: "3%", sorter: (a, b) => (Number(a.so_lan_da_lien_lac) || 0) - (Number(b.so_lan_da_lien_lac) || 0) },
    { title: 'Mục đích', dataIndex: 'muc_dich', key: 'muc_dich', width: "7%", sorter: (a, b) => (a.muc_dich || '').localeCompare(b.muc_dich || '') },
        {
        title: 'Hành động',
        key: 'hanh_dong',
        render: (_, record) => (
            <Space>
                <Button type="primary" size="small" disabled={!canEdit} onClick={() => handleEdit(record)}>Sửa</Button>
                <Button type="primary" danger size="small" disabled={!canEdit} onClick={() => handleRemove(record)}>Xóa</Button>
                <Button type="primary" size="small" disabled={!canEdit}>Chuyển đổi</Button>
            </Space>
        ),
        width: "6%",
    },
    { 
        title: 'Nhóm khách hàng', 
        dataIndex: ['customer_group', 'nhom_khach_hang'], 
        key: 'nhom_khach_hang', 
        width: "4%", 
        sorter: (a, b) => {
            const aName = a.customer_group?.nhom_khach_hang || '';
            const bName = b.customer_group?.nhom_khach_hang || '';
            return aName.localeCompare(bName, 'vi');
        } 
    },
    { 
        title: 'Nguồn tiếp cận', 
        dataIndex: ['opportunity_source', 'nguon'], 
        key: 'nguoi_phu_trach', 
        width: "4%", 
        sorter: (a, b) => {
            const aName = a.opportunity_source?.nguon || '';
            const bName = b.opportunity_source?.nguon || '';
            return aName.localeCompare(bName, 'vi');
        } 
    },
    { title: 'Tình trạng', dataIndex: 'tinh_trang', key: 'tinh_trang', width: "4%",
        render: (status) => {
            let color = '';
            switch (status) {
                case 'Tích cực':
                    color = 'green';
                    break;
                case 'Bình thường':
                    color = 'orange';
                    break;
                case 'Khó chịu':
                    color = 'red';
                    break;
                default:
                    color = 'gray';
            }
            return (
                <Tag 
                    color={color} 
                    style={{ 
                        fontSize: '10px',
                        borderRadius: '6px', 
                        padding: '2px 4px', 
                        fontWeight: 'bold', 
                        display: 'inline-block', 
                        textAlign: 'center', // Căn giữa chữ trong Tag
                        width: '100%' // Đảm bảo Tag chiếm toàn bộ chiều rộng của ô
                    }}
                >
                    {status || 'N/A'}
                </Tag>
            );
        },
        sorter: (a, b) => (a.tinh_trang || '').localeCompare(b.tinh_trang || '')
    },
    {
        title: 'Ngày thêm vào',
        dataIndex: 'ngay_them_vao',
        key: 'ngay_them_vao',
        render: (text) => formatDate(text),
        width: "3%",
        sorter: (a, b) => new Date(a.ngay_them_vao) - new Date(b.ngay_them_vao),
        defaultSortOrder: 'descend',
    },
    { title: 'Số điện thoại', dataIndex: 'so_dien_thoai', key: 'so_dien_thoai', width: "4%" },
    { title: 'Email', dataIndex: 'email', key: 'email', width: "7%" },
    { title: 'Website', dataIndex: 'website', key: 'website', width: "7%" },
    { title: 'Địa chỉ cụ thể', dataIndex: 'dia_chi_cu_the', key: 'dia_chi_cu_the', width: "10%" },
    { title: 'Tỉnh thành', dataIndex: 'tinh_thanh', key: 'tinh_thanh', width: "4%", sorter: (a, b) => (a.tinh_thanh || '').localeCompare(b.tinh_thanh || '') },
    { title: 'Ghi chú', dataIndex: 'ghi_chu', key: 'ghi_chu', width: "10%" },
];
