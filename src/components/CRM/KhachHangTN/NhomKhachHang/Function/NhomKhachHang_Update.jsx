import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, message, Select, DatePicker, Spin, Row, Col } from 'antd';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import moment from 'moment';
import { fetchDataList, updateItemById } from '../../../../utils/api/requestHelpers';
import { fetchAndSetList } from '../../../../utils/api/fetchHelpers';
import '../../../../utils/css/Custom-Update.css';

const { Option } = Select;

const EditCustomerGroup = ({ customer_groupId, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [customer_groupData, setCustomerGroupData] = useState(null);
  const [accounts, setAccounts] = useState([]);

  // Lấy user hiện tại từ localStorage
  const currentUser = JSON.parse(localStorage.getItem('userData') || '{}');

  useEffect(() => {
    if (customer_groupId) fetchCustomerGroupData(customer_groupId);
    fetchAndSetList('https://dx.hoangphucthanh.vn:3000/warehouse/accounts', setAccounts, 'Không thể tải danh sách người dùng');
  }, [customer_groupId]);

  const fetchCustomerGroupData = async (id) => {
    setFetchLoading(true);
    try {
      const allCustomerGroups = await fetchDataList('https://dx.hoangphucthanh.vn:3000/crm/customer-groups');
      const customer_group = allCustomerGroups.find(item => item.ma_nhom_khach_hang === id);
      if (!customer_group) throw new Error(`Không tìm thấy nhóm khách hàng với mã: ${id}`);
      if (customer_group.ngay_cap_nhat) customer_group.ngay_cap_nhat = moment(customer_group.ngay_cap_nhat);
      // Gán luôn người cập nhật là user hiện tại
      customer_group.nguoi_cap_nhat = currentUser?.ma_nguoi_dung || undefined;
      setCustomerGroupData(customer_group);
      form.setFieldsValue(customer_group);
      message.success(`Đã tải thông tin nhóm khách hàng: ${customer_group.nhom_khach_hang}`);
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
        ngay_cap_nhat: values.ngay_cap_nhat ? moment(values.ngay_cap_nhat).format('YYYY-MM-DD') : null,
      };

      console.log('🚀 Payload gửi đi:', payload);

      const response = await updateItemById(`https://dx.hoangphucthanh.vn:3000/crm/customer-groups/${customer_groupId}`, payload);

      console.log('📦 Kết quả cập nhật:', response);

      // Kiểm tra nếu response là lỗi
      if (response && response.status && response.status >= 400) {
        throw new Error('Cập nhật thất bại từ server');
      }

      message.success('Cập nhật nhóm khách hàng thành công!');
      onSuccess?.();
    } catch (error) {
      console.error('❌ Lỗi cập nhật:', error);
      message.error('Không thể cập nhật nhóm khách hàng');
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
              Chỉnh sửa Nhóm Khách Hàng: {customer_groupData?.nhom_khach_hang || customer_groupId}
            </h2>
            <Form form={form} layout="vertical" onFinish={onFinish} className="edit-form">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="ma_nhom_khach_hang" label="Mã nhóm khách hàng" rules={[{ required: true }]}>
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="nhom_khach_hang" label="Nhóm khách hàng" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="nguoi_cap_nhat" label="Người cập nhật" rules={[{ required: true }]}>
                    <Select disabled>
                      {accounts.map(account => (
                        <Option key={account.ma_nguoi_dung} value={account.ma_nguoi_dung}>
                          {account.ho_va_ten}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="ngay_cap_nhat" label="Ngày cập nhật" rules={[{ required: true }]}>
                    <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} disabled />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item name="mo_ta" label="Mô tả">
                <Input.TextArea rows={3} />
              </Form.Item>
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

export default EditCustomerGroup;
