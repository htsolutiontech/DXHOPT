import React from 'react';
import { Input, Select, Button } from 'antd';
import { getUniqueValues } from '../../../utils/data/dataFilter';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import '../../../utils/css/Custom-Filter.css';

const { Option } = Select;

const NguoiDungFilter = ({
  data,
  searchTerm,
  setSearchTerm,
  yearFilter,
  setYearFilter,
  roleFilter,
  setRoleFilter,
  onRefresh,
  loading
}) => {
  const uniqueRoles = getUniqueValues(data, (item) => item.role?.vai_tro);
  const uniqueYears = getUniqueValues(data, (item) =>
    new Date(item.ngay_tao).getFullYear().toString()
  );

  return (
    <div className="filters nguoidung-filters">
      <Input
        placeholder="Tìm kiếm theo họ và tên"
        prefix={<SearchOutlined />}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Select value={roleFilter} onChange={setRoleFilter}>
        <Option value="all">Vai trò</Option>
        {uniqueRoles.map((item) => (
          <Option key={item} value={item}>{item}</Option>
        ))}
      </Select>
      <Select value={yearFilter} onChange={setYearFilter}>
        <Option value="all">Năm tạo</Option>
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

export default NguoiDungFilter;
