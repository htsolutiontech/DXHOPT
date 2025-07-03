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
// Hàm reset các bộ lọc
import { resetFilters } from '../../../utils/data/resetFilter';
// Header của mỗi bảng dữ liệu
import AreaHeader from '../../../utils/jsx/AreaHeader';
import { sortTableData } from '../../../utils/data/sortTable';
import { hasFullPermission } from '../../../utils/auth/permissionUtils';

// Các tính năng
import './ChamSocKH_Main.css';
import TuongTacKhachHang_Import from './Function/ChamSocKH_Import';
import TuongTacKhachHang_Export from './Function/ChamSocKH_Export';
import TuongTacKhachHangFilter from './Function/ChamSocKH_Filter';
import { filterTuongTacKhachHang } from "./Function/ChamSocKH_FilterLogic";
import TuongTacKhachHangTableView from './View/ChamSocKH_TableView';
import EditCustomerInteraction from './Function/ChamSocKH_Update';
import AddCustomerInteraction from './Function/ChamSocKH_Add';
import RemoveCustomerInteraction from './Function/ChamSocKH_Delete';

const BangTuongTacKhachHang = () => {
    // State lưu dữ liệu bảng và trạng thái chung
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const canEdit = hasFullPermission(undefined, {
        allowedUsernames: ['DTLphuong', 'PPcuong'] ,// Thêm user này có toàn quyền
        allowedRoles: ['VT01', 'VT02', 'VT04'], // Thêm role này có toàn quyền
    });

    // State các bộ lọc và phân trang
    const [showImportModal, setShowImportModal] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [yearFilter, setYearFilter] = useState('all');
    const [accountFilter, setAccountFilter] = useState('all');
    const [interaction_typeFilter, setInteraction_TypeFilter] = useState('all');
    const [callFilter, setCallFilter] = useState('all');
    const [pageSize, setPageSize] = useState(20);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState('thoi_gian');
    const [sortOrder, setSortOrder] = useState('descend');
    const [editingCustomerInteraction, setEditingCustomerInteraction] = useState(null);
    const [addCustomerInteraction, setAddCustomerInteraction] = useState(false);
    const [deletingCustomerInteraction, setDeletingCustomerInteraction] = useState(null);

    // Gọi API lấy danh sách khách hàng bằng hàm tái sử dụng
    const fetchCustomerInteractions = () => {
        fetchData({
            endpoint: '/customer-interactions', // endpoint API
            setData,                // set state dữ liệu
            setLoading,             // set trạng thái loading
            apiType: 'crm'          // Chỉ định sử dụng API CRM
        });
    };

    // Tự động gọi API khi component mount
    useEffect(() => {
        fetchCustomerInteractions();
    }, []);

    const handleEdit = (record) => {
        setEditingCustomerInteraction(record.ma_tuong_tac_khach_hangg);
    };

    const handleEditClose = () => {
        setEditingCustomerInteraction(null);
        fetchCustomerInteractions();
    };

    const handleAddSuccess = () => {
        setAddCustomerInteraction(false);
        fetchCustomerInteractions();
    };

    const handleRemove = (record) => {
        setDeletingCustomerInteraction(record);
    };   

    const handleRefresh = () => {
        setSearchTerm('');
        resetFilters([setYearFilter, setAccountFilter, setInteraction_TypeFilter, setCallFilter]);
        setCurrentPage(1);
        fetchCustomerInteractions();
        setSortField('thoi_gian');
        setSortOrder('descend');
    };

    const filteredData = filterTuongTacKhachHang(data, {
        searchTerm,
        yearFilter,
        accountFilter,
        interaction_typeFilter,
        callFilter,
    });
    const sortedData = sortField
        ? sortTableData(filteredData, sortField, sortOrder)
        : sortTableData(filteredData, 'thoi_gian', 'descend');

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };

    return (
        <div className="bang-tuong-tac-khach-hang-container">
            <AreaHeader
                title="Chăm Sóc Khách Hàng"
                onImportClick={() => setShowImportModal(true)}
                onExportClick={() => setShowExportModal(true)}
                onAddClick={() => setAddCustomerInteraction(true)}
                disableImport={!canEdit}
                disableAdd={!canEdit}
            />

            <TuongTacKhachHang_Import
                open={showImportModal}
                onClose={() => setShowImportModal(false)}
                onSuccess={() => {
                    setShowImportModal(false);
                    fetchCustomerInteractions(); // Gọi lại API để cập nhật danh sách sau khi import
                }}
            />

            <TuongTacKhachHang_Export
                data={data}
                filteredData={filteredData}
                sortedData={sortedData}
                visible={showExportModal}
                onClose={() => setShowExportModal(false)}
            />

            <TuongTacKhachHangFilter
                data={data}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                yearFilter={yearFilter}
                setYearFilter={setYearFilter}
                accountFilter={accountFilter}
                setAccountFilter={setAccountFilter}
                interaction_typeFilter={interaction_typeFilter}
                setInteraction_TypeFilter={setInteraction_TypeFilter}
                callFilter={callFilter}
                setCallFilter={setCallFilter}
                onRefresh={handleRefresh}
                loading={loading}
            />

            <TuongTacKhachHangTableView
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
                total={filteredData.length}
                pageSize={pageSize}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                onSizeChange={handlePageChange}
            />

            <Modal
                className="add_update-modal"
                open={!!editingCustomerInteraction}
                onCancel={() => setEditingCustomerInteraction(null)}
                footer={null}
                width={1000}
                destroyOnClose
            >
                <EditCustomerInteraction
                    customer_interactionId={editingCustomerInteraction}
                    onCancel={() => setEditingCustomerInteraction(null)}
                    onSuccess={handleEditClose}
                />
            </Modal>

            <Modal
                className="add_update-modal"
                open={addCustomerInteraction}
                onCancel={() => setAddCustomerInteraction(false)}
                footer={null}
                width={1000}
                destroyOnClose
            >
                <AddCustomerInteraction
                    visible={addCustomerInteraction}
                    onCancel={() => setAddCustomerInteraction(false)}
                    onSuccess={handleAddSuccess}
                />
            </Modal>

            {deletingCustomerInteraction && (
                <RemoveCustomerInteraction
                    customer_interactionId={deletingCustomerInteraction.ma_tuong_tac_khach_hangg}
                    customer_interactionName={deletingCustomerInteraction.ten_khach_hang}
                    onSuccess={() => {
                        setDeletingCustomerInteraction(null);
                        fetchCustomerInteractions();
                    }}
                    onCancel={() => setDeletingCustomerInteraction(null)}
                />
            )}
        </div>
    );
};

export default BangTuongTacKhachHang;