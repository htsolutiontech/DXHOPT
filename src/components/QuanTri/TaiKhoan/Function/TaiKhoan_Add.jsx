import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, message, Select, DatePicker, Spin, Row, Col } from 'antd';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import moment from 'moment';
import { fetchDataList, createItem } from '../../../utils/api/requestHelpers';
import { fetchAndSetList } from '../../../utils/api/fetchHelpers';
import '../../../utils/css/Custom-Update.css';

const { Option } = Select;

const AddUser = ({ onCancel, onSuccess, disabled }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [newMaND, setNewMaND] = useState('');
  const [roles, setRoles] = useState([]);

  useEffect(() => {
      fetchMaxSTT();
      fetchAndSetList('https://dx.hoangphucthanh.vn:3000/warehouse/roles', setRoles, 'Không thể tải danh sách vai trò').finally(() => setFetchLoading(false));
    }, []);
  
    const fetchMaxSTT = async () => {
      setFetchLoading(true);
      try {
        const allAccounts = await fetchDataList('https://dx.hoangphucthanh.vn:3000/warehouse/accounts');
        const maxSTT = allAccounts.length ? Math.max(...allAccounts.map(item => item.stt || 0)) : 0;
        const newSTT = maxSTT + 1;
        const generatedMaND = `user${String(newSTT).padStart(3, '0')}`;
        setNewMaND(generatedMaND);
  
        // Gán luôn giá trị mặc định vào form
        form.setFieldsValue({
          ma_nguoi_dung: generatedMaND,
          ngay_tao: moment(),
        });
  
      } catch (error) {
        console.error('Lỗi khi lấy STT:', error);
        message.error('Không thể khởi tạo mã tài khoản người dùng mới');
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
  
        console.log('🚀 Payload gửi đi:', payload);
  
        const response = await createItem('https://dx.hoangphucthanh.vn:3000/warehouse/accounts', payload);
  
        console.log('📦 Kết quả thêm mới:', response);
  
        if (response && response.status && response.status >= 400) {
          throw new Error('Thêm mới thất bại từ server');
        }
  
        message.success('Thêm mới tài khoản người dùng thành công!');
        onSuccess?.(); // Callback reload data
      } catch (error) {
        console.error('Lỗi thêm mới:', error);
        message.error('Không thể thêm mới tài khoản người dùng');
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
          <h2 className="edit-title" style={{ marginBottom: 24 }}>Thêm mới Tài Khoản Người Dùng</h2>
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
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="so_dien_thoai" label="Số điện thoại">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="ngay_tao" label="Ngày tạo" rules={[{ required: true }]}>
                  <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} disabled />
                </Form.Item>
              </Col>
            </Row>
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

export default AddUser;
