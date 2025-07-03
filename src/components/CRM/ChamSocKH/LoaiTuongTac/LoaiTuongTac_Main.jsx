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
import './LoaiTuongTac_Main.css';
import LoaiTuongTac_Import from './Function/LoaiTuongTac_Import';
import LoaiTuongTac_Export from './Function/LoaiTuongTac_Export';
import LoaiTuongTacTableView from './View/LoaiTuongTac_TableView';
import EditInteractionType from './Function/LoaiTuongTac_Update';
import AddInteractionType from './Function/LoaiTuongTac_Add';
import RemoveInteractionType from './Function/LoaiTuongTac_Delete';

const BangLoaiTuongTac = () => {
    // State lưu dữ liệu bảng và trạng thái chung
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const canEdit = hasFullPermission(undefined, {
        allowedUsernames: ['DTLphuong', 'PPcuong'] ,// Thêm user này có toàn quyền
        allowedRoles: ['VT01', 'VT02', 'VT04'], // Thêm role này có toàn quyền
    });

    // State phân trang
    const [showImportModal, setShowImportModal] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);
    const [pageSize, setPageSize] = useState(20);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState('ngay_cap_nhat');
    const [sortOrder, setSortOrder] = useState('descend');
    const [editingInteractionType, setEditingInteractionType] = useState(null);
    const [addInteractionType, setAddInteractionType] = useState(false);
    const [deletingInteractionType, setDeletingInteractionType] = useState(null);

    // Gọi API lấy danh sách khách hàng bằng hàm tái sử dụng
    const fetchInteractionTypes = () => {
        fetchData({
            endpoint: '/interaction-types', // endpoint API
            setData,                // set state dữ liệu
            setLoading,             // set trạng thái loading
            apiType: 'crm'          // Chỉ định sử dụng API CRM
        });
    };

    // Tự động gọi API khi component mount
    useEffect(() => {
        fetchInteractionTypes();
    }, []);

    const handleEdit = (record) => {
        setEditingInteractionType(record.ma_loai_tuong_tac);
    };

    const handleEditClose = () => {
        setEditingInteractionType(null);
        fetchInteractionTypes();
    };

    const handleAddSuccess = () => {
        setAddInteractionType(false);
        fetchInteractionTypes();
    };

    const handleRemove = (record) => {
        setDeletingInteractionType(record);
    };

    const sortedData = sortField
        ? sortTableData(data, sortField, sortOrder)
        : sortTableData(data, 'ngay_cap_nhat', 'descend');

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };

    return (
        <div className="bang-loai-tuong-tac-container">
            <AreaHeader
                title="Loại Tương Tác"
                onImportClick={() => setShowImportModal(true)}
                onExportClick={() => setShowExportModal(true)}
                onAddClick={() => setAddInteractionType(true)}
                disableImport={!canEdit}
                disableAdd={!canEdit}
            />

            <LoaiTuongTac_Import
                open={showImportModal}
                onClose={() => setShowImportModal(false)}
                onSuccess={() => {
                    setShowImportModal(false);
                    fetchInteractionTypes(); // Gọi lại API để cập nhật danh sách sau khi import
                }}
            />

            <LoaiTuongTac_Export
                data={data}
                filteredData={data}
                sortedData={sortedData}
                visible={showExportModal}
                onClose={() => setShowExportModal(false)}
            />

            <LoaiTuongTacTableView
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
                open={!!editingInteractionType}
                onCancel={() => setEditingInteractionType(null)}
                footer={null}
                width={1000}
                destroyOnClose
            >
                <EditInteractionType
                    interaction_typeId={editingInteractionType}
                    onCancel={() => setEditingInteractionType(null)}
                    onSuccess={handleEditClose}
                />
            </Modal>

            <Modal
                className="add_update-modal"
                open={addInteractionType}
                onCancel={() => setAddInteractionType(false)}
                footer={null}
                width={1000}
                destroyOnClose
            >
                <AddInteractionType
                    visible={addInteractionType}
                    onCancel={() => setAddInteractionType(false)}
                    onSuccess={handleAddSuccess}
                />
            </Modal>

            {deletingInteractionType && (
                <RemoveInteractionType
                    interaction_typeId={deletingInteractionType.ma_loai_tuong_tac}
                    interaction_typeName={deletingInteractionType.loai_tuong_tac}
                    onSuccess={() => {
                        setDeletingInteractionType(null);
                        fetchInteractionTypes();
                    }}
                    onCancel={() => setDeletingInteractionType(null)}
                />
            )}
        </div>
    );
};

export default BangLoaiTuongTac;