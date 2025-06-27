import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Button, Card, message, Select, DatePicker, Spin, Row, Col } from 'antd';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import moment from 'moment';
import { fetchDataList, updateItemById } from '../../../utils/api/requestHelpers';
import { fetchAndSetList } from '../../../utils/api/fetchHelpers';
import '../../../utils/css/Custom-Update.css';

const { Option } = Select;

const EditUser = ({ userId, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [accountData, setAccountData] = useState(null);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    if (userId) fetchAccountData(userId);
    fetchAndSetList('https://dx.hoangphucthanh.vn:3000/warehouse/roles', setRoles, 'Không thể tải danh sách vai trò');
  }, [userId]);

  const [originalPassword, setOriginalPassword] = useState('');

  const fetchAccountData = async (id) => {
    setFetchLoading(true);
    try {
      const allAccounts = await fetchDataList('https://dx.hoangphucthanh.vn:3000/warehouse/accounts');
      const account = allAccounts.find(item => item.ma_nguoi_dung === id);
      if (!account) throw new Error(`Không tìm thấy tài khoản người dùng với mã: ${id}`);
      if (account.ngay_tao) account.ngay_tao = moment(account.ngay_tao);
      setAccountData(account);
      setOriginalPassword(account.mat_khau); // Lưu lại mật khẩu gốc
      form.setFieldsValue(account);
      message.success(`Đã tải thông tin tài khoản người dùng: ${account.ho_va_ten}`);
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
        ngay_tao: values.ngay_tao?.format('YYYY-MM-DD'),
      };
      if (values.mat_khau === originalPassword) {
        delete payload.mat_khau;
      }

      console.log('🚀 Payload gửi đi:', payload);
      
      const response = await updateItemById(`https://dx.hoangphucthanh.vn:3000/warehouse/accounts/${userId}`, payload);

      console.log('📦 Kết quả cập nhật:', response);

      // Kiểm tra nếu response là lỗi
      if (response && response.status && response.status >= 400) {
        throw new Error('Cập nhật thất bại từ server');
      }
      
      message.success('Cập nhật tài khoản người dùng thành công!');
      onSuccess?.();
    } catch (error) {
      console.error('Lỗi cập nhật:', error);
      message.error('Không thể cập nhật tài khoản người dùng');
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
            Chỉnh sửa Tài Khoản Người Dùng: {accountData?.ho_va_ten || userId}
          </h2>
          <Form form={form} layout="vertical" onFinish={onFinish} className="edit-form">
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="ma_nguoi_dung" label="Mã người dùng" rules={[{ required: true }]}>
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="ten_dang_nhap" label="Tên đăng nhập" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="mat_khau" label="Mật khẩu" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="ho_va_ten" label="Họ và tên" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="vai_tro" label="Vai trò" rules={[{ required: true }]}>
                  <Select showSearch optionFilterProp="children" placeholder="Chọn vai trò">
                    {roles.map(role => (
                      <Option key={role.ma_vai_tro} value={role.ma_vai_tro}>
                        {role.vai_tro}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="email" label="Email">
                  <Input type="email" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="so_dien_thoai" label="Số điện thoại">
                  <Input type="number" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="ngay_tao" label="Ngày tạo" rules={[{ required: true }]}>
                  <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} disabled />
                </Form.Item>
              </Col>
            </Row>
            <div className="form-actions">
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
                Lưu
              </Button>
              <Button icon={<CloseOutlined />} onClick={onCancel} danger>
                Hủy
              </Button>
            </div>
          </Form>
        </>
      )}
    </div>
  );
};

export default EditUser;
