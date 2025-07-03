import * as XLSX from 'xlsx';

let descriptionMap = {};

export const loadProductDescriptions = async () => {
  if (Object.keys(descriptionMap).length > 0) return descriptionMap;

  const response = await fetch('/description.xlsx');
  const arrayBuffer = await response.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  // Dòng đầu là tiêu đề: [Mã số, Mô tả, Mô tả ngắn VIE]
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row[0]) {
      // Ưu tiên cột B, nếu rỗng thì lấy cột C
      const moTa = row[1] || row[2] || '';
      descriptionMap[row[0].toString().trim().toLowerCase()] = moTa;
    }
  }
  return descriptionMap;
};

export const getProductDescription = async (maHang) => {
  await loadProductDescriptions();
  return descriptionMap[(maHang || '').toLowerCase()] || '';
};