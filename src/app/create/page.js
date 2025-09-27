"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateProduct() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!form.name.trim()) return setError("Vui lòng nhập tên sản phẩm.");
    if (!form.price || Number(form.price) <= 0)
      return setError("Vui lòng nhập giá hợp lệ.");

    setIsSubmitting(true);
    try {
      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: Number(form.price),
          image: form.image,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Tạo sản phẩm thất bại");
      }

      // Redirect về trang danh sách
      router.push("/");
    } catch (err) {
      console.error("Create product error:", err);
      setError(err.message || "Có lỗi xảy ra, thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 p-6 flex items-center justify-center">
      <div className="w-full max-w-lg bg-gray rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-orange-600 mb-4">➕ Thêm sản phẩm</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded">{error}</div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Tên sản phẩm
            </label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nhập tên sản phẩm"
              className="mt-1 text-black block w-full rounded border border-orange-200 p-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Mô tả
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Mô tả ngắn sản phẩm"
              rows={4}
              className="mt-1 text-black block w-full rounded border border-orange-200 p-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Giá (VNĐ)
            </label>
            <input
              id="price"
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              placeholder="Nhập giá"
              className="mt-1 text-black block w-full rounded border border-orange-200 p-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
              required
              min="0"
            />
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
              URL ảnh
            </label>
            <input
              id="image"
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="Dán link ảnh sản phẩm (tùy chọn)"
              className="mt-1 text-black block w-full rounded border border-orange-200 p-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
              disabled={isSubmitting}
            >
              Hủy
            </button>

            <button
              type="submit"
              className={`px-4 py-2 rounded text-white ${
                isSubmitting ? "bg-orange-300" : "bg-orange-500 hover:bg-orange-600"
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang lưu..." : "Lưu sản phẩm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
