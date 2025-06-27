import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, Table, TableRow, TableCell, HeadingLevel, AlignmentType, WidthType } from 'docx';
import { getUnitName } from '../../../../utils/convert/unitCodes';
import { getCountryName } from '../../../../utils/convert/countryCodes';

export const exportQuotationWord = async (thongTin, hangHoa, DEFAULT_DIEU_KIEN) => {
  const tableRows = [
    new TableRow({
      children: [
        'STT', 'Mô tả', 'Mã số', 'SL', 'ĐVT', 'Hãng chủ sở hữu', 'Xuất xứ', 'Đơn giá', 'Thành tiền', 'Thuế GTGT', 'Tổng cộng'
      ].map(text => new TableCell({
        children: [new Paragraph({ text, bold: true })],
        width: { size: 10, type: WidthType.PERCENTAGE }
      }))
    }),
    ...hangHoa.map((row, idx) =>
      new TableRow({
        children: [
          idx + 1,
          row.mo_ta || '',
          row.ma_hang || '',
          row.so_luong?.toString() || '',
          getUnitName(row.don_vi_ban_hang) || '',
          row.hang_chu_so_huu || '',
          getCountryName(row.nuoc_xuat_xu) || '',
          row.don_gia?.toLocaleString() || '',
          row.thanh_tien?.toLocaleString() || '',
          row.thue_gtgt?.toLocaleString() || '',
          row.tong_cong?.toLocaleString() || ''
        ].map(text => new TableCell({
          children: [new Paragraph({ text: text?.toString() })],
          width: { size: 10, type: WidthType.PERCENTAGE }
        }))
      })
    )
  ];

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: 'BẢNG BÁO GIÁ',
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 }
          }),
          new Paragraph({
            text: thongTin.tieu_de || '',
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 }
          }),
          new Paragraph({
            text: `Kính gửi: ${thongTin.kinh_gui || ''}`,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 }
          }),
          new Paragraph({
            text: thongTin.noi_dung_bao_gia || '',
            spacing: { after: 200 }
          }),
          new Table({
            rows: tableRows,
            width: { size: 100, type: WidthType.PERCENTAGE }
          }),
          new Paragraph({
            text: `Tổng Tiền: ${hangHoa.reduce((sum, h) => sum + (h.thanh_tien || 0), 0).toLocaleString()}`,
            spacing: { before: 400 }
          }),
          new Paragraph({
            text: `Tổng Thuế GTGT: ${hangHoa.reduce((sum, h) => sum + (h.thue_gtgt || 0), 0).toLocaleString()}`
          }),
          new Paragraph({
            text: `Tổng Cộng: ${hangHoa.reduce((sum, h) => sum + (h.tong_cong || 0), 0).toLocaleString()}`,
            bold: true
          }),
          new Paragraph({
            text: 'ĐIỀU KIỆN THƯƠNG MẠI:',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400 }
          }),
          ...((thongTin.dieu_kien_thuong_mai || DEFAULT_DIEU_KIEN).split('\n').map(line =>
            new Paragraph({ text: line })
          )),
          new Paragraph({
            text: '\nTrân trọng kính chào!',
            alignment: AlignmentType.LEFT,
            spacing: { before: 400 }
          }),
          new Paragraph({
            text: 'ĐẠI DIỆN CÔNG TY',
            alignment: AlignmentType.RIGHT,
            bold: true
          })
        ]
      }
    ]
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${thongTin.ten_file_bao_gia || 'bao_gia'}.docx`);
};