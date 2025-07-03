import React from "react";
import { Card, Row, Col, Tag, Divider, Typography, Button, Space } from "antd";
import dayjs from "dayjs/esm/index.js";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
const { Title, Text } = Typography;

export default function WarehouseCard({ kho, value, onEdit, onDelete }) {
  return (
    <Col xs={24} sm={12} key={kho.ma_kho}>
      <Card 
        bordered 
        style={{ 
          borderRadius: 8, 
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
        bodyStyle={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Row gutter={16} style={{ flex: 1 }}>
          <Col flex="120px">
            <img
              src={kho.hinh_anh || "/image/warehouse.jpg"}
              alt="Hình kho"
              style={{ width: 120, height: 100, objectFit: "cover", borderRadius: 8, border: "1px solid #ccc" }}
            />
          </Col>
          <Col flex="auto" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1 }}>
              <Title level={5} style={{ marginBottom: 4 }}>{kho.ten_kho}</Title>
              <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>{kho.vi_tri_kho}</Text>
              <div style={{ marginBottom: 8 }}>
                <Tag color={kho.tinh_trang === "Đang hoạt động" ? "green" : "orange"}>{kho.tinh_trang}</Tag>
              </div>
              
              <div style={{ fontSize: '13px', lineHeight: '1.4' }}>
                <div style={{ marginBottom: 4 }}>
                  <Text strong>Người tạo:</Text> <Text>{kho.accounts_warehouse_nguoi_taoToaccounts?.ho_va_ten || kho.nguoi_tao || 'Chưa xác định'}</Text>
                </div>
                <div style={{ marginBottom: 4 }}>
                  <Text strong>Ngày tạo:</Text> <Text>{kho.ngay_tao ? dayjs(kho.ngay_tao).format("DD/MM/YYYY") : 'Chưa xác định'}</Text>
                </div>
                <div style={{ marginBottom: 4 }}>
                  <Text strong>Quản lý:</Text> <Text>{kho.accounts_warehouse_quan_ly_khoToaccounts?.ho_va_ten || kho.quan_ly_kho || 'Chưa xác định'}</Text>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <Text strong>Ngày kiểm kê:</Text> <Text>{kho.ngay_kiem_ke_gan_nhat ? dayjs(kho.ngay_kiem_ke_gan_nhat).format("DD/MM/YYYY") : 'Chưa kiểm kê'}</Text>
                </div>
              </div>
              
              <div style={{ fontSize: '12px', marginBottom: 8, lineHeight: '1.3' }}>
                <div>
                  <Text strong>Nhập:</Text> {value.importEuro.toLocaleString()} EUR
                  {value.importVND !== null && ` • ${value.importVND.toLocaleString()} VNĐ`}
                </div>
                <div>
                  <Text strong>Xuất:</Text> {value.exportEuro.toLocaleString()} EUR
                  {value.exportVND !== null && ` • ${value.exportVND.toLocaleString()} VNĐ`}
                </div>
                <div>
                  <Text strong>Tồn:</Text> {value.remainEuro.toLocaleString()} EUR
                  {value.remainVND !== null && ` • ${value.remainVND.toLocaleString()} VNĐ`}
                </div>
              </div>
              
              {kho.ghi_chu && (
                <div style={{ fontSize: '12px', marginBottom: 8 }}>
                  <Text strong>Ghi chú:</Text> <Text type="secondary">{kho.ghi_chu}</Text>
                </div>
              )}
            </div>
            
            <div style={{ marginTop: 'auto', paddingTop: 8 }}>
              <Space>
                <Button icon={<EditOutlined />} onClick={() => onEdit(kho)} size="small">Sửa</Button>
                <Button icon={<DeleteOutlined />} danger onClick={() => onDelete(kho)} size="small">Xoá</Button>
              </Space>
            </div>
          </Col>
        </Row>
      </Card>
    </Col>
  );
}
