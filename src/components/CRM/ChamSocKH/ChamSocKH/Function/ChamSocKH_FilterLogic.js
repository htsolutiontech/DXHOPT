import { normalizeString } from '../../../../utils/format/search';

export function filterTuongTacKhachHang(data, { searchTerm, yearFilter, accountFilter, interaction_typeFilter, callFilter }) {
    const normalizedSearch = normalizeString(searchTerm || '');
    
    return data.filter(item => {
      const matchesSearch =
        !searchTerm ||
        normalizeString(item.ten_khach_hang || '').includes(normalizedSearch);
  
      const matchesAccount =
        accountFilter === 'all' || item.accounts?.ho_va_ten === accountFilter;
  
      const matchesInteractionType =
        interaction_typeFilter === 'all' || item.interaction_type?.loai_tuong_tac === interaction_typeFilter;

      const matchesCall =
        callFilter === 'all' || item.hinh_thuc_goi === callFilter;
  
      const matchesYear =
        yearFilter === 'all' ||
        new Date(item.thoi_gian).getFullYear().toString() === yearFilter;
  
      return matchesSearch && matchesAccount && matchesInteractionType && matchesCall && matchesYear;
    });
  }
  