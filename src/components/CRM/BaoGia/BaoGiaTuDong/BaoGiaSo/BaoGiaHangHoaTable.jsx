import React, { useState, useEffect } from 'react';
import { Table, Button, Select, InputNumber, message, Input } from 'antd';
import { getCountryName } from '../../../../utils/convert/countryCodes';
import { getUnitName } from '../../../../utils/convert/unitCodes';
import { calcDonGia, MoTaCell, SoLuongCell, ImageCell } from './HangHoa/hangHoaHelpers';
import { fetchAndSetList } from '../../../../utils/api/fetchHelpers';
import { UploadOutlined } from '@ant-design/icons';
import BaoGiaSo_Import from './Function/BaoGiaSo_Import';
import '../../../../utils/css/Custom-Button.css';

const { Option } = Select;

const BaoGiaHangHoaTable = ({
  thongTin,
  heSo,
  hangHoa,
  setHangHoa
}) => {
  const [products, setProducts] = useState([]);
  const [importOpen, setImportOpen] = useState(false);

  // Lấy danh sách sản phẩm
  useEffect(() => {
    fetchAndSetList(
      'https://dx.hoangphucthanh.vn:3000/warehouse/products',
      (data) => {
        const arr = Array.isArray(data)
          ? data
          : Array.isArray(data.data)
            ? data.data
            : [];
        setProducts(arr);
      },
      'Không thể tải danh sách hàng hóa'
    );
  }, []);

  // Lọc sản phẩm theo price_list đã chọn
  const filteredProducts = thongTin.price_list
    ? products.filter(p => p.price_list === thongTin.price_list)
    : [];

  // Thêm sản phẩm vào bảng
  const handleAddProduct = (ma_hang) => {
    // Lấy đúng sản phẩm theo mã hàng và price list đã chọn
    const prod = products.find(
      p => p.ma_hang === ma_hang && p.price_list === thongTin.price_list
    );
    if (!prod) return;
    if (hangHoa.some(h => h.ma_hang === ma_hang)) {
      message.warning('Mã hàng đã có trong bảng!');
      return;
    }
    // Giá trị mặc định
    const ty_le_thue_gtgt = 0.05;
    const ty_le_thue_nk = 0;
    const chiet_khau = 0;
    const so_luong = 1;
    const don_gia = calcDonGia(prod.gia_thuc, heSo, ty_le_thue_nk, ty_le_thue_gtgt, chiet_khau);
    const thanh_tien = don_gia * so_luong;
    const thue_gtgt = thanh_tien * ty_le_thue_gtgt;
    const tong_cong = thanh_tien + thue_gtgt;

    setHangHoa([
      ...hangHoa,
      {
        mo_ta: prod.mo_ta,
        ma_hang: prod.ma_hang,
        don_vi_ban_hang: prod.don_vi_ban_hang,
        hang_chu_so_huu: prod.suppliers?.ten_nha_cung_cap || prod.ten_nha_cung_cap || '',
        nuoc_xuat_xu: prod.nuoc_xuat_xu,
        gia_thuc: prod.gia_thuc,
        so_luong,
        don_gia,
        thanh_tien,
        thue_gtgt,
        tong_cong,
        ty_le_thue_gtgt,
        ty_le_thue_nk,
        chiet_khau,
      },
    ]);
  };

  // Xử lý thay đổi các trường mới
  const handleChange = (key, value, record) => {
    setHangHoa(
      hangHoa.map(h =>
        h.ma_hang === record.ma_hang
          ? { ...h, [key]: value }
          : h
      )
    );
  };

  // Xóa dòng
  const handleRemove = (ma_hang) => {
    setHangHoa(hangHoa.filter(h => h.ma_hang !== ma_hang));
  };

  // Tính toán lại khi số lượng, hệ số, thuế, chiết khấu thay đổi
  useEffect(() => {
    setHangHoa(
      hangHoa.map(h => {
        const so_luong = Number(h.so_luong) || 0;
        const ty_le_thue_nk = Number(h.ty_le_thue_nk) || 0;
        const ty_le_thue_gtgt = Number(h.ty_le_thue_gtgt) || 0.05;
        const chiet_khau = Number(h.chiet_khau) || 0;
        const gia_thuc = Number(h.gia_thuc) || 0;

        const don_gia = calcDonGia(gia_thuc, heSo, ty_le_thue_nk, ty_le_thue_gtgt, chiet_khau);
        const thanh_tien = don_gia * so_luong;
        const thue_gtgt = thanh_tien * ty_le_thue_gtgt;
        const tong_cong = thanh_tien + thue_gtgt;

        return { ...h, don_gia, thanh_tien, thue_gtgt, tong_cong };
      })
    );
    // eslint-disable-next-line
  }, [
    heSo,
    hangHoa.length,
    JSON.stringify(hangHoa.map(h => [h.so_luong, h.ty_le_thue_nk, h.ty_le_thue_gtgt, h.chiet_khau]))
  ]);

  // Hàm xử lý khi import thành công
  const handleImport = (importRows) => {
    const newRows = importRows
      .map(row => {
        const prod = products.find(
          p => p.ma_hang === row.ma_hang && p.price_list === thongTin.price_list
        );
        if (!prod) return null;
        const ty_le_thue_gtgt = 0.05;
        const ty_le_thue_nk = 0;
        const chiet_khau = 0;
        const so_luong = Number(row.so_luong);
        const don_gia = calcDonGia(prod.gia_thuc, heSo, ty_le_thue_nk, ty_le_thue_gtgt, chiet_khau);
        const thanh_tien = don_gia * so_luong;
        const thue_gtgt = thanh_tien * ty_le_thue_gtgt;
        const tong_cong = thanh_tien + thue_gtgt;
        return {
          mo_ta: prod.mo_ta,
          ma_hang: prod.ma_hang,
          don_vi_ban_hang: prod.don_vi_ban_hang,
          hang_chu_so_huu: prod.suppliers?.ten_nha_cung_cap || prod.ten_nha_cung_cap || '',
          nuoc_xuat_xu: prod.nuoc_xuat_xu,
          gia_thuc: prod.gia_thuc,
          so_luong,
          don_gia,
          thanh_tien,
          thue_gtgt,
          tong_cong,
          ty_le_thue_gtgt,
          ty_le_thue_nk,
          chiet_khau,
        };
      })
      .filter(Boolean);
    setHangHoa([...hangHoa, ...newRows]);
  };

  // Định nghĩa các cột của bảng
  const columns = [
    {
      title: 'STT',
      dataIndex: 'stt',
      width: '3%',
      render: (_, __, idx) => idx + 1
    },
    {
      title: 'Mô tả',
      dataIndex: 'ma_hang',
      width: '15%',
      render: maHang => <MoTaCell maHang={maHang} />
    },
    {
      title: 'Mã hàng',
      dataIndex: 'ma_hang',
      width: '5%'
    },
    {
      title: 'SL',
      dataIndex: 'so_luong',
      width: '5%',
      render: (value, record) => (
        <SoLuongCell
          value={value}
          maHang={record.ma_hang}
          onChange={val => handleChange('so_luong', val, record)}
        />
      )
    },
    {
      title: 'ĐVT',
      dataIndex: 'don_vi_ban_hang',
      width: '3%',
      render: (value, record) => (
        <Input
          className="custom-input"
          value={getUnitName(value) || value || ''}
          onChange={e => handleChange('don_vi_ban_hang', e.target.value, record)}
          placeholder="Nhập ĐVT"
        />
      )
    },
    {
      title: 'Hãng chủ sở hữu',
      dataIndex: 'hang_chu_so_huu',
      width: '5%'
    },
    {
      title: 'Xuất xứ',
      dataIndex: 'nuoc_xuat_xu',
      width: '5%',
      render: (value, record) => (
        <Input
          className="custom-input"
          value={getCountryName(value) || value || ''}
          onChange={e => handleChange('nuoc_xuat_xu', e.target.value, record)}
          placeholder="Nhập xuất xứ"
        />
      )
    },
    {
      title: 'Đơn giá',
      dataIndex: 'don_gia',
      width: '5%',
      render: val => val?.toLocaleString()
    },
    {
      title: 'Thành tiền',
      dataIndex: 'thanh_tien',
      width: '6%',
      render: val => val?.toLocaleString()
    },
    {
      title: 'Thuế GTGT',
      dataIndex: 'thue_gtgt',
      width: '6%',
      render: val => val?.toLocaleString()
    },
    {
      title: 'Tổng cộng',
      dataIndex: 'tong_cong',
      width: '6%',
      render: val => val?.toLocaleString()
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'ma_hang',
      width: '10%',
      render: (ma_hang) => (
        <div
          style={{
            width: '100%',
            height: 48,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center'
          }}
        >
          <ImageCell ma_hang={ma_hang} />
        </div>
      )
    },
    {
      title: 'Hành động',
      dataIndex: 'action',
      width: '5%',
      render: (_, record) => (
        <Button
          danger
          size="small"
          style={{
            padding: '0 8px',
            height: 20,
            fontSize: 10,
            lineHeight: '18px'
          }}
          onClick={() => handleRemove(record.ma_hang)}
        >
          Xóa
        </Button>
      )
    },
    {
      title: 'Tỷ lệ Thuế GTGT',
      dataIndex: 'ty_le_thue_gtgt',
      width: '7%',
      render: (value, record) => (
        <Select
          value={value}
          style={{
            width: 48,
            height: 20,
            fontSize: 9,
            textAlign: 'center'
          }}
          dropdownStyle={{ fontSize: 12 }}
          onChange={val => handleChange('ty_le_thue_gtgt', val, record)}
          getPopupContainer={trigger => trigger.parentNode}
        >
          <Option value={0.05}>5%</Option>
          <Option value={0.08}>8%</Option>
          <Option value={0.1}>10%</Option>
        </Select>
      )
    },
    {
      title: 'Tỷ lệ Thuế NK',
      dataIndex: 'ty_le_thue_nk',
      width: '7%',
      render: (value, record) => (
        <Select
          value={value}
          style={{
            width: 48,
            height: 20,
            fontSize: 9,
            textAlign: 'center'
          }}
          dropdownRender={menu => (
            <div style={{ maxHeight: 80, overflowY: 'auto' }}>
              {menu}
            </div>
          )}
          onChange={val => handleChange('ty_le_thue_nk', val, record)}
          getPopupContainer={trigger => trigger.parentNode}
        >
          <Option value={0}>0%</Option>
          <Option value={0.07}>7%</Option>
          <Option value={0.1}>10%</Option>
          <Option value={0.12}>12%</Option>
          <Option value={0.15}>15%</Option>
          <Option value={0.2}>20%</Option>
          <Option value={0.25}>25%</Option>
        </Select>
      )
    },
    {
      title: 'Chiết khấu',
      dataIndex: 'chiet_khau',
      width: '7%',
      render: (value, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <InputNumber
            min={0}
            max={100}
            value={value * 100}
            formatter={v => `${v}`}
            parser={v => v.replace('%', '')}
            onChange={val => handleChange('chiet_khau', (Number(val) || 0) / 100, record)}
            style={{ width: 32, height: 20, fontSize: 9 }}
          />
          <span style={{ marginLeft: 4, fontSize: 9, whiteSpace: 'nowrap' }}>%</span>
        </div>
      )
    }
  ];

  return (
    <div className="bao-gia-scroll-wrapper">
      <div style={{ width: 1800 }}>
        {/* Thanh chọn mã hàng và Import Excel */}
        <div
          style={{
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 4
          }}
        >
          <Select
            showSearch
            placeholder="Chọn mã hàng để thêm"
            style={{ width: 450, height: 35, marginRight: 4 }}
            onSelect={handleAddProduct}
            filterOption={(input, option) =>
              option.value.toLowerCase().includes(input.toLowerCase())
            }
          >
            {filteredProducts.map(p => (
              <Select.Option key={p.ma_hang} value={p.ma_hang}>
                {p.ma_hang} ( {p.ten_hang} )
              </Select.Option>
            ))}
          </Select>
          <div className="button-level1">
            <Button
              icon={<UploadOutlined />}
              onClick={() => setImportOpen(true)}
              className="ant-btn"
              style={{ marginLeft: 4 }}
            >
              Import Excel
            </Button>
          </div>
          <BaoGiaSo_Import
            open={importOpen}
            onClose={() => setImportOpen(false)}
            onImport={handleImport}
            priceList={thongTin.price_list}
            existingHangHoa={hangHoa}
          />
        </div>
        {/* Tổng tiền, thuế, tổng cộng */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: 32,
            marginBottom: 8
          }}
        >
          <div style={{ fontWeight: 700 }}>
            Tổng Tiền:{' '}
            <span style={{ fontWeight: 700 }}>
              {hangHoa.reduce((sum, h) => sum + (h.thanh_tien || 0), 0).toLocaleString()}
            </span>
          </div>
          <div style={{ fontWeight: 700 }}>
            Tổng Thuế GTGT:{' '}
            <span style={{ fontWeight: 700 }}>
              {hangHoa.reduce((sum, h) => sum + (h.thue_gtgt || 0), 0).toLocaleString()}
            </span>
          </div>
          <div style={{ fontWeight: 700, color: 'red' }}>
            Tổng Cộng:{' '}
            <span style={{ fontWeight: 700 }}>
              {hangHoa.reduce((sum, h) => sum + (h.tong_cong || 0), 0).toLocaleString()}
            </span>
          </div>
        </div>
        {/* Bảng dữ liệu */}
        <Table
          columns={columns}
          dataSource={hangHoa}
          rowKey="ma_hang"
          pagination={false}
          bordered
          scroll={{ x: 1500 }}
          size="small"
        />
      </div>
    </div>
  );
};

export default BaoGiaHangHoaTable;