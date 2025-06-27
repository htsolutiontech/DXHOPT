import { Modal, message } from 'antd';

export const resetNhapKhoDatabase = async () => {
  return new Promise((resolve, reject) => {
    Modal.confirm({
      title: 'Xác nhận khởi tạo lại dữ liệu',
      content: 'Thao tác này sẽ xóa toàn bộ dữ liệu các bảng liên quan. Bạn có chắc chắn muốn tiếp tục?',
      okText: 'Đồng ý',
      cancelText: 'Hủy',
      async onOk() {
        try {
          const response = await fetch('https://dx.hoangphucthanh.vn:3000/warehouse/database', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ confirmReset: 'CONFIRM_DELETE_ALL_DATA' }),
          });
          if (!response.ok) throw new Error('Lỗi xóa dữ liệu: ' + response.status);
          message.success('Đã khởi tạo lại dữ liệu thành công!');
          resolve(true);
        } catch (error) {
          message.error('Khởi tạo dữ liệu thất bại: ' + error.message);
          reject(error);
        }
      },
      onCancel() {
        resolve(false);
      },
    });
  });
};