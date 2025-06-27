// Thư viện React và Ant Design
import React, { useState, useEffect } from 'react';
import { Modal, message } from 'antd';

//Thao tác chung
// Các file CSS dùng chung để chuẩn hóa giao diện bảng, nút, filter
import '../../utils/css/Custom-Table.css';
import '../../utils/css/Custom-Button.css';
import '../../utils/css/Custom-Filter.css';
// Hàm gọi API
import { fetchData } from '../../utils/api/apiHandler';
// Component phân trang
import PaginationControl from '../../utils/format/PaginationControl';
// Header của mỗi bảng dữ liệu
import AreaHeader from '../../utils/jsx/AreaHeader';
import { sortTableData } from '../../utils/data/sortTable';
import { hasFullPermission } from '../../utils/auth/permissionUtils';

// Các tính năng
import './VaiTro_Main.css';
import VaiTro_Export from './Function/VaiTro_Export';
import VaiTroTableView from './View/VaiTro_TableView';
import EditRole from './Function/VaiTro_Update';
import AddRole from './Function/VaiTro_Add';
import RemoveRole from './Function/VaiTro_Delete';

const BangVaiTro = () => {
    // State lưu dữ liệu bảng và trạng thái chung
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const canEdit = hasFullPermission(undefined, {
        allowedUsernames: [] ,// Thêm user này có toàn quyền
        allowedRoles: ['VT01'], // Thêm role này có toàn quyền
    });

    // State phân trang
    const [showExportModal, setShowExportModal] = useState(false);
    const [pageSize, setPageSize] = useState(20);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState('ngay_cap_nhat');
    const [sortOrder, setSortOrder] = useState('descend');
    const [editingRole, setEditingRole] = useState(null);
    const [addRole, setAddRole] = useState(false);
    const [deletingRole, setDeletingRole] = useState(null);

    // Gọi API lấy danh sách khách hàng bằng hàm tái sử dụng
    const fetchRoles = () => {
        fetchData({
            endpoint: '/roles', // endpoint API
            setData,                // set state dữ liệu
            setLoading,             // set trạng thái loading
        });
    };

    // Tự động gọi API khi component mount
    useEffect(() => {
        fetchRoles();
    }, []);

    const handleEdit = (record) => {
        setEditingRole(record.ma_vai_tro);
    };

    const handleEditClose = () => {
        setEditingRole(null);
        fetchRoles();
    };

    const handleAddSuccess = () => {
        setAddRole(false);
        fetchRoles();
    };

    const handleRemove = (record) => {
        setDeletingRole(record);
    };

    const sortedData = sortField
        ? sortTableData(data, sortField, sortOrder)
        : sortTableData(data, 'ngay_cap_nhat', 'descend');

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };

    return (
        <div className="bang-vai-tro-container">
            <AreaHeader
                title="Vai Trò"
                onExportClick={() => setShowExportModal(true)}
                onAddClick={() => setAddRole(true)}
                disableAdd={!canEdit}
            />

            <VaiTro_Export
                data={data}
                filteredData={data}
                sortedData={sortedData}
                visible={showExportModal}
                onClose={() => setShowExportModal(false)}
            />

            <VaiTroTableView
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
                open={!!editingRole}
                onCancel={() => setEditingRole(null)}
                footer={null}
                width={1000}
                destroyOnClose
            >
                <EditRole
                    roleId={editingRole}
                    onCancel={() => setEditingRole(null)}
                    onSuccess={handleEditClose}
                />
            </Modal>

            <Modal
                className="add_update-modal"
                open={addRole}
                onCancel={() => setAddRole(false)}
                footer={null}
                width={1000}
                destroyOnClose
            >
                <AddRole
                    visible={addRole}
                    onCancel={() => setAddRole(false)}
                    onSuccess={handleAddSuccess}
                />
            </Modal>

            {deletingRole && (
                <RemoveRole
                    roleId={deletingRole.ma_vai_tro}
                    roleName={deletingRole.vai_tro}
                    onSuccess={() => {
                        setDeletingRole(null);
                        fetchRoles();
                    }}
                    onCancel={() => setDeletingRole(null)}
                />
            )}
        </div>
    );
};

export default BangVaiTro;