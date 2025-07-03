
import React, { useState, useEffect } from "react";
import { createWarehouse, getWarehouses, getAccountList } from "./khoHangApi";
import { Modal, Form, Input, Button, Select, message, DatePicker } from "antd";
import dayjs from "dayjs/esm/index.js";

const { Option } = Select;

const init = {
  ma_kho: "",
  ten_kho: "",
  vi_tri_kho: "",
  tinh_trang: "Đang hoạt động",
  quan_ly_kho: "", // sẽ là MaNguoiDung của người quản lý kho
  ngay_kiem_ke_gan_nhat: "",
  tong_gia_tri_nhap: 0,
  tong_gia_tri_xuat: 0,
  tong_gia_tri_ton_kho: 0,
  ghi_chu: "",
  hinh_anh: "", // đường dẫn hoặc base64 ảnh
};


function getNextMaKho(list) {
  const arr = list.map((kho) => kho.ma_kho || "").filter(Boolean);
  if (!arr.length) return "K01";
  const numbers = arr.map((ma) => Number(ma.replace(/[^\d]/g, "")) || 0);
  const max = Math.max(...numbers);
  return `K${(max + 1).toString().padStart(2, "0")}`;
}

export default function KhoHang_Add({ open, onSuccess, onCancel }) {
  const [form, setForm] = useState(init);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({ ho_va_ten: "", ma_nguoi_dung: "" });
  const [accounts, setAccounts] = useState([]);
  const [previewImg, setPreviewImg] = useState("");
  const [antdForm] = Form.useForm();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userData") || "{}");
    setUser({
      ho_va_ten: storedUser.ho_va_ten || storedUser.TenDayDu || "",
      ma_nguoi_dung: storedUser.ma_nguoi_dung || storedUser.MaNguoiDung || "",
    });

    async function fetchAndSet() {
      setLoading(true);
      try {
        const res = await getWarehouses();
        const list = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        const nextMaKho = getNextMaKho(list);
        setForm((prev) => ({ ...init, ma_kho: nextMaKho }));

        // Lấy danh sách user (Accounts)
        const resAcc = await getAccountList();
        const dataAcc = Array.isArray(resAcc.data?.data) ? resAcc.data.data : [];
        setAccounts(dataAcc);
      } finally {
        setLoading(false);
      }
    }
    fetchAndSet();
  }, []);

  useEffect(() => {
    if (open) {
      antdForm.setFieldsValue({
        ...form,
        ngay_kiem_ke_gan_nhat: form.ngay_kiem_ke_gan_nhat
          ? dayjs(form.ngay_kiem_ke_gan_nhat, ["YYYY-MM-DD", "DD/MM/YYYY"])
          : null,
      });
    } else {
      antdForm.resetFields();
    }
  }, [form, open, antdForm]);

  const handleFinish = async (values) => {
    if (!values.quan_ly_kho) {
      message.error("Vui lòng chọn người quản lý kho!");
      return;
    }
    const body = {
      ...form,
      ...values,
      nguoi_tao: user.ma_nguoi_dung,
      ngay_tao: dayjs().format("DD/MM/YYYY"),
      ngay_kiem_ke_gan_nhat: values.ngay_kiem_ke_gan_nhat
        ? dayjs(values.ngay_kiem_ke_gan_nhat).format("DD/MM/YYYY")
        : undefined,
      tong_gia_tri_nhap: Number(values.tong_gia_tri_nhap) || 0,
      tong_gia_tri_xuat: Number(values.tong_gia_tri_xuat) || 0,
      tong_gia_tri_ton_kho: Number(values.tong_gia_tri_ton_kho) || 0,
    };
    setLoading(true);
    try {
      await createWarehouse(body);
      message.success("Thêm kho thành công!");
      onSuccess();
    } catch (err) {
      if (err.response) {
        message.error("Lỗi: " + (err.response.data?.message || "Không thể thêm kho"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} footer={null} onCancel={onCancel} title="Thêm kho mới" width={600}>
      <Form
        form={antdForm}
        layout="vertical"
        initialValues={{ ...form, ngay_kiem_ke_gan_nhat: form.ngay_kiem_ke_gan_nhat ? dayjs(form.ngay_kiem_ke_gan_nhat, ["YYYY-MM-DD", "DD/MM/YYYY"]) : null }}
        onFinish={handleFinish}
      >
        <Form.Item label="Mã kho" name="ma_kho" initialValue={form.ma_kho} rules={[{ required: true }]}>
          <Input disabled />
        </Form.Item>
        <Form.Item label="Tên kho" name="ten_kho" rules={[{ required: true, message: "Vui lòng nhập tên kho" }]}> 
          <Input />
        </Form.Item>
        <Form.Item label="Vị trí kho" name="vi_tri_kho" rules={[{ required: true, message: "Vui lòng nhập vị trí kho" }]}> 
          <Input />
        </Form.Item>
        <Form.Item label="Tình trạng" name="tinh_trang" initialValue={form.tinh_trang} rules={[{ required: true }]}> 
          <Select>
            <Option value="Đang hoạt động">Đang hoạt động</Option>
            <Option value="Bảo trì">Bảo trì</Option>
          </Select>
        </Form.Item>
        <Form.Item label="Người tạo">
          <Input value={user.ho_va_ten} disabled />
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
              <Option key={acc.ma_nguoi_dung} value={acc.ma_nguoi_dung}>{acc.ho_va_ten}</Option>
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
          <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 8 }}>
            Thêm
          </Button>
          <Button onClick={onCancel} disabled={loading}>
            Hủy
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
