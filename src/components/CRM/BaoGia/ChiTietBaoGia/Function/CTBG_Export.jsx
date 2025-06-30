import React, { useState } from 'react';
import { Modal, Button, Spin, Tabs } from 'antd';
import { FileExcelOutlined, DownloadOutlined } from '@ant-design/icons';
import { handleExport } from '../../../../utils/export/exportHandlers';
import ExportOptionsTab from '../../../../utils/export/ExportOptionsTab';
import '../../../../utils/css/Custom-Export.css';

const { TabPane } = Tabs;

function ChiTietBaoGia_Export({ data, filteredData, sortedData, onClose, visible }) {
  const [exporting, setExporting] = useState(false);
  const [activeTab, setActiveTab] = useState('1');

  const fieldMappings = {
    ma_chi_tiet_bao_gia: 'Mã chi tiết báo giá',
    stt: 'STT',
    so_bao_gia: 'Số báo giá',
    muc_phan: 'Mục phần',
    mo_ta: 'Mô tả',
    ma_hang: 'Mã hàng',
    so_luong: 'Số lượng',
    don_vi_tinh: 'Đơn vị tính',
    hang_chu_so_huu: 'Hãng chủ sở hữu',
    xuat_xu: 'Xuất xứ',
    don_gia: 'Đơn giá',
    thanh_tien: 'Thành tiền',
    thue_gtgt: 'Thuế GTGT',
    tong_cong: 'Tổng cộng',
    hinh_anh: 'Hình ảnh',
    ghi_chu: 'Ghi chú',
    ty_le_thue_gtgt: 'Tỷ lệ thuế GTGT',
    ty_le_thue_nhap_khau: 'Tỷ lệ thuế nhập khẩu',
    chiet_khau: 'Chiết khấu',
  };

  const [exportOptions, setExportOptions] = useState({
    dataSource: 'sorted',
    fileFormat: 'xlsx',
    exportFields: Object.keys(fieldMappings),
    fileName: `chi_tiet_bao_gia_${new Date().toISOString().split('T')[0]}`,
    includeHeaderRow: true
  });

  return (
    <Modal
      className="export-modal"
      title={<div className="export-modal-title"><FileExcelOutlined /> Xuất dữ liệu chi tiết báo giá</div>}
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

export default ChiTietBaoGia_Export;