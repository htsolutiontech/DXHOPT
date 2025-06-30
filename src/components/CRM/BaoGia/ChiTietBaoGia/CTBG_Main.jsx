// Thư viện React và Ant Design
import React, { useState, useEffect } from 'react';
import { Modal, message } from 'antd';

//Thao tác chung
// Các file CSS dùng chung để chuẩn hóa giao diện bảng, nút, filter
import '../../../utils/css/Custom-Table.css';
import '../../../utils/css/Custom-Button.css';
import '../../../utils/css/Custom-Filter.css';

// Component phân trang
import PaginationControl from '../../../utils/format/PaginationControl';
// Hàm reset các bộ lọc
import { resetFilters } from '../../../utils/data/resetFilter';
// Header của mỗi bảng dữ liệu
import AreaHeader from '../../../utils/jsx/AreaHeader';
import { sortTableData } from '../../../utils/data/sortTable';
import { hasFullPermission } from '../../../utils/auth/permissionUtils';

// Các tính năng
import './CTBG_Main.css';
import ChiTietBaoGia_Export from './Function/CTBG_Export';
import ChiTietBaoGiaFilter from './Function/CTBG_Filter';
import { filterChiTietBaoGia } from "./Function/CTBG_FilterLogic";
import ChiTietBaoGiaTableView from './View/CTBG_TableView';
import { fetchData } from './View/CTBG_apiHandler';

const BangChiTietBaoGia = () => {
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
    const [sectionSearch, setSectionSearch] = useState('');
    const [saleunitFilter, setSaleUnitFilter] = useState('all');
    const [countryFilter, setCountryFilter] = useState('all');
    const [supplierFilter, setSupplierFilter] = useState('all');
    const [pageSize, setPageSize] = useState(20);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState('ma_chi_tiet_bao_gia');
    const [sortOrder, setSortOrder] = useState('descend');

    const fetchQuotation_Details = () => {
        fetchData({
            endpoint: '/quotation-details', // endpoint API
            setData,                // set state dữ liệu
            setLoading,             // set trạng thái loading
            apiType: 'crm'          // Chỉ định sử dụng API CRM
        });
    };

    // Tự động gọi API khi component mount
    useEffect(() => {
        fetchQuotation_Details();
    }, []);

    const handleRefresh = () => {
        setSearchTerm('');
        setSectionSearch('');
        resetFilters([setSaleUnitFilter, setCountryFilter, setSupplierFilter]);
        setCurrentPage(1);
        fetchQuotation_Details();
        setSortField('ma_chi_tiet_bao_gia');
        setSortOrder('descend');
    };

    const filteredData = filterChiTietBaoGia(data, {
        searchTerm,
        sectionSearch,
        saleunitFilter,
        countryFilter,
        supplierFilter,
    });
    const sortedData = sortField
        ? sortTableData(filteredData, sortField, sortOrder)
        : sortTableData(filteredData, 'ma_chi_tiet_bao_gia', 'descend');

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };

    return (
        <div className="bang-chi-tiet-bao-gia-container">
            <AreaHeader
                title="Danh mục chi tiết báo giá"
                onExportClick={() => setShowExportModal(true)}
            />

            <ChiTietBaoGia_Export
                data={data}
                filteredData={filteredData}
                sortedData={sortedData}
                visible={showExportModal}
                onClose={() => setShowExportModal(false)}
            />

            <ChiTietBaoGiaFilter
                data={data}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                sectionSearch={sectionSearch}
                setSectionSearch={setSectionSearch}
                saleunitFilter={saleunitFilter}
                setSaleUnitFilter={setSaleUnitFilter}
                countryFilter={countryFilter}
                setCountryFilter={setCountryFilter}
                supplierFilter={supplierFilter}
                setSupplierFilter={setSupplierFilter}
                onRefresh={handleRefresh}
                loading={loading}
            />

            <ChiTietBaoGiaTableView
                data={sortedData}
                currentPage={currentPage}
                pageSize={pageSize}
                loading={loading}
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
        </div>
    );
};

export default BangChiTietBaoGia;