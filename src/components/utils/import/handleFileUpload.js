import * as XLSX from 'xlsx';
import moment from 'moment';
import { message } from 'antd';

// Các mảng field đặc biệt gom ra ngoài để tái sử dụng
const userFields = ['nguoi_phu_trach', 'nguoi_cap_nhat', 'nguoi_lap_don', 'nguoi_tao'];
const productTypeFields = ['ten_loai_hang'];
const contractTypeFields = ['loai_hop_dong'];
const quotationTypeFields = ['loai_bao_gia'];
const sourceFields = ['nguon_tiep_can'];
const customerGroupFields = ['nhom_khach_hang'];
const interactionTypeFields = ['loai_tuong_tac'];
const quotationStatusFields = ['trang_thai_bao_gia'];
const supplierFields = ['ten_nha_cung_cap'];
const warehouseFields = ['ten_kho'];
const customerFields = ['ten_khach_hang'];
const stringFields = ['so_don_hang', 'so_xac_nhan_don_hang', 'ma_hang', 'ma_bill'];
const hawbFields = ['hawb_1', 'hawb_2', 'hawb_3', 'hawb_4', 'hawb_5'];

// Hàm sinh key lỗi cho các trường
const getInvalidKey = (apiField) =>
  'invalid' + apiField.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');

// Xử lý giá trị cho các trường đặc biệt (số)
const processSpecialField = (field, value) => {
  const numericFields = [
    'tong_no_phai_tra', 'tong_no_phai_thu', 'tong_gia_tri_don_hang',
    'trong_luong_tinh', 'gia_thuc', 'gia_tri_hop_dong', 'so_luong_nhap',
    'so_luong_xuat', 'so_luong', 'so_luong_lo_1', 'so_luong_lo_2',
    'so_luong_lo_3', 'so_luong_lo_4', 'so_luong_lo_5', 'so_luong_hang_chua_ve',
    'tong_tri_gia'
  ];
  if (numericFields.includes(field)) {
    if (value !== null && /^\d+([.,]\d+)?$/.test(value.toString().replace(/,/g, '.'))) {
      return parseFloat(value.toString().replace(/,/g, '.'));
    }
  }
  return value;
};

// Ánh xạ tên loại hàng sang mã loại hàng
const mapTenLoaiHangToMaLoaiHang = (tenLoaiHang, product_types = []) => {
  if (!Array.isArray(product_types)) return null;
  const product_type = product_types.find(pt => pt.ten_loai_hang === tenLoaiHang);
  return product_type ? product_type.ma_loai_hang : null;
};

// Ánh xạ tên nhà cung cấp sang mã nhà cung cấp
const mapTenNhaCungCapToMaNhaCungCap = (tenNhaCungCap, suppliers = []) => {
  if (!Array.isArray(suppliers)) return null;
  const supplier = suppliers.find(sup => sup.ten_nha_cung_cap === tenNhaCungCap);
  return supplier ? supplier.ma_nha_cung_cap : null;
};

// Ánh xạ tên khách hàng sang mã khách hàng
const mapTenKhachHangToMaKhachHang = (tenKhachHang, customers = []) => {
  if (!Array.isArray(customers)) return null;
  const customer = customers.find(cust => cust.ten_khach_hang === tenKhachHang);
  return customer ? customer.ma_khach_hang : null;
};

// Ánh xạ tên kho sang mã kho
const mapTenKhoToMaKho = (tenKho, warehouses = []) => {
  if (!Array.isArray(warehouses)) return null;
  const warehouse = warehouses.find(wh => wh.ten_kho === tenKho);
  return warehouse ? warehouse.ma_kho : null;
};

// Ánh xạ họ và tên thành mã người dùng
const mapHoVaTenToMaNguoiDung = (hoVaTen, accounts = []) => {
  if (!Array.isArray(accounts)) return null;
  const account = accounts.find(acc => acc.ho_va_ten === hoVaTen);
  return account ? account.ma_nguoi_dung : null;
};

