import React, { useEffect, useState } from 'react';
import { Modal, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { deleteItemById } from '../../../../utils/api/requestHelpers';

const { confirm } = Modal;

const RemovePotentialCustomer = ({ potential_customerId, potential_customerName, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteItemById(`https://dx.hoangphucthanh.vn:3000/crm/potential-customers/${potential_customerId}`);
      message.success('Xóa khách hàng tiềm năng thành công!');
      onSuccess?.();
    } catch (error) {
      console.error('Lỗi khi xóa:', error);
      message.error(`Không thể xóa khách hàng tiềm năng: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const showDeleteConfirm = () => {
    confirm({
      title: 'Xác nhận xóa khách hàng tiềm năng',
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc chắn muốn xóa khách hàng tiềm năng "${potential_customerName}" không?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: handleDelete,
      onCancel,
    });
  };

  useEffect(() => {
    if (potential_customerId && potential_customerName) {
      showDeleteConfirm();
    }
  }, [potential_customerId, potential_customerName]);

  return null;
};

export default RemovePotentialCustomer;
