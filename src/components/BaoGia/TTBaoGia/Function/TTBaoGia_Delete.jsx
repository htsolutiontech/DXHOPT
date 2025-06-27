import React, { useEffect, useState } from 'react';
import { Modal, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { deleteItemById } from '../../../utils/api/requestHelpers';

const { confirm } = Modal;

const RemoveQuotationStatus = ({ quotation_statusId, quotation_statusName, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteItemById(`https://dx.hoangphucthanh.vn:3000/crm/quotation-statuses/${quotation_statusId}`);
      message.success('Xóa trạng thái báo giá thành công!');
      onSuccess?.();                                                                                                                                                                                                                                                                                                                                                                                      
    } catch (error) {
      console.error('Lỗi khi xóa:', error);
      message.error(`Không thể xóa trạng thái báo giá: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const showDeleteConfirm = () => {
    confirm({
      title: 'Xác nhận xóa trạng thái báo giá',
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc chắn muốn xóa trạng thái báo giá "${quotation_statusName}" không?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: handleDelete,
      onCancel,
    });
  };

  useEffect(() => {
    if (quotation_statusId && quotation_statusName) {
      showDeleteConfirm();
    }
  }, [quotation_statusId, quotation_statusName]);

  return null;
};

export default RemoveQuotationStatus;
