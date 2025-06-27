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
import './LoaiBaoGia_Main.css';
import LoaiBaoGia_Import from './Function/LoaiBaoGia_Import';
import LoaiBaoGia_Export from './Function/LoaiBaoGia_Export';
import LoaiBaoGiaTableView from './View/LoaiBaoGia_TableView';
import EditQuotationType from './Function/LoaiBaoGia_Update';
import AddQuotationType from './Function/LoaiBaoGia_Add';
import RemoveQuotationType from './Function/LoaiBaoGia_Delete';

const BangLoaiBaoGia = () => {
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
    const [editingQuotationType, setEditingQuotationType] = useState(null);
    const [addQuotationType, setAddQuotationType] = useState(false);
    const [deletingQuotationType, setDeletingQuotationType] = useState(null);

    // Gọi API lấy danh sách khách hàng bằng hàm tái sử dụng
    const fetchQuotationTypes = () => {
        fetchData({
            endpoint: '/quotation-types', // endpoint API
            setData,                // set state dữ liệu
            setLoading,             // set trạng thái loading
            apiType: 'crm'          // Chỉ định sử dụng API CRM
        });
    };

    // Tự động gọi API khi component mount
    useEffect(() => {
        fetchQuotationTypes();
    }, []);

    const handleEdit = (record) => {
        setEditingQuotationType(record.ma_loai_bao_gia);
    };

    const handleEditClose = () => {
        setEditingQuotationType(null);
        fetchQuotationTypes();
    };

    const handleAddSuccess = () => {
        setAddQuotationType(false);
        fetchQuotationTypes();
    };

    const handleRemove = (record) => {
        setDeletingQuotationType(record);
    };

    const sortedData = sortField
        ? sortTableData(data, sortField, sortOrder)
        : sortTableData(data, 'ngay_cap_nhat', 'descend');

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };

    return (
        <div className="bang-loai-bao-gia-container">
            <AreaHeader
                title="Loại Báo Giá"
                onImportClick={() => setShowImportModal(true)}
                onExportClick={() => setShowExportModal(true)}
                onAddClick={() => setAddQuotationType(true)}
                disableImport={!canEdit}
                disableAdd={!canEdit}
            />

            <LoaiBaoGia_Import
                open={showImportModal}
                onClose={() => setShowImportModal(false)}
                onSuccess={() => {
                    setShowImportModal(false);
                    fetchQuotationTypes(); // Gọi lại API để cập nhật danh sách sau khi import
                }}
            />

            <LoaiBaoGia_Export
                data={data}
                filteredData={data}
                sortedData={sortedData}
                visible={showExportModal}
                onClose={() => setShowExportModal(false)}
            />

            <LoaiBaoGiaTableView
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
                open={!!editingQuotationType}
                onCancel={() => setEditingQuotationType(null)}
                footer={null}
                width={1000}
                destroyOnClose
            >
                <EditQuotationType
                    quotation_typeId={editingQuotationType}
                    onCancel={() => setEditingQuotationType(null)}
                    onSuccess={handleEditClose}
                />
            </Modal>

            <Modal
                className="add_update-modal"
                open={addQuotationType}
                onCancel={() => setAddQuotationType(false)}
                footer={null}
                width={1000}
                destroyOnClose
            >
                <AddQuotationType
                    visible={addQuotationType}
                    onCancel={() => setAddQuotationType(false)}
                    onSuccess={handleAddSuccess}
                />
            </Modal>

            {deletingQuotationType && (
                <RemoveQuotationType
                    quotation_typeId={deletingQuotationType.ma_loai_bao_gia}
                    quotation_typeName={deletingQuotationType.loai_bao_gia}
                    onSuccess={() => {
                        setDeletingQuotationType(null);
                        fetchQuotationTypes();
                    }}
                    onCancel={() => setDeletingQuotationType(null)}
                />
            )}
        </div>
    );
};

export default BangLoaiBaoGia;