import React, { useState } from 'react';
import { Tabs, Button, message, Modal } from 'antd';
import BaoGiaThongTinForm from './BaoGiaThongTinForm';
import BaoGiaHangHoaTable from './BaoGiaHangHoaTable';
import { DownloadOutlined } from '@ant-design/icons';
import { exportQuotationWord } from './Function/exportQuotationWord';
import { exportQuotationPDF } from './Function/exportQuotationPDF';
import { handleCreateQuotation } from './Function/BaoGiaSo_Add_BG';
import { handleCreateQuotationDetails } from './Function/BaoGiaSo_Add_CTBG';

const BaoGiaSo = () => {
  const [thongTin, setThongTin] = useState({});
  const [hangHoa, setHangHoa] = useState([]);
  const [heSo, setHeSo] = useState(1);
  const [activeTab, setActiveTab] = useState('1');

  // Các trường bắt buộc
  const requiredFields = [
    'so_bao_gia',
    'ngay_bao_gia',
    'hang_chu_so_huu',
    'price_list',
    'tieu_de',
    'doi_tuong_bao_gia',
    'he_so',
    'kinh_gui',
    'ten_file_bao_gia'
  ];

  // Lưu hệ số khi chọn ở Thông tin
  const handleThongTinChange = (values) => {
    setThongTin(values);
    setHeSo(Number(values.he_so) || 1);
  };

  // Lưu danh sách hàng hóa
  const handleHangHoaChange = (list) => setHangHoa(list);

  const DEFAULT_DIEU_KIEN = `- Giá trên đã bao gồm thuế GTGT, phí vận chuyển và các phí khác (nếu có).
  - Trong trường hợp chính sách thuế thay đổi, khoản thuế GTGT sẽ được điều chỉnh tương ứng.
  - Thời gian giao hàng: trong vòng 01 - 04 tuần sau khi nhận được thanh toán.
  - Bảo hành: 12 tháng đối với các máy chính và ống soi thuộc các lỗi kỹ thuật của nhà sản xuất kể từ ngày ký biên bản bàn giao nghiệm thu.
  - Phương thức thanh toán:
  + Đối với hàng có sẵn ở kho
  Thanh toán 100% giá trị hợp đồng trong vòng 30 ngày kể từ ngày giao hàng và xuất hóa đơn
  + Đối với hàng không có sẵn ở kho
  Tùy chọn 1: Thanh toán 2 đợt
  * Đợt 1: Thanh toán 70% - 80% giá trị hợp đồng trong vòng 07 ngày kể từ ngày ký hợp đồng.
  * Đợt 2: Thanh toán 20% - 30% giá trị hợp đồng trong vòng 30 ngày kể từ ngày giao hàng và xuất hóa đơn.
  Tùy chọn 2: Thanh toán 3 đợt
  * Đợt 1: Tạm ứng 30% - 40% giá trị hợp đồng trong vòng 07 ngày kể từ ngày ký hợp đồng
  * Đợt 2: Thanh toán 40% - 50% giá trị hợp đồng trong vòng 07 ngày khi nhận thông báo giao hàng
  * Đợt 3: Thanh toán 20% - 30% giá trị hợp đồng còn lại trong vòng 30 ngày kể từ ngày nghiệm thu và xuất hóa đơn
  - Giá trị bảng báo giá: 03 tháng kể từ ngày ký báo giá.`;

  // Gọi hàm export đã tách
  const handleExportWord = () => {
    exportQuotationWord(thongTin, hangHoa, DEFAULT_DIEU_KIEN);
  };

  // Gọi hàm tạo báo giá và chi tiết báo giá trước khi xuất PDF
  const handleExportPDF = async () => {
    try {
      await exportQuotationPDF(thongTin, hangHoa, DEFAULT_DIEU_KIEN);

      setTimeout(() => {
        Modal.confirm({
          title: 'Xác nhận lưu file PDF',
          content: 'Bạn đã lưu file PDF thành công chưa?\nNhấn OK để lưu dữ liệu vào hệ thống.',
          okText: 'OK',
          cancelText: 'Hủy',
          async onOk() {
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            await handleCreateQuotation(thongTin, hangHoa, userData);
            await handleCreateQuotationDetails(thongTin.so_bao_gia, hangHoa);
            message.success('Đã lưu dữ liệu báo giá vào hệ thống!');
          },
          onCancel() {
            message.info('Bạn đã hủy lưu dữ liệu vào hệ thống.');
          },
        });
      }, 1000);
    } catch (error) {
      message.error('Lưu báo giá thất bại: ' + error.message);
    }
  };

  return (
    <div>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <Tabs.TabPane tab="Thông tin" key="1">
          <BaoGiaThongTinForm onChange={handleThongTinChange} />
        </Tabs.TabPane>
        <Tabs.TabPane
          tab="Hàng hóa"
          key="2"
          disabled={
            !requiredFields.every(field => {
              const val = thongTin[field];
              return val !== undefined && val !== null && val !== '';
            })
          }
        >
          <BaoGiaHangHoaTable
            thongTin={thongTin}
            heSo={heSo}
            hangHoa={hangHoa}
            setHangHoa={setHangHoa}
          />
        </Tabs.TabPane>
      </Tabs>
      <div style={{ marginTop: 24, textAlign: 'right' }}>
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          onClick={handleExportPDF}
          style={{ marginRight: 6 }}
        >
          Tải PDF
        </Button>
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          onClick={handleExportWord}
        >
          Tải Word
        </Button>
      </div>
    </div>
  );
};

export default BaoGiaSo;