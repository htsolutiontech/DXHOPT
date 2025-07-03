import React, { useEffect, useState } from 'react';
import { Modal, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { deleteItemById } from '../../../../utils/api/requestHelpers';

const { confirm } = Modal;

const RemoveSource = ({ sourceId, sourceName, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteItemById(`https://dx.hoangphucthanh.vn:3000/crm/opportunity-sources/${sourceId}`);
      message.success('Xóa nguồn cơ hội thành công!');
      onSuccess?.();
    } catch (error) {
      console.error('Lỗi khi xóa:', error);
      message.error(`Không thể xóa nguồn cơ hội: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const showDeleteConfirm = () => {
    confirm({
      title: 'Xác nhận xóa nguồn cơ hội',
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc chắn muốn xóa nguồn cơ hội "${sourceName}" không?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: handleDelete,
      onCancel,
    });
  };

  useEffect(() => {
    if (sourceId && sourceName) {
      showDeleteConfirm();
    }
  }, [sourceId, sourceName]);

  return null;
};

export default RemoveSource;
