import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, Button, message, Modal } from 'antd';
import { fetchDataList } from '../../../../utils/api/requestHelpers';
import { DownloadOutlined } from '@ant-design/icons';
import BaoGiaThongTinForm from './BaoGiaThongTinForm';
import BaoGiaHangHoaTable from './BaoGiaHangHoaTable';
import { exportQuotationWord } from './Function/exportQuotationWord';
import { exportQuotationPDF } from './Function/exportQuotationPDF';
import { handleCreateQuotation } from './Function/BaoGiaSo_Add_BG';
import { handleCreateQuotationDetails } from './Function/BaoGiaSo_Add_CTBG';
import { calcDonGia } from './HangHoa/hangHoaHelpers';

const BaoGiaSo = () => {
  const { so_bao_gia } = useParams();
  const isEdit = !!so_bao_gia;
  const [thongTin, setThongTin] = useState({});
  const [hangHoa, setHangHoa] = useState([]);
  const [heSo, setHeSo] = useState(1);
  const [activeTab, setActiveTab] = useState('1');

  // Thêm đoạn này ngay sau khai báo useState
  useEffect(() => {
    // Khi thongTin.he_so thay đổi, cập nhật lại state heSo
    if (thongTin && thongTin.he_so) {
      setHeSo(Number(thongTin.he_so));
    }
  }, [thongTin.he_so]);

  useEffect(() => {
    if (so_bao_gia) {
      const fetchData = async () => {
        // Lấy thông tin báo giá
        const quotations = await fetchDataList('https://dx.hoangphucthanh.vn:3000/crm/quotations');
        const q = quotations.find(q => q.so_bao_gia === so_bao_gia);

        // Lấy danh mục loại báo giá và trạng thái báo giá
        const quotationTypes = await fetchDataList('https://dx.hoangphucthanh.vn:3000/crm/quotation-types');
        const quotationStatuses = await fetchDataList('https://dx.hoangphucthanh.vn:3000/crm/quotation-statuses');

        if (q) {
          setThongTin({
            so_bao_gia: q.so_bao_gia,
            ngay_bao_gia: q.ngay_bao_gia,
            hang_chu_so_huu: q.hang_chu_so_huu,
            price_list: q.price_list,
            tieu_de: q.tieu_de,
            doi_tuong_bao_gia: q.doi_tuong, // map đúng field
            he_so: q.he_so,
            sdt: q.so_dien_thoai,
            kinh_gui: q.ten_khach_hang,
            ten_file_bao_gia: q.ten_file_bao_gia,
            noi_dung_bao_gia: q.noi_dung,
            dieu_kien_thuong_mai: q.dieu_kien_thuong_mai,
            ghi_chu: q.ghi_chu,
            nguoi_lien_he: q.nguoi_lien_he,
            loai_bao_gia: quotationTypes.find(t => t.ma_loai_bao_gia === q.loai_bao_gia)?.loai_bao_gia || q.loai_bao_gia,
            tinh_trang: quotationStatuses.find(s => s.ma_trang_thai_bao_gia === q.tinh_trang)?.trang_thai_bao_gia || q.tinh_trang,
          });
        }

        // Lấy danh sách sản phẩm để lấy giá gốc
        const products = await fetchDataList('https://dx.hoangphucthanh.vn:3000/warehouse/products');

        // Lấy chi tiết hàng hóa
        const details = await fetchDataList('https://dx.hoangphucthanh.vn:3000/crm/quotation-details');
        const chiTiet = details
          .filter(d => d.so_bao_gia === so_bao_gia)
          .map(d => {
            // Lấy giá gốc từ bảng sản phẩm
            const prod = products.find(
              p => p.ma_hang === d.ma_hang && p.price_list === q.price_list
            );
            const gia_thuc = prod?.gia_thuc || 0;

            const ty_le_thue_gtgt = Number(d.ty_le_thue_gtgt) || 0.05;
            const ty_le_thue_nk = Number(d.ty_le_thue_nhap_khau) || 0;
            const chiet_khau = Number(d.chiet_khau) || 0;
            const so_luong = Number(d.so_luong) || 1;

            // Tính lại đơn giá, thành tiền, thuế, tổng cộng
            const don_gia = calcDonGia(gia_thuc, q.he_so, ty_le_thue_nk, ty_le_thue_gtgt, chiet_khau);
            const thanh_tien = don_gia * so_luong;
            const thue_gtgt = thanh_tien * ty_le_thue_gtgt;
            const tong_cong = thanh_tien + thue_gtgt;

            return {
              mo_ta: d.mo_ta,
              ma_hang: d.ma_hang,
              don_vi_ban_hang: d.don_vi_tinh,
              hang_chu_so_huu: d.hang_chu_so_huu,
              nuoc_xuat_xu: d.xuat_xu,
              gia_thuc,
              so_luong,
              don_gia,
              thanh_tien,
              thue_gtgt,
              tong_cong,
              ty_le_thue_gtgt,
              ty_le_thue_nk,
              chiet_khau,
              ghi_chu: d.ghi_chu,
            };
          });
        setHangHoa(chiTiet);
      };
      fetchData();
    }
  }, [so_bao_gia]);

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
          <BaoGiaThongTinForm onChange={handleThongTinChange} initialValues={thongTin} isEdit={isEdit}/>
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