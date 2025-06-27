import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, message, Select, DatePicker, Spin, Row, Col } from 'antd';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import moment from 'moment';
import { fetchDataList, createItem } from '../../../utils/api/requestHelpers';
import '../../../utils/css/Custom-Update.css';

const { Option } = Select;

const AddRole = ({ onCancel, onSuccess, disabled }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [newMaVT, setNewMaVT] = useState('');

  useEffect(() => {
      fetchMaxSTT();
    }, []);
  
    const fetchMaxSTT = async () => {
      setFetchLoading(true);
      try {
        const allRoles = await fetchDataList('https://dx.hoangphucthanh.vn:3000/warehouse/roles');
        const maxSTT = allRoles.length ? Math.max(...allRoles.map(item => item.stt || 0)) : 0;
        const newSTT = maxSTT + 1;
        const generatedMaVT = `VT${String(newSTT).padStart(2, '0')}`;
        setNewMaVT(generatedMaVT);
  
        // Gán luôn giá trị mặc định vào form
        form.setFieldsValue({
          ma_vai_tro: generatedMaVT,
          ngay_cap_nhat: moment(),
        });
  
      } catch (error) {
        console.error('Lỗi khi lấy STT:', error);
        message.error('Không thể khởi tạo mã vai trò mới');
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
  
        const response = await createItem('https://dx.hoangphucthanh.vn:3000/warehouse/roles', payload);
  
        console.log('📦 Kết quả thêm mới:', response);
  
        if (response && response.status && response.status >= 400) {
          throw new Error('Thêm mới thất bại từ server');
        }
  
        message.success('Thêm mới vai trò thành công!');
        onSuccess?.(); // Callback reload data
      } catch (error) {
        console.error('Lỗi thêm mới:', error);
        message.error('Không thể thêm mới vai trò');
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
            <h2 className="edit-title" style={{ marginBottom: 24 }}>Thêm mới Vai Trò</h2>
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
                  <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading} disabled={disabled}>Thêm</Button>
                  <Button icon={<CloseOutlined />} onClick={onCancel} danger>Hủy</Button>
              </div>
            </Form>
          </>
        )}
    </div>
  );
};

export default AddRole;
