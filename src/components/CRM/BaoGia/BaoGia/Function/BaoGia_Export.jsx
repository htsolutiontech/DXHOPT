import React, { useState } from 'react';
import { Modal, Button, Spin, Tabs } from 'antd';
import { FileExcelOutlined, DownloadOutlined } from '@ant-design/icons';
import { handleExport } from '../../../../utils/export/exportHandlers';
import ExportOptionsTab from '../../../../utils/export/ExportOptionsTab';
import '../../../../utils/css/Custom-Export.css';

const { TabPane } = Tabs;

function BaoGia_Export({ data, filteredData, sortedData, onClose, visible }) {
  const [exporting, setExporting] = useState(false);
  const [activeTab, setActiveTab] = useState('1');

  const fieldMappings = {
    stt: 'STT',
    so_bao_gia: 'Số báo giá',
    tieu_de: 'Tiêu đề',
    loai_bao_gia: 'Loại báo giá',
    tinh_trang: 'Tình trạng',
    ten_khach_hang: 'Khách hàng',
    ngay_bao_gia: 'Ngày báo giá',
    tong_tri_gia: 'Tổng trị giá',
    doi_tuong: 'Đối tượng',
    he_so: 'Hệ số',
    hang_chu_so_huu: 'Hãng chủ sở hữu',
    price_list: 'Price List',
    so_dien_thoai: 'Số điện thoại',
    nguoi_lien_he: 'Người liên hệ',
    nguoi_phu_trach: 'Người phụ trách',
    ten_file_bao_gia: 'Tên file báo giá',
    ghi_chu: 'Ghi chú'
  };

  const [exportOptions, setExportOptions] = useState({
    dataSource: 'sorted',
    fileFormat: 'xlsx',
    exportFields: Object.keys(fieldMappings),
    fileName: `bao_gia_${new Date().toISOString().split('T')[0]}`,
    includeHeaderRow: true
  });

  return (
    <Modal
      className="export-modal"
      title={<div className="export-modal-title"><FileExcelOutlined /> Xuất dữ liệu báo giá</div>}
      open={visible}
      onCancel={onClose}
      width={700}
      footer={[
        <Button key="cancel" onClick={onClose}>Hủy</Button>,
        <Button
          key="export"
          type="primary"
          icon={<DownloadOutlined />}
          onClick={() => {
            setExporting(true);
            handleExport({ exportOptions, data, filteredData, sortedData, fieldMappings, onClose })
              .finally(() => setExporting(false));
          }}
          loading={exporting}
          disabled={exportOptions.exportFields.length === 0}
        >
          Xuất File
        </Button>
      ]}
    >
      {exporting ? (
        <div className="export-loading">
          <Spin tip="Đang xuất dữ liệu..." />
        </div>
      ) : (
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Tùy chọn xuất" key="1">
            <ExportOptionsTab
              exportOptions={exportOptions}
              setExportOptions={setExportOptions}
              data={data}
              filteredData={filteredData}
              sortedData={sortedData}
              fieldMappings={fieldMappings}
            />
          </TabPane>
        </Tabs>
      )}
    </Modal>
  );
}

export default BaoGia_Export;