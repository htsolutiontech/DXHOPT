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
  renderMaLoaiTuongTac,
  renderLoaiTuongTac,
  renderNguoiCapNhat,
  isInteractionTypeExisting,
} from './LoaiTuongTac_ImportRender';
import renderPreview from '../../../../utils/import/renderPreview';
import { createItem } from '../../../../utils/api/requestHelpers';

const { Dragger } = Upload;

const LoaiTuongTac_Import = ({ open, onClose, onSuccess, disabled }) => {
  // State quản lý dữ liệu
  const [existingInteractionTypes, setExistingInteractionTypes] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [parsedData, setParsedData] = useState([]);
  const [importLoading, setImportLoading] = useState(false);
  const [errorItems, setErrorItems] = useState([]);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetchPreviewData(setAccounts, setExistingInteractionTypes);
    resetState();
  }, [open]);

  // Hàm sinh mã loại tương tác mới
  const generateMaLoaiTuongTac = (() => {
    let base = null;
    return (index = 0) => {
      if (base === null) {
        let maxNumber = 0;
        existingInteractionTypes.forEach(item => {
          if (item.ma_loai_tuong_tac) {
            const match = item.ma_loai_tuong_tac.match(/^LTT(\d+)$/);
            if (match) {
              const num = parseInt(match[1], 10);
              if (num > maxNumber) maxNumber = num;
            }
          }
        });
        base = maxNumber;
      }
      return `LTT${String(base + index + 1).padStart(2, '0')}`;
    };
  })();

  // Hàm xử lý sau khi parse file Excel
  const handleAfterParse = (parsedRows) => {
    // Gán mã tương tác tự động cho từng dòng
    const dataWithMaLTT = parsedRows.map((row, idx) => ({
      ...row,
      ma_loai_tuong_tac: generateMaLoaiTuongTac(idx)
    }));
    setParsedData(dataWithMaLTT);
    handleValidateData(dataWithMaLTT);
    setShowPreview(true);
  };

  // Mapping giữa tiêu đề cột Excel và các trường API
  const columnMapping = {
    'Loại tương tác': 'loai_tuong_tac',
    'Người cập nhật': 'nguoi_cap_nhat',
  };

  // Các trường bắt buộc
  const requiredFields = ['loai_tuong_tac', 'nguoi_cap_nhat'];
  const uniqueFields = ['loai_tuong_tac'];

  // Hàm xác thực dữ liệu
  const handleValidateData = (data) => {
    // Kiểm tra trùng trong file
    const duplicates = checkDuplicateInFile(data, uniqueFields);

    return validateData(
      data,
      requiredFields,
      (field) => getFieldLabel(field, columnMapping),
      setErrorItems,
      'ma_loai_tuong_tac',
      'loai_tuong_tac',
      {
        loai_tuong_tac: (value) => isInteractionTypeExisting(value, existingInteractionTypes),
      },
      duplicates // truyền vào validateData
    );
  };

  // Hàm chuẩn bị dữ liệu để gửi
  const prepareDataForImport = (data) => {
    return data.map(item => ({
      ...item,
      ngay_cap_nhat: item.ngay_cap_nhat
        ? moment(item.ngay_cap_nhat).format('YYYY-MM-DD')
        : undefined,
    }));
  };

  // Hàm nhập từng dòng
  const importSingleItem = async (item) => {
    try {
      const result = await createItem('https://dx.hoangphucthanh.vn:3000/crm/interaction-types', item);
      return result?.success;
    } catch (error) {
      console.error('Lỗi khi nhập từng item:', error);
      return false;
    }
  };

  // Hàm nhập toàn bộ dữ liệu
  const importAllItems = async (data) => {
    try {
      const result = await createItem('https://dx.hoangphucthanh.vn:3000/crm/interaction-types', data);
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

      // Thử nhập toàn bộ dữ liệu
      const success = await importAllItems(dataToImport);

      if (success) {
        message.success(`Đã nhập ${dataToImport.length} loại tương tác thành công!`);
        fetchPreviewData(setAccounts, setExistingInteractionTypes);
        resetState();
        onSuccess?.();
        onClose();
        return;
      }

      throw new Error('Có lỗi xảy ra khi nhập dữ liệu');
    } catch (error) {
      message.error(`Không thể nhập dữ liệu: ${error.message}`);
      message.info('Thử một cách khác - tạo từng tương tác một...');

      // Thử nhập từng dòng
      let successCount = 0;
      for (const item of prepareDataForImport(parsedData)) {
        const success = await importSingleItem(item);
        if (success) successCount++;
      }

      if (successCount > 0) {
        message.success(`Đã nhập ${successCount}/${parsedData.length} loại tương tác thành công!`);
      } else {
        message.error('Không thể nhập được loại tương tác nào!');
      }
      fetchPreviewData(setAccounts, setExistingInteractionTypes);
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
    generateMaLoaiTuongTac.base = null;
  };

  // Hàm đóng modal
  const handleClose = () => {
    resetState();
    onClose();
  };

  // Cấu hình cột cho bảng xem trước dữ liệu
  const previewColumns = [
    { title: 'STT', dataIndex: 'key', key: 'key', width: "2%",
      render: (text) => text + 1 
    },
    { 
      title: 'Mã loại tương tác', 
      dataIndex: 'ma_loai_tuong_tac', 
      key: 'ma_loai_tuong_tac', 
      width: "10%",
      render: (text, record) => renderMaLoaiTuongTac(text, record, errorItems, existingInteractionTypes)
    },
    { 
      title: 'Loại tương tác', 
      dataIndex: 'loai_tuong_tac', 
      key: 'loai_tuong_tac', 
      width: "20%",
      render: (text, record) => renderLoaiTuongTac(text, record, errorItems, existingInteractionTypes)
    },
    { title: 'Trạng thái', dataIndex: 'trang_thai', key: 'trang_thai', width: "10%" },
    {
      title: 'Người cập nhật',
      dataIndex: 'nguoi_cap_nhat',
      key: 'nguoi_cap_nhat',
      width: "20%",
      render: (maNguoiDung, record) => renderNguoiCapNhat(maNguoiDung, record, accounts, errorItems)
    },
    { title: 'Ngày cập nhật', dataIndex: 'ngay_cap_nhat', key: 'ngay_cap_nhat', width: "10%" },
  ];

  // Hàm tải xuống file mẫu
  const handleDownloadTemplate = () => {
    const columns = Object.keys(columnMapping);
    const sampleData = [
      ['Chăm sóc qua tin nhắn 1', 'Hứa Tường Huy', ''],
      ['Gửi email chăm sóc 1', 'Hứa Tường Huy', '']
    ];
    downloadTemplate(columns, sampleData, 'Template_Loai_Tuong_Tac');
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
        setParsedData: handleAfterParse, // Dùng hàm mới
        validateData: () => {}, // validate sau khi setParsedData
        setShowPreview,
        setFileList,
        accounts,
        defaultFields: { trang_thai: 'Hoạt động', ngay_cap_nhat: moment().format('YYYY-MM-DD') },
        mode: 'loaituongtac'
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
      label: "Tổng số tương tác",
      dataSource: parsedData,
      columns: previewColumns,
      errorItems,
      onCancel: resetState,
      onImport: handleImport,
      importLoading,
      hasErrors: errorItems.length > 0,
      scrollX: 1080, // Giá trị cuộn ngang
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
          <UploadOutlined /> Nhập danh sách tương tác từ Excel
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
                  <li>Điền thông tin tương tác vào file (mỗi dòng là một tương tác).</li>
                  <li>Tải lên file Excel đã điền thông tin.</li>
                  <li>Kiểm tra dữ liệu xem trước và sửa các lỗi nếu có.</li>
                  <li>Nhấn "Nhập dữ liệu" để hoàn tất.</li>
                  <li>Các trường bắt buộc: Loại tương tác, Người cập nhật.</li>
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

export default LoaiTuongTac_Import;