import React from "react";
import { Input, Select, InputNumber, Button } from "antd";
import { SearchOutlined, PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import dayjs from "dayjs/esm/index.js";
export default function WarehouseFilterBar({
  search, setSearch,
  month, setMonth,
  exchangeRate, setExchangeRate,
  availableMonths = [],
  onAdd,
  onResetFilters
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 8 }}>
      <Input
        prefix={<SearchOutlined />}
        placeholder="Tìm kiếm tên kho"
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ width: 240 }}
      />
      {/* Đã bỏ filter người quản lý */}
      
      {/* Month selector dựa trên price list */}
      <Select
        placeholder="Price list tháng"
        style={{ width: 200 }}
        value={month ? month.format('YYYY-MM') : undefined}
        onChange={(value) => setMonth(value ? dayjs(value, 'YYYY-MM') : null)}
        allowClear
      >
        {availableMonths.map(monthStr => (
          <Select.Option key={monthStr} value={monthStr}>
            {dayjs(monthStr, 'YYYY-MM').format('MM/YYYY')}
          </Select.Option>
        ))}
        {/* Fallback cho tháng hiện tại nếu không có trong price list */}
        {!availableMonths.includes(dayjs().format('YYYY-MM')) && (
          <Select.Option value={dayjs().format('YYYY-MM')}>
            {dayjs().format('MM/YYYY')}
          </Select.Option>
        )}
      </Select>
      
      <InputNumber 
        placeholder="Tỷ giá EUR/VNĐ"
        value={exchangeRate} 
        onChange={setExchangeRate} 
        addonAfter="VNĐ/EUR" 
        style={{ width: 180 }} 
        min={1}
        formatter={value => value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}
        parser={value => value.replace(/\$\s?|(,*)/g, '')}
      />
      <Button
        icon={<ReloadOutlined />}
        onClick={onResetFilters}
        style={{ fontWeight: 600, marginRight: 8 }}
      >
        Đặt lại bộ lọc
      </Button>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={onAdd}
        style={{ fontWeight: 600 }}
      >
        Thêm Kho
      </Button>
    </div>
  );
}
