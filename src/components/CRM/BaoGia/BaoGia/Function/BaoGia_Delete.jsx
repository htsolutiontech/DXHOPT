import React, { useEffect, useState } from 'react';
import { Modal, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { deleteItemById } from '../../../../utils/api/requestHelpers';

const { confirm } = Modal;

const RemoveQuotation = ({ quotationId, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteItemById(`https://dx.hoangphucthanh.vn:3000/crm/quotations/${quotationId}`);
      message.success('Xóa báo giá thành công!');
      onSuccess?.();
    } catch (error) {
      console.error('Lỗi khi xóa:', error);
      message.error(`Không thể xóa báo giá: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const showDeleteConfirm = () => {
    confirm({
      title: 'Xác nhận xóa báo giá',
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc chắn muốn xóa báo giá "${quotationId}" không?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: handleDelete,
      onCancel,
    });
  };

  useEffect(() => {
    if (quotationId) {
      showDeleteConfirm();
    }
  }, [quotationId]);

  return null;
};

export default RemoveQuotation;
