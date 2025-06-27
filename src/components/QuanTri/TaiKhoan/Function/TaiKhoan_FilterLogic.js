import { normalizeString } from '../../../utils/format/search';

export function filterNguoiDung(data, { searchTerm, yearFilter, roleFilter }) {
    const normalizedSearch = normalizeString(searchTerm || '');
    
    return data.filter(item => {
      const matchesSearch =
        !searchTerm ||
        normalizeString(item.ho_va_ten || '').includes(normalizedSearch);
  
      const matchesRole =
        roleFilter === 'all' || item.role?.vai_tro === roleFilter;
  
      const matchesYear =
        yearFilter === 'all' ||
        new Date(item.ngay_tao).getFullYear().toString() === yearFilter;
  
      return matchesSearch && matchesRole && matchesYear;
    });
  }
  