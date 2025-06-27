import { Button, Space, Tag } from 'antd';
import { formatDate } from '../../../utils/format/formatDate';

export const getBaoGiaColumns = (handleEdit, handleRemove, canEdit) => [
    { title: 'STT', dataIndex: 'stt', key: 'stt', width: "2%" },
    { title: 'Số báo giá', dataIndex: 'so_bao_gia', key: 'so_bao_gia', width: "5%", sorter: (a, b) => (a.so_bao_gia || '').localeCompare(b.so_bao_gia || '') },
    { title: 'Tiêu đề', dataIndex: 'tieu_de', key: 'tieu_de', width: "7%" },
    { 
        title: 'Loại báo giá', 
        dataIndex: ['quotation_type', 'loai_bao_gia'], 
        key: 'loai_bao_gia', 
        width: "5%", 
        sorter: (a, b) => {
            const aName = a.quotation_type?.loai_bao_gia || '';
            const bName = b.quotation_type?.loai_bao_gia || '';
            return aName.localeCompare(bName, 'vi');
        }
    },
    { title: 'Tình trạng', dataIndex: ['quotation_status', 'trang_thai_bao_gia'], key: 'tinh_trang', width: "5%", 
        render: (status) => {
            let color = '';
            switch (status) {
                case 'Đã tạo báo giá':
                    color = 'green';
                    break;
                case 'Đã xem báo giá':
                    color = 'orange';
                    break;
                case 'Thành công':
                    color = 'blue';
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
        sorter: (a, b) => {
            const aName = a.quotation_status?.trang_thai_bao_gia || '';
            const bName = b.quotation_status?.trang_thai_bao_gia || '';
            return aName.localeCompare(bName, 'vi');
        }
    },
    
    { title: 'Khách hàng', dataIndex: 'ten_khach_hang', key: 'ten_khach_hang', width: "12%" },
    {
        title: 'Ngày báo giá',
        dataIndex: 'ngay_bao_gia',
        key: 'ngay_bao_gia',
        render: (text) => formatDate(text),
        width: "5%",
        sorter: (a, b) => new Date(a.ngay_bao_gia) - new Date(b.ngay_bao_gia),
        defaultSortOrder: 'descend',
    },
    { title: 'Giá trị hợp đồng', dataIndex: 'tong_tri_gia', key: 'tong_tri_gia', render: (value) => value?.toLocaleString('vi-VN'), width: "6%", sorter: (a, b) => (Number(a.tong_tri_gia) || 0) - (Number(b.tong_tri_gia) || 0) },
    {
        title: 'Hành động',
        key: 'hanh_dong',
        render: (_, record) => (
            <Space>
                <Button type="primary" size="small" disabled={!canEdit} onClick={() => handleEdit(record)}>Sửa</Button>
                <Button type="primary" danger size="small" disabled={!canEdit} onClick={() => handleRemove(record)}>Xóa</Button>
            </Space>
        ),
        width: "5%",
    },
    { title: 'Đối tượng', dataIndex: 'doi_tuong', key: 'doi_tuong', width: "5%" },
    { title: 'Hệ số', dataIndex: 'he_so', key: 'he_so', width: "3%" },
    { title: 'Tên file báo giá', dataIndex: 'ten_file_bao_gia', key: 'ten_file_bao_gia', width: "5%" },
    { title: 'Hãng chủ sở hữu', dataIndex: 'hang_chu_so_huu', key: 'hang_chu_so_huu', width: "5%" },
    { title: 'Price List', dataIndex: 'price_list', key: 'price_list', width: "5%" },
    { title: 'Số điện thoại', dataIndex: 'so_dien_thoai', key: 'so_dien_thoai', width: "4%" },
    { title: 'Người liên hệ', dataIndex: 'nguoi_lien_he', key: 'nguoi_lien_he', width: "7%" }, 
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
    { title: 'Ghi chú', dataIndex: 'ghi_chu', key: 'ghi_chu', width: "10%" },
];
