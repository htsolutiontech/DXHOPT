import { normalizeString } from '../../../../utils/format/search';

export function filterBaoGia(data, { searchTerm, yearFilter, quotation_typeFilter, quotation_statusFilter, accountFilter }) {
    const normalizedSearch = normalizeString(searchTerm || '');
    
    return data.filter(item => {
      const matchesSearch =
        !searchTerm ||
        normalizeString(item.so_bao_gia || '').includes(normalizedSearch) ||
        normalizeString(item.tieu_de || '').includes(normalizedSearch) ||
        normalizeString(item.ten_khach_hang || '').includes(normalizedSearch);
  
      const matchesYear =
        yearFilter === 'all' ||
        new Date(item.ngay_bao_gia).getFullYear().toString() === yearFilter;

      const matchesQuotationType =
        quotation_typeFilter === 'all' || item.quotation_type?.loai_bao_gia === quotation_typeFilter;

      const matchesQuotationStatus =
        quotation_statusFilter === 'all' || item.quotation_status?.trang_thai_bao_gia === quotation_statusFilter;
  
      const matchesAccount =
        accountFilter === 'all' || item.accounts?.ho_va_ten === accountFilter;
  
      return matchesSearch && matchesYear && matchesQuotationType && matchesQuotationStatus && matchesAccount ;
    });
  }
  