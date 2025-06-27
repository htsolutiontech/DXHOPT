import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, message, Select, DatePicker, Spin, Row, Col } from 'antd';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import moment from 'moment';
import { fetchDataList, updateItemById } from '../../../utils/api/requestHelpers';
import { fetchAndSetList } from '../../../utils/api/fetchHelpers';
import '../../../utils/css/Custom-Update.css';

const { Option } = Select;

const EditQuotationType = ({ quotation_typeId, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [quotation_typeData, setQuotationTypeData] = useState(null);
  const [accounts, setAccounts] = useState([]);

  // Lấy user hiện tại từ localStorage
  const currentUser = JSON.parse(localStorage.getItem('userData') || '{}');

  useEffect(() => {
    if (quotation_typeId) fetchQuotationTypeData(quotation_typeId);
    fetchAndSetList('https://dx.hoangphucthanh.vn:3000/warehouse/accounts', setAccounts, 'Không thể tải danh sách người dùng');
  }, [quotation_typeId]);

  const fetchQuotationTypeData = async (id) => {
    setFetchLoading(true);
    try {
      const allQuotationTypes = await fetchDataList('https://dx.hoangphucthanh.vn:3000/crm/quotation-types');
      const quotation_type = allQuotationTypes.find(item => item.ma_loai_bao_gia === id);
      if (!quotation_type) throw new Error(`Không tìm thấy loại báo giá với mã: ${id}`);
      if (quotation_type.ngay_cap_nhat) quotation_type.ngay_cap_nhat = moment(quotation_type.ngay_cap_nhat);
      // Gán luôn người cập nhật là user hiện tại
      quotation_type.nguoi_cap_nhat = currentUser?.ma_nguoi_dung || undefined;
      setQuotationTypeData(quotation_type);
      form.setFieldsValue(quotation_type);
      message.success(`Đã tải thông tin loại báo giá: ${quotation_type.loai_bao_gia}`);
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

      const response = await updateItemById(`https://dx.hoangphucthanh.vn:3000/crm/quotation-types/${quotation_typeId}`, payload);

      console.log('📦 Kết quả cập nhật:', response);

      // Kiểm tra nếu response là lỗi
      if (response && response.status && response.status >= 400) {
        throw new Error('Cập nhật thất bại từ server');
      }

      message.success('Cập nhật loại báo giá thành công!');
      onSuccess?.();
    } catch (error) {
      console.error('❌ Lỗi cập nhật:', error);
      message.error('Không thể cập nhật loại báo giá');
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
              Chỉnh sửa Loại Báo Giá: {quotation_typeData?.loai_bao_gia || quotation_typeId}
            </h2>
            <Form form={form} layout="vertical" onFinish={onFinish} className="edit-form">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="ma_loai_bao_gia" label="Mã loại báo giá" rules={[{ required: true }]}>
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="loai_bao_gia" label="Tên loại báo giá" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="trang_thai" label="Trạng thái" rules={[{ required: true }]}>
                    <Select>
                      {['Hoạt động', 'Dừng'].map(status => (
                        <Option key={status} value={status}>{status}</Option>
                      ))}
                    </Select>
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

export default EditQuotationType;
