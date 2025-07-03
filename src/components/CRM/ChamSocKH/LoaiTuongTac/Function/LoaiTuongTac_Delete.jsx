import React, { useEffect, useState } from 'react';
import { Modal, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { deleteItemById } from '../../../../utils/api/requestHelpers';

const { confirm } = Modal;

const RemoveInteractionType = ({ interaction_typeId, interaction_typeName, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteItemById(`https://dx.hoangphucthanh.vn:3000/crm/interaction-types/${interaction_typeId}`);
      message.success('Xóa loại tương tác thành công!');
      onSuccess?.();
    } catch (error) {
      console.error('Lỗi khi xóa:', error);
      message.error(`Không thể xóa loại tương tác: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const showDeleteConfirm = () => {
    confirm({
      title: 'Xác nhận xóa loại tương tác',
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc chắn muốn xóa loại tương tác "${interaction_typeName}" không?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: handleDelete,
      onCancel,
    });
  };

  useEffect(() => {
    if (interaction_typeId && interaction_typeName) {
      showDeleteConfirm();
    }
  }, [interaction_typeId, interaction_typeName]);

  return null;
};

export default RemoveInteractionType;
