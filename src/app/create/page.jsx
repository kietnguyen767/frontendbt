"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import useAuth from "@/hooks/useAuth";
import Link from "next/link";

export default function CreateProductPage() {
  useAuth({ redirectToLogin: true });
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === "image") setImageError(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiFetch("/products", {
        method: "POST",
        body: JSON.stringify(form),
      });
      router.push("/");
    } catch (err) {
      alert("Không thể tạo sản phẩm!");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-8 relative">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-orange-300 to-pink-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-blue-300 to-purple-300 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-3xl mx-auto px-4 relative z-10">
        {/* Header */}
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
                🛒
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-1">Thêm sản phẩm mới</h1>
              <p className="text-gray-500">Tạo sản phẩm để hiển thị trong cửa hàng của bạn</p>
            </div>
          </div>
        </div>

        {/* Form card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 px-8 py-6">
            <h2 className="text-white font-bold text-xl flex items-center gap-2">
              <span>✨</span>
              <span>Thông tin sản phẩm</span>
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <span className="text-red-500">*</span> Tên sản phẩm
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="VD: iPhone 15 Pro Max"
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition-all text-gray-800 font-medium placeholder:text-gray-400"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <span className="text-red-500">*</span> Mô tả
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={5}
                placeholder="Mô tả chi tiết sản phẩm..."
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition-all resize-none text-gray-800 placeholder:text-gray-400"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <span className="text-red-500">*</span> Giá bán (VNĐ)
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
                <p className="mt-2 text-green-600 font-semibold">
                  💰 {parseInt(form.price).toLocaleString("vi-VN")}₫
                </p>
              )}
            </div>

            {/* Image */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Hình ảnh (URL)
              </label>
              <input
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition-all text-gray-800"
              />
            </div>

            {/* Image preview */}
            {form.image && (
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border-2 border-dashed border-gray-300">
                {!imageError ? (
                  <div className="relative group flex justify-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                    <img
                      src={form.image}
                      alt="preview"
                      className="relative max-w-md w-full h-80 object-cover rounded-2xl shadow-2xl border-4 border-white transition-transform group-hover:scale-105"
                      onError={() => setImageError(true)}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-80 bg-gray-200 rounded-2xl">
                    <span className="text-6xl mb-4">❌</span>
                    <p className="text-gray-500 font-medium">Không thể tải ảnh</p>
                    <p className="text-gray-400 text-sm mt-2">Vui lòng kiểm tra URL</p>
                  </div>
                )}
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-4 mt-10 pt-6 border-t-2 border-gray-100">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="flex-1 px-6 py-4 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition-all hover:scale-105 duration-300 shadow-md hover:shadow-xl flex items-center justify-center gap-2"
              >
                <span>❌</span> Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl hover:shadow-2xl transition-all hover:scale-105 duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Đang lưu...</span>
                  </>
                ) : (
                  <>
                    <span>✅</span> <span>Lưu sản phẩm</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
