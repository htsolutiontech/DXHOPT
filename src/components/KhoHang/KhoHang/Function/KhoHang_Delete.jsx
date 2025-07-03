import React from "react";
import { Modal, Button, Typography } from "antd";
import { deleteWarehouse } from "./khoHangApi";

export default function KhoHang_Delete({ data, onSuccess, onCancel, open }) {
  const handleDelete = async () => {
    try {
      await deleteWarehouse(data.ma_kho);
      Modal.success({ content: "Đã xóa kho thành công!" });
      onSuccess();
    } catch {
      Modal.error({ content: "Lỗi khi xóa kho!" });
    }
  };

  if (!open) return null;
  if (!data) return null;
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      title="Xác nhận xoá kho"
    >
      <Typography.Text>Bạn chắc chắn muốn xoá kho <b>{data.ten_kho}</b>?</Typography.Text>
      <div style={{ marginTop: 24, textAlign: 'right' }}>
        <Button danger type="primary" onClick={handleDelete} style={{ marginRight: 8 }}>Xoá</Button>
        <Button onClick={onCancel}>Huỷ</Button>
      </div>
    </Modal>
  );
}

