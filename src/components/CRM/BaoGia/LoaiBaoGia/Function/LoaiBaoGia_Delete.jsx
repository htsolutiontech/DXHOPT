import React, { useEffect, useState } from 'react';
import { Modal, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { deleteItemById } from '../../../../utils/api/requestHelpers';

const { confirm } = Modal;

const RemoveQuotationType = ({ quotation_typeId, quotation_typeName, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteItemById(`https://dx.hoangphucthanh.vn:3000/crm/quotation-types/${quotation_typeId}`);
      message.success('Xóa loại báo giá thành công!');
      onSuccess?.();                                                                                                                                                                                                                                                                                                                                                                                      
    } catch (error) {
      console.error('Lỗi khi xóa:', error);
      message.error(`Không thể xóa loại báo giá: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const showDeleteConfirm = () => {
    confirm({
      title: 'Xác nhận xóa loại báo giá',
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc chắn muốn xóa loại báo giá "${quotation_typeName}" không?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: handleDelete,
      onCancel,
    });
  };

  useEffect(() => {
    if (quotation_typeId && quotation_typeName) {
      showDeleteConfirm();
    }
  }, [quotation_typeId, quotation_typeName]);

  return null;
};

export default RemoveQuotationType;
