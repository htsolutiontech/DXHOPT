function numberToVietnameseWords(number) {
  if (typeof number !== 'number') number = Number(number);
  if (isNaN(number)) return '';
  if (number === 0) return 'Không đồng.';

  const ChuSo = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
  const DonVi = ['', 'nghìn', 'triệu', 'tỷ', 'nghìn tỷ', 'triệu tỷ', 'tỷ tỷ'];
  let s = '';
  let so = Math.round(Math.abs(number));
  let i = 0;
  let arr = [];

  while (so > 0) {
    let phan = so % 1000;
    if (phan > 0) {
      let str = '';
      let tram = Math.floor(phan / 100);
      let chuc = Math.floor((phan % 100) / 10);
      let donvi = phan % 10;

      if (tram > 0) str += ChuSo[tram] + ' trăm';
      else if (so > 999) str += 'không trăm';

      if (chuc > 1) {
        str += ' ' + ChuSo[chuc] + ' mươi';
        if (donvi === 1) str += ' mốt';
        else if (donvi === 5) str += ' lăm';
        else if (donvi > 0) str += ' ' + ChuSo[donvi];
      } else if (chuc === 1) {
        str += ' mười';
        if (donvi === 1) str += ' một';
        else if (donvi === 5) str += ' lăm';
        else if (donvi > 0) str += ' ' + ChuSo[donvi];
      } else if (donvi > 0) {
        if (tram > 0) str += ' lẻ';
        if (donvi === 5 && tram !== 0) str += ' lăm';
        else str += ' ' + ChuSo[donvi];
      }

      let donViStr = DonVi[i] ? ' ' + DonVi[i] : '';
      arr.unshift(str.trim() + donViStr);
    }
    so = Math.floor(so / 1000);
    i++;
  }

  // Ghép lại, thêm dấu phẩy giữa các phần
  s = arr.join(', ').replace(/\s+/g, ' ').trim();
  s = s.charAt(0).toUpperCase() + s.slice(1) + ' đồng.';
  return s;
}

export default numberToVietnameseWords;