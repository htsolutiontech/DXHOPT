import React, { useMemo } from 'react';
import { Card, Statistic, Row, Col } from 'antd';
import { BarChartOutlined, ArrowUpOutlined, ArrowDownOutlined, PieChartOutlined, WarningOutlined } from '@ant-design/icons';

const SummaryCards = ({ bangNhapXuatTon }) => {
  const summary = useMemo(() => [
    { 
      label: "Tổng mặt hàng", 
      value: bangNhapXuatTon.length, 
      icon: <BarChartOutlined />,
      color: '#e6f7ff',
      colorLight: '#f6ffed',
      textColor: '#1890ff'
    },
    { 
      label: "Tổng nhập", 
      value: bangNhapXuatTon.reduce((sum, r) => sum + r.tong_nhap, 0), 
      icon: <ArrowUpOutlined />,
      color: '#f6ffed',
      colorLight: '#f6ffed', 
      textColor: '#52c41a'
    },
    { 
      label: "Tổng xuất", 
      value: bangNhapXuatTon.reduce((sum, r) => sum + r.tong_xuat, 0), 
      icon: <ArrowDownOutlined />,
      color: '#fff2e8',
      colorLight: '#fff1f0',
      textColor: '#ff4d4f'
    },
    { 
      label: "Tổng tồn", 
      value: bangNhapXuatTon.reduce((sum, r) => sum + r.ton_cuoi_ky, 0), 
      icon: <PieChartOutlined />,
      color: '#f9f0ff',
      colorLight: '#f9f0ff',
      textColor: '#722ed1'
    },
    { 
      label: "SL hết hàng", 
      value: bangNhapXuatTon.filter(r => r.ton_cuoi_ky <= 0).length, 
      icon: <WarningOutlined />,
      color: '#fff1f0',
      colorLight: '#fff2f0',
      textColor: '#ff4d4f'
    },
    { 
      label: "SL sắp hết", 
      value: bangNhapXuatTon.filter(r => r.ton_cuoi_ky > 0 && r.ton_cuoi_ky < 10).length, 
      icon: <WarningOutlined />,
      color: '#fffbe6',
      colorLight: '#feffe6',
      textColor: '#faad14'
    },
  ], [bangNhapXuatTon]);

  return (
    <Row gutter={16} style={{marginBottom: 24}}>
      {summary.map((item, idx) => (
        <Col span={4} key={idx}>
          <Card 
            style={{
              background: `linear-gradient(135deg, ${item.color || '#f0f2f5'} 0%, ${item.colorLight || '#fafafa'} 100%)`,
              border: 'none',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease'
            }}
            bodyStyle={{padding: '20px 16px'}}
            hoverable
          >
            <Statistic 
              title={
                <span style={{
                  color: '#666', 
                  fontSize: '13px', 
                  fontWeight: 500,
                  marginBottom: '8px'
                }}>
                  {item.label}
                </span>
              } 
              value={item.value} 
              prefix={
                <div style={{
                  fontSize: '24px',
                  marginBottom: '4px',
                  display: 'flex',
                  justifyContent: 'center'
                }}>
                  {item.icon}
                </div>
              }
              valueStyle={{
                fontWeight: 700,
                fontSize: '24px',
                color: item.textColor || '#262626',
                textAlign: 'center',
                marginTop: '8px'
              }}
              formatter={(value) => value?.toLocaleString?.('vi-VN') || value}
            />
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default SummaryCards;
