// lib/api.js
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:5000/api"; 
// 👆 Giữ /api ở cuối URL vì backend đang mount /api/*

export async function apiFetch(endpoint, options = {}) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  // Đảm bảo endpoint luôn bắt đầu bằng "/"
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  // Gọi API
  const res = await fetch(`${API_URL}${cleanEndpoint}`, {
    ...options,
    headers,
  });

  // Xử lý lỗi nếu không thành công
  if (!res.ok) {
    let errorMessage = `API error: ${res.status}`;
    try {
      const data = await res.json();
      if (data.message) errorMessage = data.message;
    } catch {
      const text = await res.text().catch(() => "");
      if (text) errorMessage = text;
    }
    throw new Error(errorMessage);
  }

  // Trả về JSON hoặc object rỗng nếu không có dữ liệu
  try {
    return await res.json();
  } catch {
    return {};
  }
}
