import React, { useState } from 'react';
import { Modal, Button, Spin, Tabs } from 'antd';
import { FileExcelOutlined, DownloadOutlined } from '@ant-design/icons';
import { handleExport } from '../../../../utils/export/exportHandlers';
import ExportOptionsTab from '../../../../utils/export/ExportOptionsTab';
import '../../../../utils/css/Custom-Export.css';

const { TabPane } = Tabs;

function KhachHangTiemNang_Export({ data, filteredData, sortedData, onClose, visible }) {
  const [exporting, setExporting] = useState(false);
  const [activeTab, setActiveTab] = useState('1');

  const fieldMappings = {
    stt: 'STT',
    ma_khach_hang_tiem_nang: 'Mã khách hàng tiềm năng',
    ten_khach_hang: 'Tên khách hàng',
    nguoi_phu_trach: 'Người phụ trách',
    hanh_dong_tiep_theo: 'Hành động tiếp theo',
    ngay_lien_lac_tiep_theo: 'Ngày liên lạc tiếp theo',
    so_lan_da_lien_lac: 'Số lần đã liên lạc',
    muc_dich: 'Mục đích',
    nhom_khach_hang: 'Nhóm khách hàng',
    nguon_tiep_can: 'Nguồn tiếp cận',
    tinh_trang: 'Tình trạng',
    ngay_them_vao: 'Ngày thêm vào',
    email: 'Email',
    so_dien_thoai: 'Số điện thoại',
    tinh_thanh: 'Tỉnh thành',
    dia_chi_cu_the: 'Địa chỉ cụ thể',
    website: 'Website',
    ghi_chu: 'Ghi chú',
  };

  const [exportOptions, setExportOptions] = useState({
    dataSource: 'sorted',
    fileFormat: 'xlsx',
    exportFields: Object.keys(fieldMappings),
    fileName: `khach_hang_tiem_nang_${new Date().toISOString().split('T')[0]}`,
    includeHeaderRow: true
  });

  return (
    <Modal
      className="export-modal"
      title={<div className="export-modal-title"><FileExcelOutlined /> Xuất dữ liệu khách hàng tiềm năng</div>}
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

export default KhachHangTiemNang_Export;