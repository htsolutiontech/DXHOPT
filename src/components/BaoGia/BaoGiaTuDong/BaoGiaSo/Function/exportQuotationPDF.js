import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import getImageBase64 from '../../../../utils/quotation/getImageBase64';
import numberToVietnameseWords from '../../../../utils/quotation/numberToVietnameseWords';
import { getUnitName } from '../../../../utils/convert/unitCodes';
import { getCountryName } from '../../../../utils/convert/countryCodes';
import { getProductDescription } from '../../../../utils/convert/productDescriptionsExcel';

pdfMake.vfs = pdfFonts.vfs;

export const exportQuotationPDF = async (thongTin, hangHoa, DEFAULT_DIEU_KIEN) => {
  const hangHoaWithImages = await Promise.all(
    hangHoa.map(async row => {
      const imgBase64 = await getImageBase64(row.ma_hang);
      return { ...row, _imgBase64: imgBase64 };
    })
  );
  const getMoTa = async (ma_hang, mo_ta) => {
    const moTaVIE = await getProductDescription(ma_hang);
    return moTaVIE || mo_ta || '';
  };
  const now = new Date();
  const ngay = thongTin.ngay_bao_gia
    ? new Date(thongTin.ngay_bao_gia)
    : now;
  const dateStr = `Tp. Hồ Chí Minh, ngày ${ngay.getDate().toString().padStart(2, '0')} tháng ${(ngay.getMonth() + 1)
    .toString()
    .padStart(2, '0')} năm ${ngay.getFullYear()}`;

  // Chuẩn bị dữ liệu bảng hàng hóa
  const tableBody = [
    [
      { text: 'STT', style: 'tableHeader', alignment: 'center', valign: 'middle' },
      { text: 'Mô tả', style: 'tableHeader', alignment: 'center', valign: 'middle' },
      { text: 'Mã số', style: 'tableHeader', alignment: 'center', valign: 'middle' },
      { text: 'SL', style: 'tableHeader', alignment: 'center', valign: 'middle' },
      { text: 'ĐVT', style: 'tableHeader', alignment: 'center', valign: 'middle' },
      { text: 'Hãng chủ sở hữu', style: 'tableHeader', alignment: 'center', valign: 'middle' },
      { text: 'Xuất xứ', style: 'tableHeader', alignment: 'center', valign: 'middle' },
      { text: 'Đơn giá (VNĐ)', style: 'tableHeader', alignment: 'center', valign: 'middle' },
      { text: 'Thành tiền (VNĐ)', style: 'tableHeader', alignment: 'center', valign: 'middle' },
      { text: 'Thuế GTGT (VNĐ)', style: 'tableHeader', alignment: 'center', valign: 'middle' },
      { text: 'Tổng cộng (VNĐ)', style: 'tableHeader', alignment: 'center', valign: 'middle' },
      { text: 'Hình ảnh', style: 'tableHeader', alignment: 'center', valign: 'middle' }
    ],
    ...(await Promise.all(hangHoaWithImages.map(async (row, idx) => [
      { text: idx + 1, alignment: 'center', valign: 'middle', fontSize: 8 },
      { text: await getMoTa(row?.ma_hang, row?.mo_ta), alignment: 'left', valign: 'middle', fontSize: 8 },
      { text: row?.ma_hang ?? '', alignment: 'center', valign: 'middle', fontSize: 8 },
      { text: row?.so_luong ?? '', alignment: 'center', valign: 'middle', fontSize: 8 },
      { text: getUnitName(row?.don_vi_ban_hang), alignment: 'center', valign: 'middle', fontSize: 8 },
      { text: row?.hang_chu_so_huu ?? '', alignment: 'center', valign: 'middle', fontSize: 8 },
      { text: getCountryName(row?.nuoc_xuat_xu), alignment: 'center', valign: 'middle', fontSize: 8 },
      { text: row?.don_gia !== undefined ? row.don_gia.toLocaleString() : '', alignment: 'right', valign: 'middle', fontSize: 8 },
      { text: row?.thanh_tien !== undefined ? row.thanh_tien.toLocaleString() : '', alignment: 'right', valign: 'middle', fontSize: 8 },
      { text: row?.thue_gtgt !== undefined ? row.thue_gtgt.toLocaleString() : '', alignment: 'right', valign: 'middle', fontSize: 8 },
      { text: row?.tong_cong !== undefined ? row.tong_cong.toLocaleString() : '', alignment: 'right', valign: 'middle', fontSize: 8 },
      row?._imgBase64
        ? { image: row._imgBase64, width: 80, alignment: 'center', valign: 'middle' }
        : { text: '', alignment: 'center', valign: 'middle' }
    ])))
  ];

  // Đọc logo thành base64
  const getLogoBase64 = (url) =>
    fetch(url)
      .then(res => res.blob())
      .then(blob => new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      }));

  const logoUrl = `${window.location.origin}/image/logo.png`;
  const logoBase64 = await getLogoBase64(logoUrl);

  const dieuKien = thongTin.dieu_kien_thuong_mai && thongTin.dieu_kien_thuong_mai.trim()
    ? thongTin.dieu_kien_thuong_mai
    : DEFAULT_DIEU_KIEN;

  // Định nghĩa file PDF
  const docDefinition = {
    pageOrientation: 'landscape',
    content: [
      {
        columns: [
          {
            image: 'logo',
            width: 180,
            height: 65,
            margin: [0, 0, 0, 0]
          },
          {
            width: '*',
            stack: [
              {
                text: [
                  'CÔNG TY TNHH DỊCH VỤ VÀ THƯƠNG MẠI ',
                  { text: 'HOÀNG PHÚC THANH', color: '#22519E', bold: true },
                ],
                bold: true,
                fontSize: 16,
                alignment: 'center',
                margin: [0, 0, 0, 0]
              },
              { text: 'Địa Chỉ: Tầng 3, 607 Xô Viết Nghệ Tĩnh, Phường 26, Quận Bình Thạnh, TP. Hồ Chí Minh', bold: true, fontSize: 13, alignment: 'center', margin: [0, 2, 0, 0] },
              { text: 'Điện Thoại: (028)3785 3388 | Email: info@hoangphucthanh.vn | Website: www.hoangphucthanh.vn', bold: true, fontSize: 12, alignment: 'center', margin: [0, 5, 0, 0] }
            ],
            margin: [0, 0, 0, 0]
          }
        ],
        columnGap: 10,
        margin: [0, 0, 0, 20]
      },
      {
        columns: [
          { 
            text: [
              'Số: ',
              { text: thongTin.so_bao_gia || '', color: 'red'}
            ],
            fontSize: 12, alignment: 'left', margin: [0, 8, 0, 0]
          },
          { text: dateStr, italics: true, fontSize: 12, alignment: 'right', margin: [0, 8, 0, 0] }
        ]
      },
      { text: 'BẢNG BÁO GIÁ', bold: true, fontSize: 20, style: 'header', alignment: 'center', margin: [0, 16, 0, 0] },
      { text: thongTin.tieu_de || '', bold: true, fontSize: 13, style: 'subheader', alignment: 'center', margin: [0, 6, 0, 0] },
      { text: `(Hãng chủ sở hữu: ${thongTin.hang_chu_so_huu || ''})`, bold: true, fontSize: 13, alignment: 'center', margin: [0, 6, 0, 0] },
      { text: `Kính gửi: ${thongTin.kinh_gui || ''}`, color: 'red', italics: true, alignment: 'center', margin: [0, 10, 0, 0], bold: true },
      { text: thongTin.noi_dung_bao_gia ||
        'Công ty TNHH DV và TM Hoàng Phúc Thanh (HOPT) chân thành cảm ơn sự quan tâm của Quý Khách hàng đối với trang thiết bị y tế của chúng tôi. Chúng tôi xin gửi đến Quý Khách hàng bảng báo giá thiết bị và dụng cụ nội soi với chi tiết như sau:',
        fontSize: 11, margin: [0, 10, 0, 5], alignment: 'left'
      },
      {
        table: {
          widths: [20, 125, 45, 20, 20, 40, 40, 55, 62, 62, 62, 100],
          body: tableBody
        },
        layout: {
          fillColor: function (rowIndex) {
            return rowIndex === 0 ? '#04C3D2' : null;
          }
        },
        fontSize: 8,
        alignment: 'center',
        margin: [0, 10, 0, 10]
      },
      {
        columns: [
          {
            width: '*',
            text: ''
          },
          {
            width: 200,
            stack: [
              { text: 'Tổng Tiền:', alignment: 'right', bold: true, fontSize: 10, margin: [0, 0, 0, 2] },
              { text: 'VAT:', alignment: 'right', bold: true, fontSize: 10, margin: [0, 0, 0, 2] },
              { text: 'Tổng Cộng:', alignment: 'right', bold: true, fontSize: 10, color: 'red', margin: [0, 0, 0, 2] }
            ],
            margin: [0, 0, 0, 0]
          },
          {
            width: 210,
            stack: [
              { text: hangHoa.reduce((sum, h) => sum + (h.thanh_tien || 0), 0).toLocaleString(), alignment: 'right', bold: true, fontSize: 10, margin: [0, 0, 0, 2] },
              { text: hangHoa.reduce((sum, h) => sum + (h.thue_gtgt || 0), 0).toLocaleString(), alignment: 'right', bold: true, fontSize: 10, margin: [0, 0, 0, 2] },
              { text: hangHoa.reduce((sum, h) => sum + (h.tong_cong || 0), 0).toLocaleString(), alignment: 'right', bold: true, fontSize: 10, color: 'red', margin: [0, 0, 0, 2] }
            ],
            margin: [0, 0, 110, 0]
          }
        ],
        columnGap: 0,
        margin: [0, 8, 0, 4]
      },
      {
        columns: [
          { width: '*', text: '' },
          {
            width: 800,
            text: `(Bằng chữ: ${numberToVietnameseWords(hangHoa.reduce((sum, h) => sum + (h.tong_cong || 0), 0))})`,
            color: 'red',
            fontSize: 10,
            bold: true,
            italics: true,
            alignment: 'right',
            margin: [0, 0, 145, 8]
          }
        ]
      },
      { text: 'ĐIỀU KIỆN THƯƠNG MẠI:', bold: true, margin: [0, 10, 0, 0] },
      {
        stack: dieuKien.split('\n').map(line => {
          if (line.trim().startsWith('+')) {
            return { text: line, margin: [15, 0, 0, 3], fontSize: 10 };
          }
          if (line.trim().startsWith('*')) {
            return { text: line, margin: [45, 0, 0, 3], fontSize: 10 };
          }
          if (line.trim().startsWith('-')) {
            return { text: line, margin: [0, 0, 0, 3], fontSize: 10 };
          }
          return { text: line, margin: [30, 0, 0, 3], fontSize: 10 };
        }),
        margin: [0, 5, 0, 0]
      },
      {  
        text: [
          '\nRất mong nhận được sự hồi đáp từ Quý khách.\n\n',
          'Trân trọng kính chào!\n\n'
        ],
        fontSize: 10,
        alignment: 'left',
        margin: [0, 4, 0, 0]
      },
      {
        text: 'ĐẠI DIỆN CÔNG TY',
        fontSize: 12,
        bold: true,
        alignment: 'right',
        margin: [0, 0, 40, 0]
      },
    ],
    images: {
      logo: logoBase64
    },
    defaultStyle: {
      font: 'Roboto'
    },
    styles: {
      header: { fontSize: 18, bold: true },
      subheader: { fontSize: 13, bold: true },
      tableHeader: {
        fillColor: '#04C3D2',
        bold: true,
        alignment: 'center',
        valign: 'middle',
        fontSize: 9
      }
    }
  };

  pdfMake.createPdf(docDefinition).download(`${thongTin.ten_file_bao_gia || 'bao_gia'}.pdf`);
};