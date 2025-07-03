import React, { useState, useEffect } from "react";
import { updateWarehouse, getAccountList } from "./khoHangApi";
import { Modal, Form, Input, Button, Select, message, DatePicker } from "antd";
import dayjs from "dayjs/esm/index.js";


export default function KhoHang_Update({ data, onSuccess, onCancel, open }) {
  // DEBUG LOG: log props và form instance mỗi lần render
  console.log('KhoHang_Update render', { data, open });
  const [form, setForm] = useState(data || {});
  const [user, setUser] = useState({ ho_va_ten: "", ma_nguoi_dung: "" });
  const [accounts, setAccounts] = useState([]);
  const [antdForm] = Form.useForm();
  console.log('antdForm instance:', antdForm);

  useEffect(() => {
    console.log('useEffect [data]:', { data });
    setForm(data || {});
    const storedUser = JSON.parse(localStorage.getItem("userData") || "{}");
    setUser(storedUser);

    async function fetchAccounts() {
      try {
        const resAcc = await getAccountList();
        const dataAcc = (resAcc.data && resAcc.data.data) ? resAcc.data.data : [];
        setAccounts(dataAcc);
      } catch (err) {
        setAccounts([]);
      }
    }
    fetchAccounts();
  }, [data]);

useEffect(() => {
  if (open && data && antdForm) {
    setTimeout(() => {
      antdForm.resetFields();
      antdForm.setFieldsValue({
        ma_kho: data.ma_kho || '',
        ten_kho: data.ten_kho || '',
        vi_tri_kho: data.vi_tri_kho || '',
        tinh_trang: data.tinh_trang || '',
        quan_ly_kho: data.quan_ly_kho || data.accounts_warehouse_quan_ly_khoToaccounts?.ma_nguoi_dung || '',
        tong_gia_tri_nhap: data.tong_gia_tri_nhap || 0,
        tong_gia_tri_xuat: data.tong_gia_tri_xuat || 0,
        tong_gia_tri_ton_kho: data.tong_gia_tri_ton_kho || 0,
        ghi_chu: data.ghi_chu || '',
        ngay_kiem_ke_gan_nhat: data.ngay_kiem_ke_gan_nhat
          ? dayjs(data.ngay_kiem_ke_gan_nhat, ["YYYY-MM-DD", "DD/MM/YYYY"])
          : null,
        nguoi_tao: data.accounts_warehouse_nguoi_taoToaccounts?.ho_va_ten || data.nguoi_tao || '',
      });
    }, 0);
  }
  if (!open) {
    antdForm.resetFields();
  }
}, [data, open, antdForm]);

  const handleFinish = async (values) => {
    const body = {
      ...data,
      ...values,
      nguoi_tao: data.nguoi_tao,
      ngay_kiem_ke_gan_nhat: values.ngay_kiem_ke_gan_nhat
        ? dayjs(values.ngay_kiem_ke_gan_nhat).format("YYYY-MM-DD")
        : undefined,
    };
    try {
      await updateWarehouse(form.ma_kho, body);
      message.success("Cập nhật kho thành công!");
      onSuccess();
    } catch (err) {
      if (err.response) {
        message.error("Lỗi: " + (err.response.data?.message || "Không thể cập nhật kho"));
      }
    }
  };

  if (!open) return null;

  return (
    <Modal open={open} footer={null} onCancel={onCancel} title="Sửa kho" width={600}>
      <Form
        form={antdForm}
        layout="vertical"
        onFinish={handleFinish}
      >
        <Form.Item label="Mã kho" name="ma_kho" rules={[{ required: true }]}> 
          <Input disabled />
        </Form.Item>
        <Form.Item label="Tên kho" name="ten_kho" rules={[{ required: true, message: "Vui lòng nhập tên kho" }]}> 
          <Input />
        </Form.Item>
        <Form.Item label="Vị trí kho" name="vi_tri_kho" rules={[{ required: true, message: "Vui lòng nhập vị trí kho" }]}> 
          <Input />
        </Form.Item>
        <Form.Item label="Tình trạng" name="tinh_trang" rules={[{ required: true }]}> 
          <Select>
            <Select.Option value="Đang hoạt động">Đang hoạt động</Select.Option>
            <Select.Option value="Bảo trì">Bảo trì</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Người tạo" name="nguoi_tao">
          <Input disabled />
        </Form.Item>
        <Form.Item label="Quản lý kho" name="quan_ly_kho" rules={[{ required: true, message: "Vui lòng chọn quản lý kho" }]}> 
          <Select
            showSearch
            placeholder="Chọn quản lý kho"
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.children || "").toLowerCase().includes(input.toLowerCase())
            }
          >
            {accounts.map(acc => (
              <Select.Option key={acc.ma_nguoi_dung || acc.MaNguoiDung} value={acc.ma_nguoi_dung || acc.MaNguoiDung}>
                {acc.ho_va_ten || acc.TenDayDu}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Ngày kiểm kê gần nhất" name="ngay_kiem_ke_gan_nhat">
          <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} allowClear />
        </Form.Item>
        <Form.Item label="Tổng nhập" name="tong_gia_tri_nhap">
          <Input type="number" />
        </Form.Item>
        <Form.Item label="Tổng xuất" name="tong_gia_tri_xuat">
          <Input type="number" />
        </Form.Item>
        <Form.Item label="Tổng tồn kho" name="tong_gia_tri_ton_kho">
          <Input type="number" />
        </Form.Item>
        <Form.Item label="Ghi chú" name="ghi_chu">
          <Input.TextArea rows={2} />
        </Form.Item>
        {/* Ẩn phần chọn ảnh kho */}
        {/*
        <Form.Item label="Hình ảnh kho" name="hinh_anh">
          <Upload beforeUpload={() => false} maxCount={1} listType="picture">
            <Button icon={<UploadOutlined />}>Chọn ảnh kho</Button>
          </Upload>
        </Form.Item>
        */}
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
            Lưu
          </Button>
          <Button onClick={onCancel}>
            Hủy
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

