import { normalizeString } from '../../../../utils/format/search';

export function filterKhachHangTiemNang(data, { searchTerm, yearFilter, accountFilter, provinceFilter, nextactionFilter, purposeFilter }) {
    const normalizedSearch = normalizeString(searchTerm || '');
    
    return data.filter(item => {
      const matchesSearch =
        !searchTerm ||
        normalizeString(item.ten_khach_hang || '').includes(normalizedSearch) ||
        normalizeString(item.tinh_thanh || '').includes(normalizedSearch);
  
      const matchesAccount =
        accountFilter === 'all' || item.accounts?.ho_va_ten === accountFilter;
  
      const matchesProvince =
        provinceFilter === 'all' || item.tinh_thanh === provinceFilter;
      
      const matchesNextAction =
        nextactionFilter === 'all' || item.hanh_dong_tiep_theo === nextactionFilter;

      const matchesPurpose =
        purposeFilter === 'all' || item.muc_dich === purposeFilter;
  
      const matchesYear =
        yearFilter === 'all' ||
        new Date(item.ngay_them_vao).getFullYear().toString() === yearFilter;
  
      return matchesSearch && matchesAccount && matchesProvince && matchesNextAction && matchesPurpose && matchesYear;
    });
  }
  