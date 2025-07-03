import React, { useMemo } from 'react';
import { Tag } from 'antd';
import { Card, Table, Spin } from 'antd';
import { DatabaseOutlined } from '@ant-design/icons';

const DataTable = ({ bangNhapXuatTon, loading }) => {
  const columns = useMemo(() => [
    { title: 'Mã hàng', dataIndex: 'ma_hang', key: 'ma_hang', width: 120 },
    { title: 'Tên hàng', dataIndex: 'ten_hang', key: 'ten_hang', width: 200 },
    { title: 'Tổng nhập', dataIndex: 'tong_nhap', key: 'tong_nhap', width: 120 },
    { title: 'Tổng xuất', dataIndex: 'tong_xuat', key: 'tong_xuat', width: 120 },
    { 
      title: 'Tồn cuối kỳ', 
      dataIndex: 'ton_cuoi_ky', 
      key: 'ton_cuoi_ky', 
      width: 120,
      // Hiển thị số tồn cuối kỳ
    },
    {
      title: 'Trạng thái',
      key: 'trang_thai',
      width: 120,
      render: (_, record) => {
        const val = record.ton_cuoi_ky;
        if (val <= 0) {
          return <Tag color="red" style={{fontWeight:600, fontSize:14}}>Hết hàng</Tag>;
        }
        if (val < 10) {
          return <Tag color="orange" style={{fontWeight:600, fontSize:14}}>Sắp hết</Tag>;
        }
        return <Tag color="green" style={{fontWeight:600, fontSize:14}}>Bình thường</Tag>;
      }
    },
    { title: 'Đơn vị', dataIndex: 'don_vi', key: 'don_vi', width: 100 },
  ], []);

  return (
    <Card 
      title={
        <div style={{display: 'flex', alignItems: 'center'}}>
          <DatabaseOutlined style={{marginRight: '8px', color: '#1890ff'}} />
          <span style={{fontSize: '16px', fontWeight: 600}}>Bảng chi tiết nhập - xuất - tồn kho</span>
        </div>
      }
      style={{
        marginTop: 24,
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}
      bodyStyle={{padding: '20px'}}
    >
      {loading ? (
        <div style={{textAlign: 'center', padding: '40px'}}>
          <Spin size="large" />
          <div style={{marginTop: '16px', color: '#666'}}>Đang tải dữ liệu...</div>
        </div>
      ) : (
        <Table 
          columns={columns} 
          dataSource={bangNhapXuatTon} 
          rowKey="ma_hang" 
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} sản phẩm`,
          }}
          bordered 
          size="middle"
          scroll={{ x: 800 }}
          style={{
            background: 'white',
            borderRadius: '8px'
          }}
        />
      )}
    </Card>
  );
};

export default DataTable;
