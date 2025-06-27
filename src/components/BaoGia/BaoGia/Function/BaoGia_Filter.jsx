import React from 'react';
import { Input, Select, Button } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { getUniqueValues } from '../../../utils/data/dataFilter';
import '../../../utils/css/Custom-Filter.css';

const { Option } = Select;

const BaoGiaFilter = ({
  data,
  searchTerm,
  setSearchTerm,
  yearFilter,
  setYearFilter,
  quotation_typeFilter,
  setQuotation_TypeFilter,
  quotation_statusFilter,
  setQuotation_StatusFilter,
  accountFilter,
  setAccountFilter,
  onRefresh,
  loading
}) => {
  const uniqueYears = getUniqueValues(data, (item) =>
    new Date(item.ngay_bao_gia).getFullYear().toString()
  );
  const uniqueQuotation_Type = getUniqueValues(data, (item) => item.quotation_type?.loai_bao_gia);
  const uniqueQuotation_Status = getUniqueValues(data, (item) => item.quotation_status?.trang_thai_bao_gia);
  const uniqueAccounts = getUniqueValues(data, (item) => item.accounts?.ho_va_ten);
  

  return (
    <div className="filters baogia-filters">
      <Input
        placeholder="Tìm kiếm theo số báo giá, tiêu đề, khách hàng"
        prefix={<SearchOutlined />}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Select value={yearFilter} onChange={setYearFilter}>
        <Option value="all">Năm</Option>
        {uniqueYears.map((item) => (
          <Option key={item} value={item}>{item}</Option>
        ))}
      </Select>
      <Select value={quotation_typeFilter} onChange={setQuotation_TypeFilter}>
        <Option value="all">Loại báo giá</Option>
        {uniqueQuotation_Type.map((item) => (
          <Option key={item} value={item}>{item}</Option>
        ))}
      </Select>
      <Select value={quotation_statusFilter} onChange={setQuotation_StatusFilter}>
        <Option value="all">Tình trạng</Option>
        {uniqueQuotation_Status.map((item) => (
          <Option key={item} value={item}>{item}</Option>
        ))}
      </Select>
      <Select value={accountFilter} onChange={setAccountFilter}>
        <Option value="all">Người tạo</Option>
        {uniqueAccounts.map((item) => (
          <Option key={item} value={item}>{item}</Option>
        ))}
      </Select>
      <Button icon={<ReloadOutlined />} onClick={onRefresh} loading={loading}>
        Làm mới
      </Button>
    </div>
  );
};

export default BaoGiaFilter;
