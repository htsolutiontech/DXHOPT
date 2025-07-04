import React from 'react';
import { Button } from 'antd';
import { ImportOutlined, ExportOutlined, PlusOutlined, ReloadOutlined, DownloadOutlined } from '@ant-design/icons';

const AreaHeader = ({ title, onImportClick, onExportClick, onAddClick, onAddQuotationClick, onGetdataClick, onResetdataClick, ImportComponent, hideAddButton, disableImport, disableExport, disableGetdata, disableResetdata, disableAdd, disableAddQuotation }) => {
    return (
        <div className="area-header">
            <h2 className="custom-title">{title}</h2>
            <div className="button-level1">
                {onResetdataClick && (
                    <Button icon={<ReloadOutlined />} onClick={onResetdataClick} disabled={disableResetdata}>
                        Khởi tạo dữ liệu
                    </Button>
                )}
                {onImportClick && (
                    <Button icon={<ImportOutlined />} onClick={onImportClick} disabled={disableImport}>
                        Nhập File
                    </Button>
                )}
                {onExportClick && (
                    <Button icon={<ExportOutlined />} onClick={onExportClick} disabled={disableExport}>
                        Xuất File
                    </Button>
                )}
                {onGetdataClick && (
                    <Button icon={<DownloadOutlined />} onClick={onGetdataClick} disabled={disableGetdata}> 
                        Lấy dữ liệu
                    </Button>
                )}
                {!hideAddButton && onAddClick && (
                    <Button type="primary" icon={<PlusOutlined />} onClick={onAddClick} disabled={disableAdd}>
                        Thêm mới
                    </Button>
                )}
                {onAddQuotationClick && (
                    <Button type="primary" icon={<PlusOutlined />} onClick={onAddQuotationClick} disabled={disableAddQuotation}>
                        Tạo báo giá
                    </Button>
                )}
            </div>
            {ImportComponent}
        </div>
    );
};

export default AreaHeader;