// Ánh xạ tên loại hợp đồng sang mã loại hợp đồng
const mapTenLoaiHopDongToMaLoaiHopDong = (tenLoaiHopDong, contract_types = []) => {
  if (!Array.isArray(contract_types)) return null;
  const contract_type = contract_types.find(ct => ct.ten_loai_hop_dong === tenLoaiHopDong);
  return contract_type ? contract_type.ma_loai_hop_dong : null;
};

// Ánh xạ tên nguồn sang mã nguồn
const mapTenNguonToMaNguon = (Nguon, opportunity_sources = []) => {
  if (!Array.isArray(opportunity_sources)) return null;
  const opportunity_source = opportunity_sources.find(os => os.nguon === Nguon);
  return opportunity_source ? opportunity_source.ma_nguon : null;
};

// Ánh xạ nhóm khách hàng sang mã nhóm khách hàng
const mapTenNhomKhachHangToMaNhomKhachHang = (NhomKhachHang, customer_groups = []) => {
  if (!Array.isArray(customer_groups)) return null;
  const customer_group = customer_groups.find(os => os.nhom_khach_hang === NhomKhachHang);
  return customer_group ? customer_group.ma_nhom_khach_hang : null;
};

// Ánh xạ loại tương tác sang mã loại tương tác
const mapLoaiTuongTacToMaLoaiTuongTac = (LoaiTuongTac, interaction_types = []) => {
  if (!Array.isArray(interaction_types)) return null;
  const interaction_type = interaction_types.find(it => it.loai_tuong_tac === LoaiTuongTac);
  return interaction_type ? interaction_type.ma_loai_tuong_tac : null;
};

// Ánh xạ tên loại báo giá sang mã loại báo giá
const mapLoaiBaoGiaToMaLoaiBaoGia = (LoaiBaoGia, quotation_types = []) => {
  if (!Array.isArray(quotation_types)) return null;
  const quotation_type = quotation_types.find(qt => qt.loai_bao_gia === LoaiBaoGia);
  return quotation_type ? quotation_type.ma_loai_bao_gia : null;
};

// Ánh xạ tên trạng thái báo giá sang mã trạng thái báo giá
const mapTrangThaiBaoGiaToMaTrangThaiBaoGia = (TrangThaiBaoGia, quotation_statuses = []) => {
  if (!Array.isArray(quotation_statuses)) return null;
  const quotation_status = quotation_statuses.find(qs => qs.trang_thai_bao_gia === TrangThaiBaoGia);
  return quotation_status ? quotation_status.ma_trang_thai_bao_gia : null;
};

/**
 * Xử lý file Excel được tải lên và chuyển đổi dữ liệu.
 * @param {File} file - File Excel được tải lên.
 * @param {Object} options - Các tùy chọn để xử lý file.
 * @param {string} options.mode - 'hanghoa' (default) hoặc 'loaihang'
 */
