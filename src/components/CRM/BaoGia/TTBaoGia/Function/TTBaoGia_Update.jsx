import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, message, Select, DatePicker, Spin, Row, Col } from 'antd';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import moment from 'moment';
import { fetchDataList, updateItemById } from '../../../../utils/api/requestHelpers';
import { fetchAndSetList } from '../../../../utils/api/fetchHelpers';
import '../../../../utils/css/Custom-Update.css';

const { Option } = Select;

const EditQuotationStatus = ({ quotation_statusId, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [quotation_statusData, setQuotationStatusData] = useState(null);
  const [accounts, setAccounts] = useState([]);

  // Lấy user hiện tại từ localStorage
  const currentUser = JSON.parse(localStorage.getItem('userData') || '{}');

  useEffect(() => {
    if (quotation_statusId) fetchQuotationStatusData(quotation_statusId);
    fetchAndSetList('https://dx.hoangphucthanh.vn:3000/warehouse/accounts', setAccounts, 'Không thể tải danh sách người dùng');
  }, [quotation_statusId]);

  const fetchQuotationStatusData = async (id) => {
    setFetchLoading(true);
    try {
      const allContractStatuses = await fetchDataList('https://dx.hoangphucthanh.vn:3000/crm/quotation-statuses');
      const quotation_status = allContractStatuses.find(item => item.ma_trang_thai_bao_gia === id);
      if (!quotation_status) throw new Error(`Không tìm thấy trạng thái báo giá với mã: ${id}`);
      if (quotation_status.ngay_cap_nhat) quotation_status.ngay_cap_nhat = moment(quotation_status.ngay_cap_nhat);
      // Gán luôn người cập nhật là user hiện tại
      quotation_status.nguoi_cap_nhat = currentUser?.ma_nguoi_dung || undefined;
      setQuotationStatusData(quotation_status);
      form.setFieldsValue(quotation_status);
      message.success(`Đã tải thông tin trạng thái báo giá: ${quotation_status.trang_thai_bao_gia}`);
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

      const response = await updateItemById(`https://dx.hoangphucthanh.vn:3000/crm/quotation-statuses/${quotation_statusId}`, payload);

      console.log('📦 Kết quả cập nhật:', response);

      // Kiểm tra nếu response là lỗi
      if (response && response.status && response.status >= 400) {
        throw new Error('Cập nhật thất bại từ server');
      }

      message.success('Cập nhật trạng thái báo giá thành công!');
      onSuccess?.();
    } catch (error) {
      console.error('❌ Lỗi cập nhật:', error);
      message.error('Không thể cập nhật trạng thái báo giá');
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
              Chỉnh sửa Trạng Thái Báo Giá: {quotation_statusData?.trang_thai_bao_gia || quotation_statusId}
            </h2>
            <Form form={form} layout="vertical" onFinish={onFinish} className="edit-form">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="ma_trang_thai_bao_gia" label="Mã trạng thái báo giá" rules={[{ required: true }]}>
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="trang_thai_bao_gia" label="Trạng thái báo giá" rules={[{ required: true }]}>
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

export default EditQuotationStatus;
