import React from 'react';
import { Input, Select, Button } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { getUniqueValues } from '../../../../utils/data/dataFilter';
import '../../../../utils/css/Custom-Filter.css';

const { Option } = Select;

const TuongTacKhachHangFilter = ({
  data,
  searchTerm,
  setSearchTerm,
  yearFilter,
  setYearFilter,
  accountFilter,
  setAccountFilter,
  interaction_typeFilter,
  setInteraction_TypeFilter,
  callFilter,
  setCallFilter,
  onRefresh,
  loading
}) => {
  const uniqueAccounts = getUniqueValues(data, (item) => item.accounts?.ho_va_ten);
  const uniqueInteraction_Type = getUniqueValues(data, (item) => item.interaction_type?.loai_tuong_tac);
  const uniqueCall = getUniqueValues(data, (item) => item.hinh_thuc_goi);
  const uniqueYears = getUniqueValues(data, (item) =>
    new Date(item.thoi_gian).getFullYear().toString()
  );

  return (
    <div className="filters tuongtackhachhang-filters">
      <Input
        placeholder="Tìm kiếm theo tên khách hàng"
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
      <Select value={interaction_typeFilter} onChange={setInteraction_TypeFilter}>
        <Option value="all">Loại tương tác</Option>
        {uniqueInteraction_Type.map((item) => (
          <Option key={item} value={item}>{item}</Option>
        ))}
      </Select>
      <Select value={callFilter} onChange={setCallFilter}>
        <Option value="all">Hình thức gọi</Option>
        {uniqueCall.map((item) => (
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

export default TuongTacKhachHangFilter;
