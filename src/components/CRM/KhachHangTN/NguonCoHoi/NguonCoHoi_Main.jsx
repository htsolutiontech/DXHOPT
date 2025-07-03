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
import './NguonCoHoi_Main.css';
import NguonCoHoi_Import from './Function/NguonCoHoi_Import';
import NguonCoHoi_Export from './Function/NguonCoHoi_Export';
import NguonCoHoiTableView from './View/NguonCoHoi_TableView';
import EditSource from './Function/NguonCoHoi_Update';
import AddSource from './Function/NguonCoHoi_Add';
import RemoveSource from './Function/NguonCoHoi_Delete';

const BangNguonCoHoi = () => {
    // State lưu dữ liệu bảng và trạng thái chung
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const canEdit = hasFullPermission(undefined, {
        allowedUsernames: ['VTTphuong', 'PPcuong'] ,// Thêm user này có toàn quyền
        allowedRoles: ['VT01', 'VT02'], // Thêm role này có toàn quyền
    });

    // State phân trang
    const [showImportModal, setShowImportModal] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);
    const [pageSize, setPageSize] = useState(20);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState('ngay_cap_nhat');
    const [sortOrder, setSortOrder] = useState('descend');
    const [editingSource, setEditingSource] = useState(null);
    const [addSource, setAddSource] = useState(false);
    const [deletingSource, setDeletingSource] = useState(null);

    // Gọi API lấy danh sách khách hàng bằng hàm tái sử dụng
    const fetchSources = () => {
        fetchData({
            endpoint: '/opportunity-sources', // endpoint API
            setData,                // set state dữ liệu
            setLoading,             // set trạng thái loading
            apiType: 'crm'          // Chỉ định sử dụng API CRM
        });
    };

    // Tự động gọi API khi component mount
    useEffect(() => {
        fetchSources();
    }, []);

    const handleEdit = (record) => {
        setEditingSource(record.ma_nguon);
    };

    const handleEditClose = () => {
        setEditingSource(null);
        fetchSources();
    };

    const handleAddSuccess = () => {
        setAddSource(false);
        fetchSources();
    };

    const handleRemove = (record) => {
        setDeletingSource(record);
    };

    const sortedData = sortField
        ? sortTableData(data, sortField, sortOrder)
        : sortTableData(data, 'ngay_cap_nhat', 'descend');

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };

    return (
        <div className="bang-nguon-co-hoi-container">
            <AreaHeader
                title="Nguồn Cơ Hội"
                onImportClick={() => setShowImportModal(true)}
                onExportClick={() => setShowExportModal(true)}
                onAddClick={() => setAddSource(true)}
                disableImport={!canEdit}
                disableAdd={!canEdit}
            />

            <NguonCoHoi_Import
                open={showImportModal}
                onClose={() => setShowImportModal(false)}
                onSuccess={() => {
                    setShowImportModal(false);
                    fetchSources(); // Gọi lại API để cập nhật danh sách sau khi import
                }}
            />

            <NguonCoHoi_Export
                data={data}
                filteredData={data}
                sortedData={sortedData}
                visible={showExportModal}
                onClose={() => setShowExportModal(false)}
            />

            <NguonCoHoiTableView
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
                open={!!editingSource}
                onCancel={() => setEditingSource(null)}
                footer={null}
                width={1000}
                destroyOnClose
            >
                <EditSource
                    sourceId={editingSource}
                    onCancel={() => setEditingSource(null)}
                    onSuccess={handleEditClose}
                />
            </Modal>

            <Modal
                className="add_update-modal"
                open={addSource}
                onCancel={() => setAddSource(false)}
                footer={null}
                width={1000}
                destroyOnClose
            >
                <AddSource
                    visible={addSource}
                    onCancel={() => setAddSource(false)}
                    onSuccess={handleAddSuccess}
                />
            </Modal>

            {deletingSource && (
                <RemoveSource
                    sourceId={deletingSource.ma_nguon}
                    sourceName={deletingSource.nguon}
                    onSuccess={() => {
                        setDeletingSource(null);
                        fetchSources();
                    }}
                    onCancel={() => setDeletingSource(null)}
                />
            )}
        </div>
    );
};

export default BangNguonCoHoi;