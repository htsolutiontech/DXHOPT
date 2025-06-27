import React from 'react';
import { Table } from 'antd';
import { getChiTietBaoGiaColumns } from './CTBG_Columns';
import '../CTBG_Main.css';

const ChiTietBaoGiaTableView = ({
    data,
    currentPage,
    pageSize,
    loading,
    onSortChange,
    sortField,
    sortOrder,
}) => {
    // Lấy columns gốc
    let columns = getChiTietBaoGiaColumns();

    // Gắn sortOrder cho đúng cột đang sort
    columns = columns.map(col =>
        col.key === sortField
            ? { ...col, sortOrder: sortOrder || undefined }
            : { ...col, sortOrder: undefined }
    );

    return (
        <div className="bang-chi-tiet-bao-gia-scroll-wrapper">
            <div style={{ width: 2100 }}>
                <Table
                    columns={columns}
                    dataSource={data.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
                    rowKey="ma_chi_tiet_bao_gia"
                    bordered
                    size="small"
                    pagination={false}
                    className="custom-ant-table"
                    loading={loading}
                    onChange={(_, __, sorter) => {
                        if (sorter && sorter.columnKey && sorter.order) {
                            onSortChange && onSortChange(sorter.columnKey, sorter.order);
                        } else {
                            onSortChange && onSortChange('ma_chi_tiet_bao_gia', 'descend');
                        }
                    }}
                    sortDirections={['descend', 'ascend']}
                />
            </div>
        </div>
    );
};

export default ChiTietBaoGiaTableView;
