import React, { useState, useEffect } from 'react';
import { Upload, Button, message, Table, Modal, Alert, Divider, Spin } from 'antd';
import { InboxOutlined, UploadOutlined } from '@ant-design/icons';
import { fetchPreviewData, renderMaHang, renderSoLuongBaoGia } from './BaoGiaSo_ImportRender';
import * as XLSX from 'xlsx';
import '../../../../../utils/css/Custom-Import.css';

const { Dragger } = Upload;

const BaoGiaSo_Import = ({ open, onClose, onImport, priceList, existingHangHoa = [] }) => {
  const [existingStockIn, setExistingStockIn] = useState([]);
  const [existingStockOut, setExistingStockOut] = useState([]);
  const [products, setProducts] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [parsedData, setParsedData] = useState([]);
  const [errorItems, setErrorItems] = useState([]);
  const [importLoading, setImportLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (open) {
      fetchPreviewData(setProducts, setExistingStockIn ,setExistingStockOut);
      resetState();
    }
    // eslint-disable-next-line
  }, [open]);

  const getCurrentStock = (maHang) => {
    if (!maHang) return 0;
    // Tổng nhập
    const stockIn = existingStockIn.filter(item => item.ma_hang === maHang)
      .reduce((sum, item) => sum + Number(item.so_luong_nhap || 0), 0);
    // Tổng xuất
    const stockOut = existingStockOut.filter(item => item.ma_hang === maHang)
      .reduce((sum, item) => sum + Number(item.so_luong_xuat || 0), 0);
    return stockIn - stockOut;
  };

  // Parse file excel
  const handleParseExcel = async (file) => {
    setImportLoading(true);
    setErrorItems([]);
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      const header = rows[0] || [];
      const maHangIdx = header.findIndex(h => h?.toString().toLowerCase().includes('mã hàng'));
      const soLuongIdx = header.findIndex(h => h?.toString().toLowerCase().includes('số lượng'));
      if (maHangIdx === -1 || soLuongIdx === -1) {
        setErrorItems([{ row: 0, error: 'File excel phải có cột "Mã hàng" và "Số lượng"' }]);
        setImportLoading(false);
        return;
      }
      const dataRows = [];
      const errors = [];
      const cumulative = {}; // cộng dồn số lượng theo mã hàng
      for (let i = 1; i < rows.length; ++i) {
        const row = rows[i];
        const ma_hang = row[maHangIdx]?.toString().trim();
        const so_luong = Number(row[soLuongIdx]);
        const prod = products.find(
          (p) => p.ma_hang === ma_hang && p.price_list === priceList
        );
        const tonKho = getCurrentStock(ma_hang);

        let invalidMaHang = false;
        let invalidSoLuongBaoGia = false;
        let error = '';
        if (!ma_hang) {
          invalidMaHang = true;
          error = 'Thiếu mã hàng';
        } else if (!prod) {
          invalidMaHang = true;
          error = 'Mã hàng không tồn tại trong price list';
        } else if (!so_luong || so_luong <= 0) {
          invalidSoLuongBaoGia = true;
          error = 'Số lượng không hợp lệ';
        } else if (existingHangHoa.some(h => h.ma_hang === ma_hang)) {
          invalidMaHang = true;
          error = 'Mã hàng đã có trong bảng';
        } else {
          cumulative[ma_hang] = (cumulative[ma_hang] || 0) + so_luong;
          // Không kiểm tra vượt tồn kho nữa
        }
        // } else {
        //   // Kiểm tra cộng dồn số lượng import
        //   cumulative[ma_hang] = (cumulative[ma_hang] || 0) + so_luong;
        //   if (cumulative[ma_hang] > tonKho) {
        //     invalidSoLuongBaoGia = true;
        //     error = `Tổng số lượng vượt tồn kho (${tonKho})`;
        //   }

        dataRows.push({
          key: i,
          ma_hang,
          so_luong,
          invalidMaHang,
          invalidSoLuongBaoGia,
          tonKhoHienCo: tonKho,
        });

        if (invalidMaHang || invalidSoLuongBaoGia) {
          errors.push({ row: i, error });
        }
      }
      setParsedData(dataRows);
      setErrorItems(errors);
      setShowPreview(true);
    } catch (err) {
      setErrorItems([{ row: 0, error: 'Lỗi đọc file excel!' }]);
      setShowPreview(true);
    }
    setImportLoading(false);
  };

  // Xử lý import vào bảng
  const handleImport = () => {
    if (errorItems.length > 0) {
      message.error('Vui lòng sửa lỗi trước khi import!');
      return;
    }
    const validRows = parsedData.filter(r => !r.invalidMaHang && !r.invalidSoLuongBaoGia);
    if (validRows.length === 0) {
      message.warning('Không có dòng hợp lệ để import!');
      return;
    }
    onImport(validRows.map(r => ({
      ma_hang: r.ma_hang,
      so_luong: r.so_luong,
    })));
    handleClose();
  };

  // Reset state
  const resetState = () => {
    setFileList([]);
    setParsedData([]);
    setErrorItems([]);
    setShowPreview(false);
  };

  // Đóng modal
  const handleClose = () => {
    resetState();
    onClose();
  };

  // Cột preview
  const columns = [
    {
      title: 'STT',
      dataIndex: 'key',
      width: 60,
      render: (text, record, idx) => idx + 1,
    },
    {
      title: 'Mã hàng',
      dataIndex: 'ma_hang',
      width: 180,
      render: (maHang, record) => renderMaHang(maHang, record, products, errorItems),
    },
    {
      title: 'Số lượng',
      dataIndex: 'so_luong',
      width: 120,
      render: (soLuong, record) => renderSoLuongBaoGia(soLuong, record, errorItems),
    },
  ];

  // Render uploader
  const renderUploader = () => (
    <Dragger
      name="file"
      multiple={false}
      fileList={fileList}
      beforeUpload={file => {
        setFileList([file]);
        handleParseExcel(file);
        return false;
      }}
      onRemove={() => resetState()}
      accept=".xlsx,.xls"
    >
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">Kéo thả file hoặc Click để chọn file Excel (2 cột: Mã hàng, Số lượng)</p>
      <p className="ant-upload-hint">
        Chỉ hỗ trợ file Excel (.xlsx, .xls)
      </p>
    </Dragger>
  );

  // Render lỗi import
  // ...trong hàm renderErrorList...
  const renderErrorList = () => (
    errorItems.length > 0 && (
      <div className="error-list" style={{
        background: '#fff1f0',
        border: '1px solid #ff4d4f',
        borderRadius: 4,
        padding: 12,
        marginBottom: 16,
        maxHeight: 140,
        overflowY: 'auto'
      }}>
        <b style={{ color: '#cf1322' }}>Lỗi import:</b>
        <ul className="error-items" style={{ paddingLeft: 24, margin: 0 }}>
          {errorItems.map((err, idx) => (
            <li key={idx} style={{ color: '#cf1322' }}>
              {`Dòng ${err.row}: ${err.error}`}
            </li>
          ))}
        </ul>
      </div>
    )
  );

  // Render preview
  const renderPreviewSection = () => (
    <div className="preview-section">
      {renderErrorList()}
      <div className="preview-table" style={{ maxHeight: 260, overflowY: 'auto', marginBottom: 8 }}>
        <Table
          columns={columns}
          dataSource={parsedData}
          rowKey="key"
          size="small"
          pagination={false}
          bordered
          scroll={{ x: 400 }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
        <div>
          <b>Tổng số liệu mã hàng báo giá: </b>
          <span style={{ color: '#1890ff', fontWeight: 600 }}>{parsedData.length}</span>
        </div>
        <div>
          <Button onClick={handleClose} style={{ marginRight: 8 }}>
            Hủy
          </Button>
          <Button
            type="primary"
            onClick={handleImport}
            disabled={importLoading || parsedData.length === 0 || errorItems.length > 0}
          >
            Import vào bảng
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <Modal
      className="import-modal"
      title={
        <div className="import-modal-title">
          <UploadOutlined /> Import mã hàng báo giá từ Excel
        </div>
      }
      open={open}
      onCancel={handleClose}
      footer={null}
      width={600}
      destroyOnClose
    >
      <Spin spinning={importLoading} tip="Đang xử lý file...">
        <div className="import-container">
          {!showPreview && (
            <Alert
              message="Hướng dẫn import"
              description={
                <ol>
                  <li>Tải file mẫu hoặc sử dụng file có 2 cột: Mã hàng, Số lượng.</li>
                  <li>Điền thông tin mã hàng và số lượng vào file Excel.</li>
                  <li>Tải lên file Excel đã điền thông tin.</li>
                  <li>Kiểm tra dữ liệu xem trước và sửa các lỗi nếu có.</li>
                  <li>Nhấn "Import vào bảng" để hoàn tất.</li>
                  <li>Lưu ý: Chỉ kiểm tra tồn tại mã hàng theo price list và số lượng không vượt tồn kho.</li>
                </ol>
              }
              type="info"
              showIcon
            />
          )}
          <div className="import-content" style={{ marginTop: 16 }}>
            {!showPreview ? (
              <>
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

export default BaoGiaSo_Import;