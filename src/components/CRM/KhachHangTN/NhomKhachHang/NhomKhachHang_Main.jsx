// Thư viện React và Ant Design
import React, { useState, useEffect } from 'react';
import { Modal, message } from 'antd';

//Thao tác chung
// Các file CSS dùng chung để chuẩn hóa giao diện bảng, nút, filter
import '../../../utils/css/Custom-Table.css';
import '../../../utils/css/Custom-Button.css';
import '../../../utils/css/Custom-Filter.css';
// Hàm gọi API
import { fetchData } from '../../../utils/api/apiHandler';
// Component phân trang
import PaginationControl from '../../../utils/format/PaginationControl';
// Header của mỗi bảng dữ liệu
import AreaHeader from '../../../utils/jsx/AreaHeader';
import { sortTableData } from '../../../utils/data/sortTable';
import { hasFullPermission } from '../../../utils/auth/permissionUtils';

// Các tính năng
import './NhomKhachHang_Main.css';
import NhomKhachHang_Import from './Function/NhomKhachHang_Import';
import NhomKhachHang_Export from './Function/NhomKhachHang_Export';
import NhomKhachHangTableView from './View/NhomKhachHang_TableView';
import EditCustomerGroup from './Function/NhomKhachHang_Update';
import AddCustomerGroup from './Function/NhomKhachHang_Add';
import RemoveCustomerGroup from './Function/NhomKhachHang_Delete';

const BangNhomKhachHang = () => {
    // State lưu dữ liệu bảng và trạng thái chung
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const canEdit = hasFullPermission(undefined, {
        allowedUsernames: ['DTLphuong', 'PPcuong'] ,// Thêm user này có toàn quyền
        allowedRoles: ['VT01', 'VT02','VT04'], // Thêm role này có toàn quyền
    });

    // State phân trang
    const [showImportModal, setShowImportModal] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);
    const [pageSize, setPageSize] = useState(20);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState('ngay_cap_nhat');
    const [sortOrder, setSortOrder] = useState('descend');
    const [editingCustomerGroup, setEditingCustomerGroup] = useState(null);
    const [addCustomerGroup, setAddCustomerGroup] = useState(false);
    const [deletingCustomerGroup, setDeletingCustomerGroup] = useState(null);

    // Gọi API lấy danh sách khách hàng bằng hàm tái sử dụng
    const fetchCustomerGroups = () => {
        fetchData({
            endpoint: '/customer-groups', // endpoint API
            setData,                // set state dữ liệu
            setLoading,             // set trạng thái loading
            apiType: 'crm'          // Chỉ định sử dụng API CRM
        });
    };

    // Tự động gọi API khi component mount
    useEffect(() => {
        fetchCustomerGroups();
    }, []);

    const handleEdit = (record) => {
        setEditingCustomerGroup(record.ma_nhom_khach_hang);
    };

    const handleEditClose = () => {
        setEditingCustomerGroup(null);
        fetchCustomerGroups();
    };

    const handleAddSuccess = () => {
        setAddCustomerGroup(false);
        fetchCustomerGroups();
    };

    const handleRemove = (record) => {
        setDeletingCustomerGroup(record);
    };

    const sortedData = sortField
        ? sortTableData(data, sortField, sortOrder)
        : sortTableData(data, 'ngay_cap_nhat', 'descend');

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };

    return (
        <div className="bang-nhom-khach-hang-container">
            <AreaHeader
                title="Nhóm Khách Hàng"
                onImportClick={() => setShowImportModal(true)}
                onExportClick={() => setShowExportModal(true)}
                onAddClick={() => setAddCustomerGroup(true)}
                disableImport={!canEdit}
                disableAdd={!canEdit}
            />

            <NhomKhachHang_Import
                open={showImportModal}
                onClose={() => setShowImportModal(false)}
                onSuccess={() => {
                    setShowImportModal(false);
                    fetchCustomerGroups(); // Gọi lại API để cập nhật danh sách sau khi import
                }}
            />

            <NhomKhachHang_Export
                data={data}
                filteredData={data}
                sortedData={sortedData}
                visible={showExportModal}
                onClose={() => setShowExportModal(false)}
            />

            <NhomKhachHangTableView
                data={sortedData}
                currentPage={currentPage}
                pageSize={pageSize}
                loading={loading}
                handleEdit={handleEdit}
                handleRemove={handleRemove}
                canEdit={canEdit}
                onSortChange={(field, order) => {
                    setSortField(field || null);
                    setSortOrder(order || null);
                    setCurrentPage(1);
                }}
                sortField={sortField}
                sortOrder={sortOrder}
            />

            <PaginationControl
                total={data.length}
                pageSize={pageSize}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                onSizeChange={handlePageChange}
            />

            <Modal
                className="add_update-modal"
                open={!!editingCustomerGroup}
                onCancel={() => setEditingCustomerGroup(null)}
                footer={null}
                width={1000}
                destroyOnClose
            >
                <EditCustomerGroup
                    customer_groupId={editingCustomerGroup}
                    onCancel={() => setEditingCustomerGroup(null)}
                    onSuccess={handleEditClose}
                />
            </Modal>

            <Modal
                className="add_update-modal"
                open={addCustomerGroup}
                onCancel={() => setAddCustomerGroup(false)}
                footer={null}
                width={1000}
                destroyOnClose
            >
                <AddCustomerGroup
                    visible={addCustomerGroup}
                    onCancel={() => setAddCustomerGroup(false)}
                    onSuccess={handleAddSuccess}
                />
            </Modal>

            {deletingCustomerGroup && (
                <RemoveCustomerGroup
                    customer_groupId={deletingCustomerGroup.ma_nhom_khach_hang}
                    customer_groupName={deletingCustomerGroup.nhom_khach_hang}
                    onSuccess={() => {
                        setDeletingCustomerGroup(null);
                        fetchCustomerGroups();
                    }}
                    onCancel={() => setDeletingCustomerGroup(null)}
                />
            )}
        </div>
    );
};

export default BangNhomKhachHang;