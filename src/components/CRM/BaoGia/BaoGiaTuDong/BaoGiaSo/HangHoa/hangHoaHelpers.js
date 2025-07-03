import React, { useState, useEffect } from 'react';
import { InputNumber } from 'antd';
import { getProductDescription } from '../../../../../utils/convert/productDescriptionsExcel';
import { getStockByMaHang } from '../../../../../utils/inventory/getStockByMaHang';

// Hàm tính giá và làm tròn
export function calcDonGia(gia_thuc, heSo, ty_le_thue_nk, ty_le_thue_gtgt, chiet_khau) {
  const gia_co_thue_nk = gia_thuc * (1 + ty_le_thue_nk);
  const base = roundToThousands((gia_co_thue_nk * heSo) / (1 + ty_le_thue_gtgt));
  const don_gia = roundToThousands(base * (1 + chiet_khau));
  return don_gia;
}
export function roundToThousands(num) {
  return Math.round(num / 1000) * 1000;
}

// Cell hiển thị mô tả sản phẩm
export const MoTaCell = ({ maHang }) => {
  const [moTa, setMoTa] = useState('');
  useEffect(() => {
    getProductDescription(maHang).then(setMoTa);
  }, [maHang]);
  return <span>{moTa}</span>;
};

// Cell nhập số lượng và hiển thị tồn kho
export const SoLuongCell = ({ value, maHang, onChange }) => {
  const [stock, setStock] = useState(null);
  useEffect(() => {
    getStockByMaHang(maHang).then(setStock);
  }, [maHang]);
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <InputNumber
        min={1}
        value={value}
        onChange={onChange}
        style={{ width: 32, height: 20, fontSize: 9 }}
      />
      {typeof stock === 'number' && (
        <span
          style={{
            color: 'red',
            fontWeight: 'bold',
            marginLeft: 4,
            fontSize: 9,
            whiteSpace: 'nowrap'
          }}
        >
          ({stock})
        </span>
      )}
    </div>
  );
};

// Cell hiển thị hình ảnh
export const ImageCell = ({ ma_hang }) => {
  const [imgType, setImgType] = useState('jpg');
  const [show, setShow] = useState(true);

  if (!ma_hang) return null;

  const handleError = () => {
    if (imgType === 'jpg') {
      setImgType('png');
    } else {
      setShow(false);
    }
  };

  if (!show) return null;

  return (
    <img
      src={`/image/HangHoa/${ma_hang}.${imgType}`}
      alt=""
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        background: '#fff',
        border: '1px solid #eee',
        borderRadius: 4,
        display: 'block'
      }}
      onError={handleError}
    />
  );
};