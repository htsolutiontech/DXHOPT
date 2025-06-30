import React from 'react';
import { Input, Select, Button } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { getUniqueValues } from '../../../../utils/data/dataFilter';
import { getCountryName } from '../../../../utils/convert/countryCodes';
import { getUnitName } from '../../../../utils/convert/unitCodes';
import '../../../../utils/css/Custom-Filter.css';

const { Option } = Select;

const ChiTietBaoGiaFilter = ({
  data,
  searchTerm,
  setSearchTerm,
  sectionSearch,
  setSectionSearch,
  saleunitFilter,
  setSaleUnitFilter,
  countryFilter,
  setCountryFilter,
  supplierFilter,
  setSupplierFilter,
  onRefresh,
  loading
}) => {
  const uniqueSaleUnit = getUniqueValues(data, (item) => getUnitName(item.don_vi_tinh));
  const uniqueCountry = getUniqueValues(data, (item) => getCountryName(item.xuat_xu));
  const uniqueSupplier = getUniqueValues(data, (item) => item.hang_chu_so_huu);
  
  return (
    <div className="filters chitietbaogia-filters">
      <Input
        placeholder="Tìm kiếm theo số báo giá"
        prefix={<SearchOutlined />}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Input
          className="search-input"
          placeholder="Tìm theo mục phần"
          prefix={<SearchOutlined />}
          value={sectionSearch}
          onChange={(e) => setSectionSearch(e.target.value)}
      />
      <Select value={saleunitFilter} onChange={setSaleUnitFilter}>
        <Option value="all">Đơn vị tính</Option>
        {uniqueSaleUnit.map((item) => (
          <Option key={item} value={item}>{item}</Option>
        ))}
      </Select>
      <Select value={countryFilter} onChange={setCountryFilter}>
        <Option value="all">Nước xuất xứ</Option>
        {uniqueCountry.map((item) => (
          <Option key={item} value={item}>{item}</Option>
        ))}
      </Select>
      <Select value={supplierFilter} onChange={setSupplierFilter}>
        <Option value="all">Hãng chủ sở hữu</Option>
        {uniqueSupplier.map((item) => (
          <Option key={item} value={item}>{item}</Option>
        ))}
      </Select>
      <Button icon={<ReloadOutlined />} onClick={onRefresh} loading={loading}>
        Làm mới
      </Button>
    </div>
  );
};

export default ChiTietBaoGiaFilter;
