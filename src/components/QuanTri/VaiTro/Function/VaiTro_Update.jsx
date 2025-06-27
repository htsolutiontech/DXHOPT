import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, message, Select, DatePicker, Spin, Row, Col } from 'antd';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import moment from 'moment';
import { fetchDataList, updateItemById } from '../../../utils/api/requestHelpers';
import '../../../utils/css/Custom-Update.css';

const { Option } = Select;

const EditRole = ({ roleId, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [roleData, setRoleData] = useState(null);

  useEffect(() => {
    if (roleId) fetchRoleData(roleId);
  }, [roleId]);

  const fetchRoleData = async (id) => {
    setFetchLoading(true);
    try {
      const allRoles = await fetchDataList('https://dx.hoangphucthanh.vn:3000/warehouse/roles');
      const role = allRoles.find(item => item.ma_vai_tro === id);
      if (!role) throw new Error(`Không tìm thấy vai trò với mã: ${id}`);
      if (role.ngay_cap_nhat) role.ngay_cap_nhat = moment(role.ngay_cap_nhat);
      setRoleData(role);
      form.setFieldsValue(role);
      message.success(`Đã tải thông tin vai trò: ${role.vai_tro}`);
    } catch (error) {
      console.error('Lỗi tải dữ liệu:', error);
      message.error(error.message);
    } finally {
      setFetchLoading(false);
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        ngay_cap_nhat: values.ngay_cap_nhat?.format('YYYY-MM-DD'),
      };
      
      console.log('🚀 Payload gửi đi:', payload);
      
      const response = await updateItemById(`https://dx.hoangphucthanh.vn:3000/warehouse/roles/${roleId}`, payload);

      console.log('📦 Kết quả cập nhật:', response);

      // Kiểm tra nếu response là lỗi
      if (response && response.status && response.status >= 400) {
        throw new Error('Cập nhật thất bại từ server');
      }

      message.success('Cập nhật vai trò thành công!');
      onSuccess?.();
    } catch (error) {
      console.error('Lỗi cập nhật:', error);
      message.error('Không thể cập nhật vai trò');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-container">
      {fetchLoading ? (
        <div className="loading-container">
          <Spin tip="Đang tải dữ liệu..." />
        </div>
      ) : (
        <>
          <h2 className="edit-title" style={{ marginBottom: 24 }}>
            Chỉnh sửa Vai Trò: {roleData?.vai_tro || roleId}
          </h2>
          <Form form={form} layout="vertical" onFinish={onFinish} className="edit-form">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="ma_vai_tro" label="Mã vai trò" rules={[{ required: true }]}><Input disabled /></Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="vai_tro" label="Vai trò" rules={[{ required: true }]}><Input /></Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="nguoi_cap_nhat" label="Người cập nhật" rules={[{ required: true }]}><Input /></Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="ngay_cap_nhat" label="Ngày cập nhật" rules={[{ required: true }]}>
                    <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} disabled />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="ghi_chu" label="Ghi chú"><Input.TextArea rows={3} /></Form.Item>
            <div className="form-actions">
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>Lưu</Button>
              <Button icon={<CloseOutlined />} onClick={onCancel} danger>Hủy</Button>
            </div>
          </Form>
        </>
      )}
    </div>
  );
};

export default EditRole;
