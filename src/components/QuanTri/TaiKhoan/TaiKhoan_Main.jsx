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
// Hàm reset các bộ lọc
import { resetFilters } from '../../utils/data/resetFilter';
// Header của mỗi bảng dữ liệu
import AreaHeader from '../../utils/jsx/AreaHeader';
import { sortTableData } from '../../utils/data/sortTable';
import { hasFullPermission } from '../../utils/auth/permissionUtils';

// Các tính năng
import './TaiKhoan_Main.css';
import NguoiDung_Export from './Function/TaiKhoan_Export';
import NguoiDungFilter from './Function/TaiKhoan_Filter';
import { filterNguoiDung } from "./Function/TaiKhoan_FilterLogic";
import NguoiDungTableView from './View/TaiKhoan_TableView';
import EditUser from './Function/TaiKhoan_Update';
import AddUser from './Function/TaiKhoan_Add';
import RemoveUser from './Function/TaiKhoan_Delete';

const BangNguoiDung = () => {
    // State lưu dữ liệu bảng và trạng thái chung
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const canEdit = hasFullPermission(undefined, {
        allowedUsernames: [] ,// Thêm user này có toàn quyền
        allowedRoles: ['VT01'], // Thêm role này có toàn quyền
    });

    // State các bộ lọc và phân trang
    const [showExportModal, setShowExportModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [yearFilter, setYearFilter] = useState('all');
    const [roleFilter, setRoleFilter] = useState('all');
    const [pageSize, setPageSize] = useState(20);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState('ngay_tao');
    const [sortOrder, setSortOrder] = useState('descend');
    const [editingAccount, setEditingAccount] = useState(null);
    const [addAccount, setAddAccount] = useState(false);
    const [deletingAccount, setDeletingAccount] = useState(null);

    // Gọi API lấy danh sách khách hàng bằng hàm tái sử dụng
    const fetchAccounts = () => {
        fetchData({
            endpoint: '/accounts', // endpoint API
            setData,                // set state dữ liệu
            setLoading,             // set trạng thái loading
        });
    };

    // Tự động gọi API khi component mount
    useEffect(() => {
        fetchAccounts();
    }, []);

    const handleEdit = (record) => {
        setEditingAccount(record.ma_nguoi_dung);
    };

    const handleEditClose = () => {
        setEditingAccount(null);
        fetchAccounts();
    };

    const handleAddSuccess = () => {
        setAddAccount(false);
        fetchAccounts();
    };

    const handleRemove = (record) => {
        setDeletingAccount(record);
    };   

    const handleRefresh = () => {
        setSearchTerm('');
        resetFilters([setYearFilter, setRoleFilter]);
        setCurrentPage(1);
        fetchAccounts();
        setSortField('ngay_tao');
        setSortOrder('descend');
    };

    const filteredData = filterNguoiDung(data, {
        searchTerm,
        yearFilter,
        roleFilter,
    });
    const sortedData = sortField
        ? sortTableData(filteredData, sortField, sortOrder)
        : sortTableData(filteredData, 'ngay_tao', 'descend');

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };

    return (
        <div className="bang-nguoi-dung-container">
            <AreaHeader
                title="Danh sách tài khoản người dùng"
                onExportClick={() => setShowExportModal(true)}
                onAddClick={() => setAddAccount(true)}
                disableAdd={!canEdit}
            />

            <NguoiDung_Export
                data={data}
                filteredData={filteredData}
                sortedData={sortedData}
                visible={showExportModal}
                onClose={() => setShowExportModal(false)}
            />

            <NguoiDungFilter
                data={data}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                yearFilter={yearFilter}
                setYearFilter={setYearFilter}
                roleFilter={roleFilter}
                setRoleFilter={setRoleFilter}
                onRefresh={handleRefresh}
                loading={loading}
            />

            <NguoiDungTableView
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
                open={!!editingAccount}
                onCancel={() => setEditingAccount(null)}
                footer={null}
                width={1000}
                destroyOnClose
            >
                <EditUser
                    userId={editingAccount}
                    onCancel={() => setEditingAccount(null)}
                    onSuccess={handleEditClose}
                />
            </Modal>

            <Modal
                className="add_update-modal"
                open={addAccount}
                onCancel={() => setAddAccount(false)}
                footer={null}
                width={1000}
                destroyOnClose
            >
                <AddUser
                    visible={addAccount}
                    onCancel={() => setAddAccount(false)}
                    onSuccess={handleAddSuccess}
                />
            </Modal>

            {deletingAccount && (
                <RemoveUser
                    userId={deletingAccount.ma_nguoi_dung}
                    userName={deletingAccount.ho_va_ten}
                    onSuccess={() => {
                        setDeletingAccount(null);
                        fetchAccounts();
                    }}
                    onCancel={() => setDeletingAccount(null)}
                />
            )}
        </div>
    );
};

export default BangNguoiDung;