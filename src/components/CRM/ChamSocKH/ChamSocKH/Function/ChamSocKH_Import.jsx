import React, { useState, useEffect } from 'react';
import { Upload, Button, message, Table, Modal, Alert, Typography, Divider, Spin, Badge } from 'antd';
import { InboxOutlined, FileExcelOutlined, UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import { handleFileUpload } from '../../../../utils/import/handleFileUpload';
import { checkDuplicateInFile, validateData, getFieldLabel } from '../../../../utils/import/validationHelpers';
import { downloadTemplate } from '../../../../utils/import/templateHelpers';
import TemplateDownloadSection from '../../../../utils/import/templateDownloadSection';
import {
  fetchPreviewData,
  renderNguoiPhuTrach,
  renderLoaiTuongTac,
} from './ChamSocKH_ImportRender';
import renderPreview from '../../../../utils/import/renderPreview';
import { createItem } from '../../../../utils/api/requestHelpers';
import { convertDateFields } from '../../../../utils/convert/convertDateFields';
import { renderDateField } from '../../../../utils/format/renderDateField';

const { Dragger } = Upload;

const TuongTacKhachHang_Import = ({ open, onClose, onSuccess, disabled }) => {
  // State quản lý dữ liệu
  const [existingCustomerInteraction, setExistingCustomerInteraction] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [interaction_types, setInteraction_Types] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [parsedData, setParsedData] = useState([]);
  const [importLoading, setImportLoading] = useState(false);
  const [errorItems, setErrorItems] = useState([]);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetchPreviewData(setAccounts, setInteraction_Types, setExistingCustomerInteraction);
    resetState();
  }, [open]);

  // Hàm sinh mã tương tác khách hàng mới
  const generateMaTTKH = (() => {
    let base = null;
    return (index = 0) => {
      // Tìm số lớn nhất trong các mã tương tác khách hàng hiện có (NKxx)
      if (base === null) {
        let maxNumber = 0;
        existingCustomerInteraction.forEach(item => {
          if (item.ma_tuong_tac_khach_hang) {
            const match = item.ma_tuong_tac_khach_hang.match(/^TT(\d+)$/);
            if (match) {
              const num = parseInt(match[1], 10);
              if (num > maxNumber) maxNumber = num;
            }
          }
        });
        base = maxNumber;
      }
      return `TT${base + index + 1}`;
    };
  })();

  const dateFields = ['thoi_gian'];

  // Hàm xử lý sau khi parse file Excel
  const handleAfterParse = (parsedRows) => {
    const dataWithMaTTKH = parsedRows.map((row, idx) => ({
      ...row,
      ma_tuong_tac_khach_hang: generateMaTTKH(idx)
    }));
    const dataWithDateFlags = dataWithMaTTKH.map(item => convertDateFields(item, dateFields));
    setParsedData(dataWithDateFlags);
    handleValidateData(dataWithDateFlags);
    setShowPreview(true);
  };

  // Mapping giữa tiêu đề cột Excel và các trường API
  const columnMapping = {
    'Tên khách hàng': 'ten_khach_hang',
    'Người phụ trách': 'nguoi_phu_trach',
    'Loại tương tác': 'loai_tuong_tac',
    'Hình thức gọi': 'hinh_thuc_goi',
    'Thời gian': 'thoi_gian',
    'Nội dung': 'noi_dung_tuong_tac',
  };

  // Các trường bắt buộc
  const requiredFields = ['ten_khach_hang', 'nguoi_phu_trach', 'loai_tuong_tac', 'thoi_gian'];

  // Hàm xác thực dữ liệu
  const handleValidateData = (data) => {
    return validateData(
      data,
      requiredFields,
      (field) => getFieldLabel(field, columnMapping),
      setErrorItems,
      'ma_tuong_tac_khach_hang', // keyField
      'ten_khach_hang', // nameField
      {},                     // validators (nếu có)
      {},                     // duplicates (nếu có)
      dateFields,             // truyền mảng các trường ngày
      columnMapping 
    );
  };

  // Hàm chuẩn bị dữ liệu để gửi
  const prepareDataForImport = (data) => {
    return data.map(item => {
      const converted = convertDateFields(item, ['thoi_gian']);
      return {
        ...converted,
      };
    });
  };

  // Hàm nhập từng dòng
  const importSingleItem = async (item) => {
    try {
      const result = await createItem('https://dx.hoangphucthanh.vn:3000/crm/customer-interactions', item);
      return result?.success;
    } catch (error) {
      console.error('Lỗi khi nhập từng item:', error);
      return false;
    }
  };

  // Hàm nhập toàn bộ dữ liệu
  const importAllItems = async (data) => {
    try {
      const result = await createItem('https://dx.hoangphucthanh.vn:3000/crm/customer-interactions', data);
      return result?.success;
    } catch (error) {
      console.error('Error importing data:', error);
      throw error;
    }
  };

  // Hàm xử lý nhập dữ liệu
  const handleImport = async () => {
    if (errorItems.length > 0) {
      message.error('Vui lòng sửa lỗi trước khi nhập dữ liệu!');
      return;
    }

    if (parsedData.length === 0) {
      message.warning('Không có dữ liệu để nhập!');
      return;
    }

    setImportLoading(true);

    try {
      const dataToImport = prepareDataForImport(parsedData);
      console.log('Data gửi lên:', dataToImport);

      // Thử nhập toàn bộ dữ liệu
      const success = await importAllItems(dataToImport);

      if (success) {
        message.success(`Đã nhập ${dataToImport.length} dữ liệu tương tác khách hàng thành công!`);
        fetchPreviewData(setAccounts, setInteraction_Types, setExistingCustomerInteraction);
        resetState();
        onSuccess?.();
        onClose();
        return;
      }

      throw new Error('Có lỗi xảy ra khi nhập dữ liệu');
    } catch (error) {
      message.error(`Không thể nhập dữ liệu: ${error.message}`);
      message.info('Thử một cách khác - tạo từng dữ liệu tương tác khách hàng một...');

      // Thử nhập từng dòng
      let successCount = 0;
      for (const item of prepareDataForImport(parsedData)) {
        const success = await importSingleItem(item);
        if (success) successCount++;
      }

      if (successCount > 0) {
        message.success(`Đã nhập ${successCount}/${parsedData.length} dữ liệu tương tác khách hàng thành công!`);
      } else {
        message.error('Không thể nhập được dữ liệu tương tác khách hàng nào!');
      }

      // Cập nhật lại danh sách dữ liệu tương tác khách hàng hiện có sau khi import từng dòng
      fetchPreviewData(setAccounts, setInteraction_Types, setExistingCustomerInteraction);
      resetState();
      onSuccess?.();
      onClose();
    } finally {
      setImportLoading(false);
    }
  };

  // Hàm reset state
  const resetState = () => {
    setFileList([]);
    setParsedData([]);
    setErrorItems([]);
    setShowPreview(false);
    generateMaTTKH.base = null;
  };

  // Hàm đóng modal
  const handleClose = () => {
    resetState();
    onClose();
  };

  // Cấu hình cột cho bảng xem trước dữ liệu
  const previewColumns = [
    { title: 'STT', dataIndex: 'key', key: 'key', width: "5%",
      render: (text) => text + 1 
    },
    { 
      title: 'Mã TTKH', 
      dataIndex: 'ma_tuong_tac_khach_hang', 
      key: 'ma_tuong_tac_khach_hang', 
      width: "5%",
    },
    { 
      title: 'Tên khách hàng', 
      dataIndex: 'ten_khach_hang', 
      key: 'ten_khach_hang', 
      width: "20%",
    },
    {
      title: 'Người phụ trách',
      dataIndex: 'nguoi_phu_trach',
      key: 'nguoi_phu_trach',
      width: "15%",
      render: (maNguoiDung, record) => renderNguoiPhuTrach(maNguoiDung, record, accounts, errorItems)
    },
    {
      title: 'Loại tương tác',
      dataIndex: 'loai_tuong_tac',
      key: 'loai_tuong_tac',
      width: "15%",
      render: (maLoaiTuongTac, record) => renderLoaiTuongTac(maLoaiTuongTac, record, interaction_types, errorItems)
    },
    { 
      title: 'Hình thức gọi', 
      dataIndex: 'hinh_thuc_goi', 
      key: 'hinh_thuc_goi', 
      width: "10%",
    },
    {
      title: 'Thời gian',
      dataIndex: 'thoi_gian',
      key: 'thoi_gian',
      width: "10%",
      render: (value, record) => renderDateField(value, record, errorItems, 'Thời gian', 'thoi_gian')
    },
    { 
      title: 'Nội dung', 
      dataIndex: 'noi_dung_tuong_tac', 
      key: 'noi_dung_tuong_tac', 
      width: "20%",
    },
  ];

  // Hàm tải xuống file mẫu
  const handleDownloadTemplate = () => {
    const columns = Object.keys(columnMapping);
    const sampleData = [
      ['CÔNG TY CP BỆNH VIỆN HOÀN MỸ ĐỒNG NAI', 'Đỗ Thị Linh Phương', 'Gọi điện thoại chăm sóc', 'Gọi đi', '03.07.2025', 'Hỏi thăm tình hình sử dụng sản phẩm'],
      ['BỆNH VIỆN QUẬN THỦ ĐỨC', 'Đỗ Thị Linh Phương', 'Gặp mặt trực tiếp', '', '03.07.2025', 'Họp bàn về hợp đồng mới']
    ];
    downloadTemplate(columns, sampleData, 'Template_Tuong_Tac_Khach_Hang');
  };

  // Hàm render phần tải xuống file mẫu
  const renderTemplateSection = () => (
    <TemplateDownloadSection handleDownloadTemplate={handleDownloadTemplate} />
  );

  // Hàm render uploader
  const renderUploader = () => (
    <Dragger
      name="file"
      multiple={false}
      fileList={fileList}
      beforeUpload={(file) => handleFileUpload(file, {
        columnMapping,
        setParsedData: handleAfterParse,
        validateData: () => {},
        setShowPreview,
        setFileList,
        accounts,
        interaction_types,
        mode: 'tuongtackhachhang'
      })}
      onRemove={() => resetState()}
      accept=".xlsx,.xls"
    >
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">Kéo thả file hoặc Click để chọn file Excel</p>
      <p className="ant-upload-hint">
        Chỉ hỗ trợ file Excel (.xlsx, .xls)
      </p>
    </Dragger>
  );

  // Hàm để lấy tiêu đề lỗi
  const getErrorTitle = (item) => `Hàng ${item.index + 1}`;

  // Hàm để lấy mô tả lỗi
  const getErrorDescription = (item) => item.errors.join(', ');

  // Sử dụng renderPreview
  const renderPreviewSection = () => {
    return renderPreview({
      label: "Tổng số dữ liệu tương tác khách hàng",
      dataSource: parsedData,
      columns: previewColumns,
      errorItems,
      onCancel: resetState,
      onImport: handleImport,
      importLoading,
      hasErrors: errorItems.length > 0,
      scrollX: 1200, // Giá trị cuộn ngang
      pageSize: 20, // Số lượng hàng trên mỗi trang
      getErrorTitle, // Truyền hàm lấy tiêu đề lỗi
      getErrorDescription, // Truyền hàm lấy mô tả lỗi
      disabled,
    });
  };

  return (
    <Modal
      className="import-modal"
      title={
        <div className="import-modal-title">
          <UploadOutlined /> Nhập danh sách dữ liệu tương tác khách hàng từ Excel
        </div>
      }
      open={open}
      onCancel={handleClose}
      footer={null}
      width={1200}
      destroyOnClose
    >
      <Spin spinning={importLoading} tip="Đang nhập dữ liệu...">
        <div className="import-container">
          {!showPreview && (
            <Alert
              message="Hướng dẫn nhập dữ liệu"
              description={
                <ol>
                  <li>Tải xuống file mẫu Excel hoặc sử dụng file có cấu trúc tương tự.</li>
                  <li>Điền thông tin dữ liệu tương tác khách hàng vào file (mỗi dòng là một dữ liệu tương tác khách hàng).</li>
                  <li>Tải lên file Excel đã điền thông tin.</li>
                  <li>Kiểm tra dữ liệu xem trước và sửa các lỗi nếu có.</li>
                  <li>Nhấn "Nhập dữ liệu" để hoàn tất.</li>
                  <li>Các trường bắt buộc: Tên khách hàng, Người phụ trách, Loại tương tác, Thời gian, Nội dung.</li>
                </ol>
              }
              type="info"
              showIcon
            />
          )}

          <div className="import-content">
            {!showPreview ? (
              <>
                {renderTemplateSection()}
                <Divider />
                {renderUploader()}
              </>
            ) : (
              renderPreviewSection()
            )}
          </div>
        </div>
      </Spin>
    </Modal>
  );
};

export default TuongTacKhachHang_Import;