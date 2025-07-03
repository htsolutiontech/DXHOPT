import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Button, Card, message, Select, DatePicker, Spin, Row, Col } from 'antd';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { dayjs } from '../../../../utils/format/dayjs-config';
import { fetchDataList, updateItemById } from '../../../../utils/api/requestHelpers';
import { getVietnamProvinces } from '../../../../utils/format/location';
import { fetchAndSetList } from '../../../../utils/api/fetchHelpers';
import '../../../../utils/css/Custom-Update.css';

const { Option } = Select;

const EditPotentialCustomer = ({ potential_customerId, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [potentialcustomerData, setPotentialCustomerData] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [sources, setSources] = useState([]);
  const [customer_groups, setCustomer_Groups] = useState([]);

  // Lấy user hiện tại từ localStorage
  const currentUser = JSON.parse(localStorage.getItem('userData') || '{}');

  useEffect(() => {
    if (potential_customerId) fetchCustomerData(potential_customerId);
    fetchAndSetList('https://dx.hoangphucthanh.vn:3000/warehouse/accounts', setAccounts, 'Không thể tải danh sách người dùng');
    fetchAndSetList('https://dx.hoangphucthanh.vn:3000/crm/opportunity-sources', setSources, 'Không thể tải danh sách nguồn cơ hội');
    fetchAndSetList('https://dx.hoangphucthanh.vn:3000/crm/customer-groups', setCustomer_Groups, 'Không thể tải danh sách nhóm khách hàng tiềm năng tiềm năng');
  }, [potential_customerId]);

  const fetchCustomerData = async (id) => {
    setFetchLoading(true);
    try {
      const allPotentialCustomers = await fetchDataList('https://dx.hoangphucthanh.vn:3000/crm/potential-customers');
      const potential_customer = allPotentialCustomers.find(item => item.ma_khach_hang_tiem_nang === id);
      if (!potential_customer) throw new Error(`Không tìm thấy khách hàng tiềm năng với mã: ${id}`);
      // Gán luôn người cập nhật là user hiện tại
      potential_customer.nguoi_phu_trach = currentUser?.ma_nguoi_dung || undefined;

      setPotentialCustomerData(potential_customer);
      form.setFieldsValue({
        ...potential_customer,
        ngay_lien_lac_tiep_theo: potential_customer.ngay_lien_lac_tiep_theo ? dayjs(potential_customer.ngay_lien_lac_tiep_theo) : null,
        ngay_them_vao: potential_customer.ngay_them_vao ? dayjs(potential_customer.ngay_them_vao) : null,
      });      
      message.success(`Đã tải thông tin khách hàng tiềm năng: ${potential_customer.ten_khach_hang}`);
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
        ngay_them_vao: values.ngay_them_vao?.format('YYYY-MM-DD'),
        ngay_lien_lac_tiep_theo: values.ngay_lien_lac_tiep_theo?.format('YYYY-MM-DD'),
      };

      console.log('🚀 Payload gửi đi:', payload);
      
      const response = await updateItemById(`https://dx.hoangphucthanh.vn:3000/crm/potential-customers/${potential_customerId}`, payload);

      console.log('📦 Kết quả cập nhật:', response);

      // Kiểm tra nếu response là lỗi
      if (response && response.status && response.status >= 400) {
        throw new Error('Cập nhật thất bại từ server');
      }
      
      message.success('Cập nhật khách hàng tiềm năng thành công!');
      onSuccess?.();
    } catch (error) {
      console.error('Lỗi cập nhật:', error);
      message.error('Không thể cập nhật khách hàng tiềm năng');
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
            Chỉnh sửa Khách Hàng Tiềm Năng: {potentialcustomerData?.ten_khach_hang || potential_customerId}
          </h2>
          <Form form={form} layout="vertical" onFinish={onFinish} className="edit-form">
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="ma_khach_hang_tiem_nang" label="Mã khách hàng tiềm năng tiềm năng" rules={[{ required: true }]}>
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col span={16}>
                <Form.Item name="ten_khach_hang" label="Tên khách hàng tiềm năng" 
                  rules={[
                    { required: true, message: 'Tên khách hàng tiềm năng tiềm năng không được để trống' },
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
              <Col span={8}>
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
              <Col span={8}>
                <Form.Item name="hanh_dong_tiep_theo" label="Hành động tiếp theo" >
                  <Select>
                      <Option value="Gửi email Marketing">Gửi email Marketing</Option>
                      <Option value="Mời tham gia sự kiện">Mời tham gia sự kiện</Option>
                      <Option value="Hẹn gặp tư vấn trực tiếp">Hẹn gặp tư vấn trực tiếp</Option>
                      <Option value="Gọi điện xác nhận nhu cầu">Gọi điện xác nhận nhu cầu</Option>
                      <Option value="Theo dõi phản hồi từ khách hàng tiềm năng">Theo dõi phản hồi từ khách hàng tiềm năng</Option>
                      <Option value="Gửi báo giá">Gửi báo giá</Option>
                      <Option value="Demo sản phẩm">Demo sản phẩm</Option>
                      <Option value="Đàm phán hợp đồng">Đàm phán hợp đồng</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="ngay_lien_lac_tiep_theo" label="Ngày liên lạc tiếp theo" >
                  <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="so_lan_da_lien_lac" label="Số lần đã liên lạc" rules={[{ required: true }]}>
                  <InputNumber style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="muc_dich" label="Mục đích" >
                  <Select>
                      <Option value="Thuyết phục khách hàng tiềm năng ra quyết định">Thuyết phục khách hàng tiềm năng ra quyết định</Option>
                      <Option value="Giới thiệu sản phẩm mới">Giới thiệu sản phẩm mới</Option>
                      <Option value="Tạo niềm tin và giải thích lợi ích">Tạo niềm tin và giải thích lợi ích</Option>
                      <Option value="Chốt đơn hàng và ký hợp đồng">Chốt đơn hàng và ký hợp đồng</Option>
                      <Option value="Xác nhận ngân sách & khả năng mua hàng">Xác nhận ngân sách & khả năng mua hàng</Option>
                      <Option value="Khám phá nhu cầu khách hàng tiềm năng">Khám phá nhu cầu khách hàng tiềm năng</Option>
                      <Option value="Định hướng giải pháp cụ thể">Định hướng giải pháp cụ thể</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="nhom_khach_hang" label="Nhóm khách hàng tiềm năng" rules={[{ required: true }]}>
                  <Select showSearch optionFilterProp="children" placeholder="Chọn nhóm khách hàng tiềm năng">
                    {customer_groups.map(customer_group => (
                      <Option key={customer_group.ma_nhom_khach_hang} value={customer_group.ma_nhom_khach_hang}>
                        {customer_group.nhom_khach_hang}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="nguon_tiep_can" label="Nguồn tiếp cận" rules={[{ required: true }]}>
                  <Select showSearch optionFilterProp="children" placeholder="Chọn nguồn tiếp cận">
                    {sources.map(source => (
                      <Option key={source.ma_nguon} value={source.ma_nguon}>
                        {source.nguon}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="tinh_trang" label="Tình trạng" rules={[{ required: true }]}>
                  <Select>
                      <Option value="Tích cực">Tích cực</Option>
                      <Option value="Bình thường">Bình thường</Option>
                      <Option value="Khó chịu">Khó chịu</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="ngay_them_vao" label="Ngày thêm" rules={[{ required: true }]}>
                  <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="email" label="Email" >
                  <Input type="email" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="so_dien_thoai" label="SĐT" >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="tinh_thanh" label="Tỉnh thành">
                  <Select showSearch optionFilterProp="children" placeholder="Chọn tỉnh thành">
                    {getVietnamProvinces().map(province => (
                      <Option key={province} value={province}>{province}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="website" label="Website">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="dia_chi_cu_the" label="Địa chỉ cụ thể">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="ghi_chu" label="Ghi chú">
              <Input.TextArea rows={3} />
            </Form.Item>
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

export default EditPotentialCustomer;
