import React from 'react';
import { Typography } from 'antd';

const PageHeader = () => {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '24px',
      borderRadius: '12px',
      marginBottom: '24px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    }}>
      <Typography.Title 
        level={2} 
        style={{
          marginBottom: 0, 
          color: 'white',
          textAlign: 'center',
          fontSize: '28px',
          fontWeight: 600
        }}
      >
        BÁO CÁO KHO HÀNG
      </Typography.Title>
      <Typography.Text style={{
        color: 'rgba(255,255,255,0.8)',
        display: 'block',
        textAlign: 'center',
        marginTop: '8px',
        fontSize: '16px'
      }}>
        Quản lý và theo dõi tình trạng kho hàng một cách chi tiết
      </Typography.Text>
    </div>
  );
};

export default PageHeader;
