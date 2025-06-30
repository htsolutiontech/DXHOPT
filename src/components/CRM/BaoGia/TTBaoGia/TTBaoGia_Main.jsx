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
import './TTBaoGia_Main.css';
import TTBaoGia_Import from './Function/TTBaoGia_Import';
import TTBaoGia_Export from './Function/TTBaoGia_Export';
import TTBaoGiaTableView from './View/TTBaoGia_TableView';
import EditQuotationStatus from './Function/TTBaoGia_Update';
import AddQuotationStatus from './Function/TTBaoGia_Add';
import RemoveQuotationStatus from './Function/TTBaoGia_Delete';

const BangTTBaoGia = () => {
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
    const [editingQuotationStatus, setEditingQuotationStatus] = useState(null);
    const [addQuotationStatus, setAddQuotationStatus] = useState(false);
    const [deletingQuotationStatus, setDeletingQuotationStatus] = useState(null);

    // Gọi API lấy danh sách khách hàng bằng hàm tái sử dụng
    const fetchQuotationStatuses = () => {
        fetchData({
            endpoint: '/quotation-statuses', // endpoint API
            setData,                // set state dữ liệu
            setLoading,             // set trạng thái loading
            apiType: 'crm'          // Chỉ định sử dụng API CRM
        });
    };

    // Tự động gọi API khi component mount
    useEffect(() => {
        fetchQuotationStatuses();
    }, []);

    const handleEdit = (record) => {
        setEditingQuotationStatus(record.ma_trang_thai_bao_gia);
    };

    const handleEditClose = () => {
        setEditingQuotationStatus(null);
        fetchQuotationStatuses();
    };

    const handleAddSuccess = () => {
        setAddQuotationStatus(false);
        fetchQuotationStatuses();
    };

    const handleRemove = (record) => {
        setDeletingQuotationStatus(record);
    };

    const sortedData = sortField
        ? sortTableData(data, sortField, sortOrder)
        : sortTableData(data, 'ngay_cap_nhat', 'descend');

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };

    return (
        <div className="bang-trang-thai-bao-gia-container">
            <AreaHeader
                title="Trạng thái báo giá"
                onImportClick={() => setShowImportModal(true)}
                onExportClick={() => setShowExportModal(true)}
                onAddClick={() => setAddQuotationStatus(true)}
                disableImport={!canEdit}
                disableAdd={!canEdit}
            />

            <TTBaoGia_Import
                open={showImportModal}
                onClose={() => setShowImportModal(false)}
                onSuccess={() => {
                    setShowImportModal(false);
                    fetchQuotationStatuses(); // Gọi lại API để cập nhật danh sách sau khi import
                }}
            />

            <TTBaoGia_Export
                data={data}
                filteredData={data}
                sortedData={sortedData}
                visible={showExportModal}
                onClose={() => setShowExportModal(false)}
            />

            <TTBaoGiaTableView
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
                open={!!editingQuotationStatus}
                onCancel={() => setEditingQuotationStatus(null)}
                footer={null}
                width={1000}
                destroyOnClose
            >
                <EditQuotationStatus
                    quotation_statusId={editingQuotationStatus}
                    onCancel={() => setEditingQuotationStatus(null)}
                    onSuccess={handleEditClose}
                />
            </Modal>

            <Modal
                className="add_update-modal"
                open={addQuotationStatus}
                onCancel={() => setAddQuotationStatus(false)}
                footer={null}
                width={1000}
                destroyOnClose
            >
                <AddQuotationStatus
                    visible={addQuotationStatus}
                    onCancel={() => setAddQuotationStatus(false)}
                    onSuccess={handleAddSuccess}
                />
            </Modal>

            {deletingQuotationStatus && (
                <RemoveQuotationStatus
                    quotation_statusId={deletingQuotationStatus.ma_trang_thai_bao_gia}
                    quotation_statusName={deletingQuotationStatus.trang_thai_bao_gia}
                    onSuccess={() => {
                        setDeletingQuotationStatus(null);
                        fetchQuotationStatuses();
                    }}
                    onCancel={() => setDeletingQuotationStatus(null)}
                />
            )}
        </div>
    );
};

export default BangTTBaoGia;