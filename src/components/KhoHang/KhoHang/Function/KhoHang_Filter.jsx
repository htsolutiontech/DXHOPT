import React, { useState } from "react";
import { Input, Button } from "antd";

export default function KhoHang_Filter({ onSearch }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch && onSearch(text);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center' }}>
      <Input
        size="small"
        placeholder="Tìm kiếm tên kho"
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ width: 220 }}
      />
      <Button type="primary" htmlType="submit" style={{ marginLeft: 8 }}>Tìm</Button>
    </form>
  );
}
