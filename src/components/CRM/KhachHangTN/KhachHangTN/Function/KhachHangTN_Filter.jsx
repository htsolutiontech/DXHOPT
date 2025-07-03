import React from 'react';
import { Input, Select, Button } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { getUniqueValues } from '../../../../utils/data/dataFilter';
import '../../../../utils/css/Custom-Filter.css';

const { Option } = Select;

const KhachHangTiemNangFilter = ({
  data,
  searchTerm,
  setSearchTerm,
  yearFilter,
  setYearFilter,
  accountFilter,
  setAccountFilter,
  provinceFilter,
  setProvinceFilter,
  nextactionFilter,
  setNextActionFilter,
  purposeFilter,
  setPurposeFilter,
  onRefresh,
  loading
}) => {
  const uniqueAccounts = getUniqueValues(data, (item) => item.accounts?.ho_va_ten);
  const uniqueProvinces = getUniqueValues(data, (item) => item.tinh_thanh);
  const uniqueNextActions = getUniqueValues(data, (item) => item.hanh_dong_tiep_theo);
  const uniquePurposes = getUniqueValues(data, (item) => item.muc_dich);
  const uniqueYears = getUniqueValues(data, (item) =>
    new Date(item.ngay_them_vao).getFullYear().toString()
  );

  return (
    <div className="filters khachhangtiemnang-filters">
      <Input
        placeholder="Tìm kiếm theo tên khách hàng hoặc tỉnh"
        prefix={<SearchOutlined />}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Select value={accountFilter} onChange={setAccountFilter}>
        <Option value="all">Người phụ trách</Option>
        {uniqueAccounts.map((item) => (
          <Option key={item} value={item}>{item}</Option>
        ))}
      </Select>
      <Select value={provinceFilter} onChange={setProvinceFilter}>
        <Option value="all">Tỉnh thành</Option>
        {uniqueProvinces.map((item) => (
          <Option key={item} value={item}>{item}</Option>
        ))}
      </Select>
      <Select value={nextactionFilter} onChange={setNextActionFilter}>
        <Option value="all">Hành động tiếp theo</Option>
        {uniqueNextActions.map((item) => (
          <Option key={item} value={item}>{item}</Option>
        ))}
      </Select>
      <Select value={purposeFilter} onChange={setPurposeFilter}>
        <Option value="all">Mục đích</Option>
        {uniquePurposes.map((item) => (
          <Option key={item} value={item}>{item}</Option>
        ))}
      </Select>
      <Select value={yearFilter} onChange={setYearFilter}>
        <Option value="all">Năm</Option>
        {uniqueYears.map((item) => (
          <Option key={item} value={item}>{item}</Option>
        ))}
      </Select>
      <Button icon={<ReloadOutlined />} onClick={onRefresh} loading={loading}>
        Làm mới
      </Button>
    </div>
  );
};

export default KhachHangTiemNangFilter;