export const handleFileUpload = (file, {
  columnMapping,
  setParsedData,
  validateData,
  setShowPreview,
  setFileList,
  accounts,
  products,
  product_types,
  suppliers,
  customers,
  warehouses,
  bills,
  contract_types,
  contracts,
  orders,
  opportunity_sources,
  customer_groups,
  interaction_types,
  quotation_types,
  quotation_statuses,
  defaultFields = {},
  mode = 'hanghoa'
}) => {
  const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                  file.type === 'application/vnd.ms-excel';
  if (!isExcel) {
    message.error('Chỉ hỗ trợ tải lên file Excel!');
    return false;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheet];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: null });

      if (jsonData.length < 2) {
        message.error('File không chứa dữ liệu!');
        setFileList([]);
        return;
      }

      const headers = jsonData[0];
      const rows = jsonData.slice(1).filter(row => row.some(cell => cell !== null));

      const processedData = rows.map((row, index) => {
        const item = {};
        headers.forEach((header, colIndex) => {
          const apiField = columnMapping[header];
          if (!apiField) return;
          let value = row[colIndex];

          // Ép kiểu chuỗi cho các trường cần thiết và trim khoảng trắng
          if (value !== undefined && value !== null && typeof value === 'string') {
            value = value.trim();
          }

          if (stringFields.includes(apiField) && value !== undefined && value !== null) {
            value = value.toString().trim();
          }

          value = processSpecialField(apiField, value);

          // Gom gọn xử lý các trường HAWB
          if (hawbFields.includes(apiField) && mode === 'chitietdonhang') {
            if (value === undefined || value === null || value.toString().trim() === '') {
              item[apiField] = null;
            } else {
              item[apiField] = value;
              const exists = bills && bills.some(b => b.ma_bill === value);
              // Sinh key lỗi: invalidHawb1, invalidHawb2, ...
              const invalidKey = 'invalid' + apiField.charAt(0).toUpperCase() + apiField.slice(1).replace('_', '');
              if (!exists) item[invalidKey] = true;
            }
            return;
          }

          // Xử lý từng loại trường theo mode
          if (userFields.includes(apiField)) {
            const maNguoiDung = mapHoVaTenToMaNguoiDung(value, accounts);
            item[apiField] = maNguoiDung || null;
            if (!maNguoiDung && value) item[getInvalidKey(apiField)] = true;
          } // Xử lý các trường loại hàng
          else if (productTypeFields.includes(apiField)) {
            if (mode === 'hanghoa') {
              const maLoaiHang = mapTenLoaiHangToMaLoaiHang(value, product_types);
              item[apiField] = maLoaiHang || null;
              if (!maLoaiHang && value) item[getInvalidKey(apiField)] = true;
            } else if (mode === 'loaihang') {
              item[apiField] = value;
            }
          }
          else if (apiField === 'ma_hang') {
            item[apiField] = value;
            if ((mode === 'nhapkho' || mode === 'xuatkho' || mode === 'chitietdonhang')) {
              const exists = products && products.some(p => p.ma_hang === value);
              if (!exists && value) item.invalidMaHang = true;
            }
          }
          else if (apiField === 'ma_bill') {
            item[apiField] = value;
            if ((mode === 'nhapkho')) {
              const exists = bills && bills.some(b => b.ma_bill === value);
              if (!exists && value) item.invalidMaBill = true;
            }
          }
          else if (apiField === 'ma_hop_dong') {
            item[apiField] = value;
            if ((mode === 'nhapkho' || mode === 'chitietdonhang')) {
              const exists = contracts && contracts.some(c => c.so_hop_dong === value);
              if (!exists && value) item.invalidMaHopDong = true;
            }
          }
          else if (apiField === 'so_xac_nhan_don_hang') {
            item[apiField] = value;
            if ((mode === 'chitietdonhang')) {
              const exists = orders && orders.some(o => o.so_don_hang === value);
              if (!exists && value) item.invalidSoXacNhanDonHang = true;
            }
          } // Xử lý các trường nhà cung cấp
          else if (supplierFields.includes(apiField)) {
            if (mode === 'hanghoa' || mode === 'nhapkho') {
              const maNhaCungCap = mapTenNhaCungCapToMaNhaCungCap(value, suppliers);
              item[apiField] = maNhaCungCap || null;
              if (!maNhaCungCap && value) item[getInvalidKey(apiField)] = true;
            } else if (mode === 'nhacungcap') {
              item[apiField] = value;
            }
          } // Xử lý các trường khách hàng
          else if (customerFields.includes(apiField)) {
            if (mode === 'xuatkho' || mode === 'chitietdonhang') {
              const maKhachHang = mapTenKhachHangToMaKhachHang(value, customers);
              item[apiField] = maKhachHang || null;
              if (!maKhachHang && value) item[getInvalidKey(apiField)] = true;
            } else if (mode === 'khachhang') {
              item[apiField] = value;
            }
          } // Xử lý các trường loại hợp đồng
          else if (contractTypeFields.includes(apiField)) {
            if (mode === 'hopdong') {
              const maLoaiHopDong = mapTenLoaiHopDongToMaLoaiHopDong(value, contract_types);
              item[apiField] = maLoaiHopDong || null;
              if (!maLoaiHopDong && value) item[getInvalidKey(apiField)] = true;
            } else if (mode === 'loaihopdong') {
              item[apiField] = value;
            }
          } // Xử lý các trường nguồn cơ hội
          else if (sourceFields.includes(apiField)) {
            if (mode === 'khachhangtiemnang') {
              const maNguon = mapTenNguonToMaNguon(value, opportunity_sources);
              item[apiField] = maNguon || null;
              if (!maNguon && value) item[getInvalidKey(apiField)] = true;
            } else if (mode === 'nguoncohoi') {
              item[apiField] = value;
            }
          } // Xử lý các trường nhóm khách hàng
          else if (customerGroupFields.includes(apiField)) {
            if (mode === 'khachhangtiemnang') {
              const maNhomKhachHang = mapTenNhomKhachHangToMaNhomKhachHang(value, customer_groups);
              item[apiField] = maNhomKhachHang || null;
              if (!maNhomKhachHang && value) item[getInvalidKey(apiField)] = true;
            } else if (mode === 'nhomkhachhang') {
              item[apiField] = value;
            }
          } // Xử lý các trường nhóm khách hàng
          else if (interactionTypeFields.includes(apiField)) {
            if (mode === 'tuongtackhachhang') {
              const maLoaiTuongTac = mapLoaiTuongTacToMaLoaiTuongTac(value, interaction_types);
              item[apiField] = maLoaiTuongTac || null;
              if (!maLoaiTuongTac && value) item[getInvalidKey(apiField)] = true;
            } else if (mode === 'loaituongtac') {
              item[apiField] = value;
            }
          } // Xử lý các trường loại báo giá
          else if (quotationTypeFields.includes(apiField)) {
            if (mode === 'baogia') {
              const maLoaiBaoGia = mapLoaiBaoGiaToMaLoaiBaoGia(value, quotation_types);
              item[apiField] = maLoaiBaoGia || null;
              if (!maLoaiBaoGia && value) item[getInvalidKey(apiField)] = true;
            } else if (mode === 'loaibaogia') {
              item[apiField] = value;
            }
          } // Xử lý các trường trạng thái báo giá
          else if (quotationStatusFields.includes(apiField)) {
            if (mode === 'baogia') {
              const maTrangThaiBaoGia = mapTrangThaiBaoGiaToMaTrangThaiBaoGia(value, quotation_statuses);
              item[apiField] = maTrangThaiBaoGia || null;
              if (!maTrangThaiBaoGia && value) item[getInvalidKey(apiField)] = true;
            } else if (mode === 'trangthaibaogia') {
              item[apiField] = value;
            }
          } // Xử lý các trường kho
          else if (warehouseFields.includes(apiField)) {
            if (mode === 'nhapkho' || mode === 'xuatkho') {
              const maKho = mapTenKhoToMaKho(value, warehouses);
              item[apiField] = maKho || null;
              if (!maKho && value) item[getInvalidKey(apiField)] = true;
            } else if (mode === 'kho') {
              item[apiField] = value;
            }
          }
          else {
            item[apiField] = value;
          }
        });

        // Sau khi ánh xạ xong, chỉ tự động lấy nhà cung cấp từ mã hàng nếu mode là 'nhapkho'
        if (mode === 'nhapkho') {
          const maHang = item['ma_hang'];
          const product = products && products.find(p => p.ma_hang === maHang);
          if (product && product.suppliers && product.suppliers.ma_nha_cung_cap) {
            item['ten_nha_cung_cap'] = product.suppliers.ma_nha_cung_cap;
          } else if (product && product.ma_nha_cung_cap) {
            item['ten_nha_cung_cap'] = product.ma_nha_cung_cap;
          } else {
            item['ten_nha_cung_cap'] = null;
            item.invalidTenNhaCungCap = true;
          }
        }

        Object.assign(item, defaultFields);
        item.key = index;
        return item;
      });

      setParsedData(processedData);
      validateData(processedData);
      setShowPreview(true);
      message.success(`File "${file.name}" đã được tải lên thành công!`);
    } catch (error) {
      console.error('Error parsing Excel file:', error);
      message.error('Có lỗi khi đọc file Excel. Vui lòng kiểm tra định dạng file!');
    }
  };

  reader.onerror = () => {
    message.error('Không thể đọc file!');
  };

  reader.readAsArrayBuffer(file);
  setFileList([file]);
  return false; // Ngăn không cho upload tự động
};