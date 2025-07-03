import React from 'react';
import { Card, Row, Col, Select, DatePicker, Button } from 'antd';

const { Option } = Select;

const FilterControls = ({
  warehouses,
  products,
  selectedWarehouse,
  setSelectedWarehouse,
  dateRange,
  setDateRange,
  selectedProduct,
  setSelectedProduct,
  onRefresh
}) => {
  return (
    <Card 
      style={{
        marginBottom: 24,
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}
      bodyStyle={{padding: '20px'}}
    >
      <Row gutter={16} align="middle">
        <Col span={6}>
          <div style={{marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: '#666'}}>
            🏪 Chọn kho hàng
          </div>
          <Select
            showSearch
            allowClear
            style={{width:'100%'}}
            placeholder="Chọn kho"
            value={selectedWarehouse?.ma_kho}
            onChange={ma_kho => {
              if (ma_kho === 'ALL') {
                setSelectedWarehouse({ ma_kho: 'ALL', ten_kho: 'Tất cả kho' });
              } else {
                const warehouse = warehouses.find(w => w.ma_kho === ma_kho) || null;
                setSelectedWarehouse(warehouse);
              }
            }}
            optionFilterProp="children"
            size="large"
          >
            <Option key="ALL" value="ALL">Tất cả kho</Option>
            {warehouses.map(w => (
              <Option key={w.ma_kho} value={w.ma_kho}>{w.ten_kho}</Option>
            ))}
          </Select>
        </Col>
        
        <Col span={8}>
          <div style={{marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: '#666'}}>
            📅 Chọn khoảng thời gian
          </div>
          <DatePicker.RangePicker
            style={{width:'100%'}}
            value={dateRange && dateRange.length === 2 ? dateRange : []}
            onChange={v => setDateRange(v || [])}
            allowClear
            size="large"
            placeholder={["Từ ngày", "Đến ngày"]}
            format="DD/MM/YYYY"
          />
        </Col>
        
        <Col span={6}>
          <div style={{marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: '#666'}}>
            📦 Chọn sản phẩm
          </div>
          <Select
            showSearch
            allowClear
            style={{width:'100%'}}
            placeholder="Chọn sản phẩm"
            value={selectedProduct?.ma_hang}
            onChange={ma_hang => {
              const product = products.find(p => p.ma_hang === ma_hang) || null;
              setSelectedProduct(product);
            }}
            optionFilterProp="children"
            size="large"
          >
            {products.map(p => (
              <Option key={p.ma_hang} value={p.ma_hang}>
                {p.ma_hang} - {p.ten_hang}
              </Option>
            ))}
          </Select>
        </Col>
        
        <Col span={4}>
          <div style={{marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: 'transparent'}}>
            .
          </div>
          <Button 
            type="primary"
            size="large" 
            style={{width: '100%', height: '40px'}}
            onClick={onRefresh}
          >
            Đặt lại
          </Button>
        </Col>
      </Row>
    </Card>
  );
};

export default FilterControls;
