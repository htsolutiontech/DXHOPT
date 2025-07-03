import React, { useEffect, useState } from 'react';
import { Modal, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { deleteItemById } from '../../../../utils/api/requestHelpers';

const { confirm } = Modal;

const RemoveCustomerInteraction = ({ customer_interactionId, customer_interactionName, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteItemById(`https://dx.hoangphucthanh.vn:3000/crm/customer-interactions/${customer_interactionId}`);
      message.success('Xóa tương tác khách hàng thành công!');
      onSuccess?.();
    } catch (error) {
      console.error('Lỗi khi xóa:', error);
      message.error(`Không thể xóa tương tác khách hàng: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const showDeleteConfirm = () => {
    confirm({
      title: 'Xác nhận xóa tương tác khách hàng',
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc chắn muốn xóa tương tác khách hàng "${customer_interactionName}" không?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: handleDelete,
      onCancel,
    });
  };

  useEffect(() => {
    if (customer_interactionId && customer_interactionName) {
      showDeleteConfirm();
    }
  }, [customer_interactionId, customer_interactionName]);

  return null;
};

export default RemoveCustomerInteraction;
