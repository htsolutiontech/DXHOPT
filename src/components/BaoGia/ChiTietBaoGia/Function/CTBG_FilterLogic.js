import { normalizeString } from '../../../utils/format/search';
import { getCountryName } from '../../../utils/convert/countryCodes';
import { getUnitName } from '../../../utils/convert/unitCodes';

export function filterChiTietBaoGia(data, { searchTerm, sectionSearch, saleunitFilter, countryFilter, supplierFilter }) {
    const normalizedSearch = normalizeString(searchTerm || '');
    const normalizedSection = normalizeString(sectionSearch || '');
    
    return data.filter(item => {
      const matchesSearch =
        !searchTerm ||
        normalizeString(item.so_bao_gia || '').includes(normalizedSearch);

      const matchesSection =
        !sectionSearch ||
        normalizeString(item.muc_phan || '').includes(normalizedSection);

      const matchesSaleUnit =
        saleunitFilter === 'all' || getUnitName(item.don_vi_tinh) === saleunitFilter;

      const matchesCountry =
        countryFilter === 'all' || getCountryName(item.xuat_xu) === countryFilter;

      const matchesSupplier =
        supplierFilter === 'all' || item.hang_chu_so_huu === supplierFilter;
  
      return matchesSearch && matchesSection && matchesSaleUnit && matchesCountry && matchesSupplier;
    });
  }
  