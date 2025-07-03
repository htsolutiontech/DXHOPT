export default async function getImageBase64(ma_hang) {
  if (!ma_hang) return null;
  // Thử jpg trước
  let url = `/image/HangHoa/${ma_hang}.jpg`;
  try {
    let res = await fetch(url);
    if (res.ok) {
      const blob = await res.blob();
      return await toBase64(blob);
    }
    // Nếu jpg không có, thử png
    url = `/image/HangHoa/${ma_hang}.png`;
    res = await fetch(url);
    if (res.ok) {
      const blob = await res.blob();
      return await toBase64(blob);
    }
  } catch (e) {}
  return null;
}

function toBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}