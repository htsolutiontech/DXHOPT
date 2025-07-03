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
import './KhachHangTN_Main.css';
import KhachHangTiemNang_Export from './Function/KhachHangTN_Export';
import KhachHangTiemNangFilter from './Function/KhachHangTN_Filter';
import { filterKhachHangTiemNang } from "./Function/KhachHangTN_FilterLogic";
import KhachHangTiemNangTableView from './View/KhachHangTN_TableView';
import EditPotentialCustomer from './Function/KhachHangTN_Update';
import AddPotentialCustomer from './Function/KhachHangTN_Add';
import RemovePotentialCustomer from './Function/KhachHangTN_Delete';

const BangKhachHangTiemNang = () => {
    // State lưu dữ liệu bảng và trạng thái chung
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const canEdit = hasFullPermission(undefined, {
        allowedUsernames: ['DTLphuong', 'PPcuong'] ,// Thêm user này có toàn quyền
        allowedRoles: ['VT01', 'VT02', 'VT04'], // Thêm role này có toàn quyền
    });

    // State các bộ lọc và phân trang
    const [showExportModal, setShowExportModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [yearFilter, setYearFilter] = useState('all');
    const [accountFilter, setAccountFilter] = useState('all');
    const [provinceFilter, setProvinceFilter] = useState('all');
    const [nextactionFilter, setNextActionFilter] = useState('all');
    const [purposeFilter, setPurposeFilter] = useState('all');
    const [pageSize, setPageSize] = useState(20);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState('ngay_them_vao');
    const [sortOrder, setSortOrder] = useState('descend');
    const [editingPotentialCustomer, setEditingPotentialCustomer] = useState(null);
    const [addPotentialCustomer, setAddPotentialCustomer] = useState(false);
    const [deletingPotentialCustomer, setDeletingPotentialCustomer] = useState(null);

    // Gọi API lấy danh sách khách hàng bằng hàm tái sử dụng
    const fetchPotentialCustomers = () => {
        fetchData({
            endpoint: '/potential-customers', // endpoint API
            setData,                // set state dữ liệu
            setLoading,             // set trạng thái loading
            apiType: 'crm'          // Chỉ định sử dụng API CRM
        });
    };

    // Tự động gọi API khi component mount
    useEffect(() => {
        fetchPotentialCustomers();
    }, []);

    const handleEdit = (record) => {
        setEditingPotentialCustomer(record.ma_khach_hang_tiem_nang);
    };

    const handleEditClose = () => {
        setEditingPotentialCustomer(null);
        fetchPotentialCustomers();
    };

    const handleAddSuccess = () => {
        setAddPotentialCustomer(false);
        fetchPotentialCustomers();
    };

    const handleRemove = (record) => {
        setDeletingPotentialCustomer(record);
    };   

    const handleRefresh = () => {
        setSearchTerm('');
        resetFilters([setYearFilter, setAccountFilter, setProvinceFilter, setNextActionFilter, setPurposeFilter]);
        setCurrentPage(1);
        fetchPotentialCustomers();
        setSortField('ngay_them_vao');
        setSortOrder('descend');
    };

    const filteredData = filterKhachHangTiemNang(data, {
        searchTerm,
        yearFilter,
        accountFilter,
        provinceFilter,
        nextactionFilter,
        purposeFilter,
    });
    const sortedData = sortField
        ? sortTableData(filteredData, sortField, sortOrder)
        : sortTableData(filteredData, 'ngay_them_vao', 'descend');

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };

    return (
        <div className="bang-khach-hang-tiem-nang-container">
            <AreaHeader
                title="Danh mục khách hàng khách hàng tiềm năng"
                onExportClick={() => setShowExportModal(true)}
                onAddClick={() => setAddPotentialCustomer(true)}
                disableAdd={!canEdit}
            />

            <KhachHangTiemNang_Export
                data={data}
                filteredData={filteredData}
                sortedData={sortedData}
                visible={showExportModal}
                onClose={() => setShowExportModal(false)}
            />

            <KhachHangTiemNangFilter
                data={data}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                yearFilter={yearFilter}
                setYearFilter={setYearFilter}
                accountFilter={accountFilter}
                setAccountFilter={setAccountFilter}
                provinceFilter={provinceFilter}
                setProvinceFilter={setProvinceFilter}
                nextactionFilter={nextactionFilter}
                setNextActionFilter={setNextActionFilter}
                purposeFilter={purposeFilter}
                setPurposeFilter={setPurposeFilter}
                onRefresh={handleRefresh}
                loading={loading}
            />

            <KhachHangTiemNangTableView
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
                open={!!editingPotentialCustomer}
                onCancel={() => setEditingPotentialCustomer(null)}
                footer={null}
                width={1000}
                destroyOnClose
            >
                <EditPotentialCustomer
                    potential_customerId={editingPotentialCustomer}
                    onCancel={() => setEditingPotentialCustomer(null)}
                    onSuccess={handleEditClose}
                />
            </Modal>

            <Modal
                className="add_update-modal"
                open={addPotentialCustomer}
                onCancel={() => setAddPotentialCustomer(false)}
                footer={null}
                width={1000}
                destroyOnClose
            >
                <AddPotentialCustomer
                    visible={addPotentialCustomer}
                    onCancel={() => setAddPotentialCustomer(false)}
                    onSuccess={handleAddSuccess}
                />
            </Modal>

            {deletingPotentialCustomer && (
                <RemovePotentialCustomer
                    potential_customerId={deletingPotentialCustomer.ma_khach_hang_tiem_nang}
                    potential_customerName={deletingPotentialCustomer.ten_khach_hang}
                    onSuccess={() => {
                        setDeletingPotentialCustomer(null);
                        fetchPotentialCustomers();
                    }}
                    onCancel={() => setDeletingPotentialCustomer(null)}
                />
            )}
        </div>
    );
};

export default BangKhachHangTiemNang;