// Thư viện React và Ant Design
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
import './BaoGia_Main.css';
import BaoGia_Export from './Function/BaoGia_Export';
import BaoGiaFilter from './Function/BaoGia_Filter';
import { filterBaoGia } from "./Function/BaoGia_FilterLogic";
import BaoGiaTableView from './View/BaoGia_TableView';
import RemoveQuotation from './Function/BaoGia_Delete';

const BangBaoGia = () => {
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
    const [quotation_typeFilter, setQuotation_TypeFilter] = useState('all');
    const [quotation_statusFilter, setQuotation_StatusFilter] = useState('all');
    const [accountFilter, setAccountFilter] = useState('all');
    const [pageSize, setPageSize] = useState(20);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState('ngay_bao_gia');
    const [sortOrder, setSortOrder] = useState('descend');
    const [deletingQuotation, setDeletingQuotation] = useState(null);

    const navigate = useNavigate();

    // Gọi API lấy danh sách khách hàng bằng hàm tái sử dụng
    const fetchQuotations = () => {
        fetchData({
            endpoint: '/quotations', // endpoint API
            setData,                // set state dữ liệu
            setLoading,             // set trạng thái loading
            apiType: 'crm'          // Chỉ định sử dụng API CRM
        });
    };

    // Tự động gọi API khi component mount
    useEffect(() => {
        fetchQuotations();
    }, []);

    // const handleEdit = (record) => {
    //     setEditingContract(record.so_hop_dong);
    // };

    // const handleEditClose = () => {
    //     setEditingContract(null);
    //     fetchContracts();
    // };

    const handleRemove = (record) => {
        setDeletingQuotation(record);
    };

    const handleRefresh = () => {
        setSearchTerm('');
        resetFilters([setYearFilter, setAccountFilter, setQuotation_StatusFilter, setQuotation_TypeFilter]);
        setCurrentPage(1);
        fetchQuotations();
        setSortField('ngay_bao_gia');
        setSortOrder('descend');
    };

    const filteredData = filterBaoGia(data, {
        searchTerm,
        yearFilter,
        quotation_typeFilter,
        quotation_statusFilter,
        accountFilter,
    });
    const sortedData = sortField
        ? sortTableData(filteredData, sortField, sortOrder)
        : sortTableData(filteredData, 'ngay_bao_gia', 'descend');

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };

    return (
        <div className="bang-bao-gia-container">
            <AreaHeader
                title="Danh mục báo giá"
                onExportClick={() => setShowExportModal(true)}
                onAddQuotationClick={() => navigate('/system/crm/auto_number_quote')}
            />

            <BaoGia_Export
                data={data}
                filteredData={filteredData}
                sortedData={sortedData}
                visible={showExportModal}
                onClose={() => setShowExportModal(false)}
            />

            <BaoGiaFilter
                data={data}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                yearFilter={yearFilter}
                setYearFilter={setYearFilter}
                quotation_typeFilter={quotation_typeFilter}
                setQuotation_TypeFilter={setQuotation_TypeFilter}
                quotation_statusFilter={quotation_statusFilter}
                setQuotation_StatusFilter={setQuotation_StatusFilter}
                accountFilter={accountFilter}
                setAccountFilter={setAccountFilter}
                onRefresh={handleRefresh}
                loading={loading}
            />

            <BaoGiaTableView
                data={sortedData}
                currentPage={currentPage}
                pageSize={pageSize}
                loading={loading}
                // handleEdit={handleEdit}
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

            {deletingQuotation && (
                <RemoveQuotation
                    quotationId={deletingQuotation.so_bao_gia}
                    onSuccess={() => {
                        setDeletingQuotation(null);
                        fetchQuotations();
                    }}
                    onCancel={() => setDeletingQuotation(null)}
                />
            )}
        </div>
    );
};

export default BangBaoGia;