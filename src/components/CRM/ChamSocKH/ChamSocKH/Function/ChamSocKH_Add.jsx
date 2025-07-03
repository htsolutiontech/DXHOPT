import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Button, Card, message, Select, DatePicker, Spin, Row, Col } from 'antd';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import moment from 'moment';
import { fetchDataList, createItem } from '../../../../utils/api/requestHelpers';
import { getVietnamProvinces } from '../../../../utils/format/location';
import { fetchAndSetList } from '../../../../utils/api/fetchHelpers';
import '../../../../utils/css/Custom-Update.css';

const { Option } = Select;

const AddCustomerInteraction = ({ onCancel, onSuccess, disabled }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [newMaTTKH, setNewMaTTKH] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [interaction_types, setInteraction_Types] = useState([]);

  // Lấy user hiện tại từ localStorage
  const currentUser = JSON.parse(localStorage.getItem('userData') || '{}');

  useEffect(() => {
    fetchMaxSTT();
    fetchAndSetList('https://dx.hoangphucthanh.vn:3000/warehouse/accounts', setAccounts, 'Không thể tải danh sách người dùng').finally(() => setFetchLoading(false));
    fetchAndSetList('https://dx.hoangphucthanh.vn:3000/crm/interaction_types', setInteraction_Types, 'Không thể tải danh sách loại tương tác').finally(() => setFetchLoading(false));
    form.setFieldsValue({
      thoi_gian: moment(),
      nguoi_phu_trach: currentUser?.ma_nguoi_dung || undefined,
    });
  }, []);

  const fetchMaxSTT = async () => {
    setFetchLoading(true);
    try {
      const allCustomer_Interaction = await fetchDataList('https://dx.hoangphucthanh.vn:3000/crm/customer-interactions');
      const maxSTT = allCustomer_Interaction.length ? Math.max(...allCustomer_Interaction.map(item => item.stt || 0)) : 0;
      const newSTT = maxSTT + 1;
      const generatedMaTTKH = `TT${String(newSTT)}`;
      setNewMaTTKH(generatedMaTTKH);

      // Gán luôn giá trị mặc định vào form
      form.setFieldsValue({
        ma_tuong_tac_khach_hang: generatedMaTTKH,
      });

    } catch (error) {
      console.error('Lỗi khi lấy STT:', error);
      message.error('Không thể khởi tạo mã tương tác khách hàng mới');
    } finally {
      setFetchLoading(false);
    }
  };
  
  const onFinish = async (values) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        thoi_gian: values.thoi_gian?.format('YYYY-MM-DD HH:mm:ss'),
      };

      console.log('🚀 Payload gửi đi:', payload);

      const response = await createItem('https://dx.hoangphucthanh.vn:3000/crm/customer-interactions', payload);

      console.log('📦 Kết quả thêm mới:', response);

      if (response && response.status && response.status >= 400) {
        throw new Error('Thêm mới thất bại từ server');
      }

      message.success('Thêm mới tương tác khách hàng thành công!');
      onSuccess?.(); // Callback reload data
    } catch (error) {
      console.error('Lỗi thêm mới:', error);
      message.error('Không thể thêm mới tương tác khách hàng');
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
          <h2 className="edit-title" style={{ marginBottom: 24 }}>Thêm mới Tương Tác Khách Hàng</h2>
          <Form form={form} layout="vertical" onFinish={onFinish} className="edit-form">
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="ma_tuong_tac_khach_hang" label="Mã tương tác khách hàng" rules={[{ required: true }]}>
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col span={16}>
                <Form.Item name="ten_khach_hang" label="Tên khách hàng" 
                  rules={[
                    { required: true, message: 'Tên tương tác khách hàng không được để trống' },
                    {
                        pattern: /^[^a-z]+$/,
                        message: 'Không được chứa chữ thường (a–z)',
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="nguoi_phu_trach" label="Người phụ trách" rules={[{ required: true }]}>
                  <Select showSearch optionFilterProp="children" placeholder="Chọn người phụ trách">
                    {accounts.map(account => (
                      <Option key={account.ma_nguoi_dung} value={account.ma_nguoi_dung}>
                        {account.ho_va_ten}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="loai_tuong_tac" label="Loại tương tác" rules={[{ required: true }]}>
                  <Select showSearch optionFilterProp="children" placeholder="Chọn loại tương tác">
                    {interaction_types.map(interaction_type => (
                      <Option key={interaction_type.ma_loai_tuong_tac} value={interaction_type.ma_loai_tuong_tac}>
                        {interaction_type.loai_tuong_tac}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="hinh_thuc_goi" label="Hình thức gọi" rules={[{ required: true }]}>
                  <Select>
                      <Option value="Gọi đến">Gọi đến</Option>
                      <Option value="Gọi đi">Gọi đi</Option>
                      <Option value="">Khác</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="thoi_gian" label="Thời gian" rules={[{ required: true }]}>
                  <DatePicker format="DD/MM/YYYY HH:mm:ss" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="noi_dung_tuong_tac" label="Nội dung">
              <Input.TextArea rows={3} />
            </Form.Item>
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

export default AddCustomerInteraction;
