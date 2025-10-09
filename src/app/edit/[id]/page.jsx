"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import useAuth from "@/hooks/useAuth";
import Link from "next/link";

export default function EditProductPage() {
  useAuth({ redirectToLogin: true });
  const router = useRouter();
  const params = useParams();
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    apiFetch(`/products/${params.id}`)
      .then((data) => {
        setForm({
          name: data.name || "",
          description: data.description || "",
          price: data.price || "",
          image: data.image || "",
        });
        setLoading(false);
      })
      .catch(() => {
        alert("Không thể tải thông tin sản phẩm!");
        router.push("/");
      });
  }, [params.id, router]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === "image") {
      setImageError(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiFetch(`/products/${params.id}`, {
        method: "PUT",
        body: JSON.stringify(form),
      });
      router.push("/");
    } catch (err) {
      alert("Không thể cập nhật sản phẩm!");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 font-medium">Đang tải thông tin sản phẩm...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 relative">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-orange-300 to-pink-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-blue-300 to-purple-300 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-3xl mx-auto px-4 relative z-10">
        {/* Header with breadcrumb */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors mb-6 group"
          >
            <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
            <span className="font-medium">Quay lại danh sách</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-400 rounded-2xl blur-lg opacity-50"></div>
              <div className="relative w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center text-3xl shadow-xl">
                ✏️
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-1">Chỉnh sửa sản phẩm</h1>
              <p className="text-gray-500">Cập nhật thông tin sản phẩm của bạn</p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 px-8 py-6">
            <h2 className="text-white font-bold text-xl flex items-center gap-2">
              <span>📝</span>
              <span>Thông tin sản phẩm</span>
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            <div className="space-y-6">
              {/* Product Name */}
              <div className="group">
                <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="text-red-500">*</span>
                  <span>Tên sản phẩm</span>
                  <span className="text-xs text-gray-400 font-normal">(Bắt buộc)</span>
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="VD: iPhone 15 Pro Max"
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition-all text-gray-800 font-medium placeholder:text-gray-400 placeholder:font-normal"
                />
              </div>

              {/* Description */}
              <div className="group">
                <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="text-red-500">*</span>
                  <span>Mô tả sản phẩm</span>
                  <span className="text-xs text-gray-400 font-normal">(Bắt buộc)</span>
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Mô tả chi tiết về sản phẩm, tính năng, ưu điểm..."
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition-all resize-none text-gray-800 placeholder:text-gray-400"
                />
                <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                  <span>💡</span>
                  <span>Mô tả chi tiết giúp sản phẩm hấp dẫn hơn</span>
                </p>
              </div>

              {/* Price */}
              <div className="group">
                <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="text-red-500">*</span>
                  <span>Giá bán</span>
                  <span className="text-xs text-gray-400 font-normal">(VNĐ)</span>
                </label>
                <div className="relative">
                  <input
                    name="price"
                    type="number"
                    value={form.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="1000"
                    placeholder="0"
                    className="w-full px-5 py-4 pr-12 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition-all text-gray-800 font-semibold"
                  />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-lg">
                    ₫
                  </span>
                </div>
                {form.price && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-xl">
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <span>💰</span>
                      <span>Giá hiển thị:</span>
                      <span className="font-bold text-green-600 text-lg">
                        {parseInt(form.price).toLocaleString("vi-VN")}₫
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {/* Image URL */}
              <div className="group">
                <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <span>URL hình ảnh</span>
                  <span className="text-xs text-gray-400 font-normal">(Tùy chọn)</span>
                </label>
                <input
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition-all text-gray-800"
                />
                <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                  <span>🖼️</span>
                  <span>Nhập URL ảnh từ internet hoặc để trống</span>
                </p>
              </div>

              {/* Image Preview */}
              {form.image && (
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border-2 border-dashed border-gray-300">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">🖼️</span>
                    <p className="text-sm font-bold text-gray-700">Xem trước hình ảnh</p>
                  </div>
                  <div className="flex justify-center">
                    {!imageError ? (
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                        <img
                          src={form.image}
                          alt="preview"
                          className="relative max-w-md w-full h-80 object-cover rounded-2xl shadow-2xl border-4 border-white transition-transform group-hover:scale-105"
                          onError={() => setImageError(true)}
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-80 w-full max-w-md bg-gray-200 rounded-2xl">
                        <span className="text-6xl mb-4">❌</span>
                        <p className="text-gray-500 font-medium">Không thể tải ảnh</p>
                        <p className="text-gray-400 text-sm mt-2">Vui lòng kiểm tra URL</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-10 pt-6 border-t-2 border-gray-100">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="flex-1 px-6 py-4 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition-all hover:scale-105 duration-300 shadow-md hover:shadow-xl flex items-center justify-center gap-2"
              >
                <span>❌</span>
                <span>Hủy bỏ</span>
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:shadow-2xl transition-all hover:scale-105 duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Đang cập nhật...</span>
                  </>
                ) : (
                  <>
                    <span>✅</span>
                    <span>Cập nhật sản phẩm</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Tips Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-md hover:shadow-xl transition-shadow border border-gray-100">
            <div className="text-3xl mb-3">📸</div>
            <h3 className="font-bold text-gray-800 mb-2">Hình ảnh chất lượng</h3>
            <p className="text-sm text-gray-600">Sử dụng ảnh rõ nét, chất lượng cao</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-md hover:shadow-xl transition-shadow border border-gray-100">
            <div className="text-3xl mb-3">📝</div>
            <h3 className="font-bold text-gray-800 mb-2">Mô tả chi tiết</h3>
            <p className="text-sm text-gray-600">Cung cấp đầy đủ thông tin sản phẩm</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-md hover:shadow-xl transition-shadow border border-gray-100">
            <div className="text-3xl mb-3">💰</div>
            <h3 className="font-bold text-gray-800 mb-2">Giá cả hợp lý</h3>
            <p className="text-sm text-gray-600">Đặt giá phù hợp với thị trường</p>
          </div>
        </div>
      </div>
    </div>
  );
}