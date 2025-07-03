export const getHeSoListByDoiTuong = (doiTuong) => {
  switch (doiTuong) {
    case 'Giá kế hoạch':
      return [64000, 65000, 66000];
    case 'Bệnh viện Tư':
      return [50000, 51000, 52000, 53000, 54000, 55000, 56000];
    case 'Bệnh viện Công':
      return [55000, 56000, 57000, 58000, 59000, 60000];
    case 'Công ty Thầu':
      return [47000, 48000, 49000, 50000];
    case 'Tập Đoàn Hoàn Mỹ':
      return [47000];
    default:
      return [];
  }
};

export const handleThongTinFormChange = (changed, values, setHeSoList, form, onChange) => {
  if (changed.doi_tuong_bao_gia) {
    const hs = getHeSoListByDoiTuong(changed.doi_tuong_bao_gia);
    setHeSoList(hs);
    form.setFieldsValue({ he_so: hs[0] });
    onChange({ ...values, he_so: hs[0] });
  } else {
    onChange(values);
  }
};