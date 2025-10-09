"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { apiFetch } from "@/lib/api";

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
};

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");

  // ✅ Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await apiFetch("/products");
        setProducts(data);
      } catch (error) {
        console.error("Fetch products error:", error);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) return;
    try {
      await apiFetch(`/products/${id}`, { method: "DELETE" });
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
    }
  };

  const toggleSelectProduct = (id: string) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedProducts.length === currentProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(currentProducts.map((p) => p._id));
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Hiệu ứng nền mờ */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-orange-300/10 to-pink-300/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-40 left-10 w-80 h-80 bg-gradient-to-br from-blue-300/10 to-purple-300/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1.5s" }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 relative z-10">
        {/* Header gradient */}
        <div className="relative bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 text-white p-8 rounded-3xl shadow-2xl mb-8 overflow-hidden backdrop-blur-sm">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>

          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <span className="text-4xl">🛍️</span>
                Quản lý Sản phẩm
              </h1>
              <p className="text-orange-100 text-sm flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Tổng số:{" "}
                <span className="font-semibold">{filteredProducts.length}</span>{" "}
                sản phẩm
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Tìm kiếm */}
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-full sm:w-72 pl-11 pr-4 py-3 rounded-xl border-2 border-transparent focus:border-white bg-white/95 backdrop-blur-sm text-gray-700 placeholder-gray-400 outline-none transition shadow-lg"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                  🔍
                </span>
              </div>

              {/* Chế độ xem */}
              <div className="flex bg-white/25 backdrop-blur-md rounded-xl p-1.5 shadow-lg">
                <button
                  onClick={() => setViewMode("table")}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    viewMode === "table"
                      ? "bg-white text-orange-600 shadow-md scale-105"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  📋 Bảng
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    viewMode === "grid"
                      ? "bg-white text-orange-600 shadow-md scale-105"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  ⊞ Lưới
                </button>
              </div>

              {/* Lọc */}
              <button
                onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
                className="px-5 py-3 bg-white/25 backdrop-blur-md hover:bg-white/35 text-white rounded-xl transition font-medium shadow-lg hover:shadow-xl hover:scale-105 duration-300"
              >
                🎯 Lọc
              </button>

              {/* Thêm sản phẩm */}
              <Link
                href="/create"
                className="px-6 py-3 bg-white text-orange-600 font-semibold rounded-xl hover:bg-orange-50 transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2 hover:scale-105 duration-300"
              >
                <span className="text-2xl">+</span> Thêm sản phẩm
              </Link>
            </div>
          </div>
        </div>

        {/* Bộ lọc nâng cao */}
        {showAdvancedFilter && (
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl p-6 mb-8 border border-orange-100 animate-fadeIn">
            <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <span>⚙️</span> Bộ lọc nâng cao
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-2 font-medium">
                  Danh mục
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none bg-white transition">
                  <option>Tất cả</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2 font-medium">
                  Giá từ
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2 font-medium">
                  Giá đến
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition"
                  placeholder="1000000"
                />
              </div>
            </div>
          </div>
        )}

        {/* Giao diện bảng hoặc lưới */}
        {viewMode === "table" ? (
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-orange-100 via-orange-50 to-yellow-50">
                  <tr>
                    <th className="p-5 text-left">
                      <input
                        type="checkbox"
                        checked={
                          selectedProducts.length === currentProducts.length &&
                          currentProducts.length > 0
                        }
                        onChange={toggleSelectAll}
                        className="w-5 h-5 rounded-md border-gray-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
                      />
                    </th>
                    <th className="p-5 text-left text-sm font-bold text-gray-700">
                      Sản phẩm
                    </th>
                    <th className="p-5 text-left text-sm font-bold text-gray-700">
                      Mã SP
                    </th>
                    <th className="p-5 text-left text-sm font-bold text-gray-700">
                      Giá
                    </th>
                    <th className="p-5 text-center text-sm font-bold text-gray-700">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentProducts.map((p, index) => (
                    <tr
                      key={p._id}
                      className={`border-t border-gray-100 hover:bg-gradient-to-r hover:from-orange-50/50 hover:to-yellow-50/50 transition-all duration-300 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                      }`}
                    >
                      <td className="p-5">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(p._id)}
                          onChange={() => toggleSelectProduct(p._id)}
                          className="w-5 h-5 rounded-md border-gray-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
                        />
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-4">
                          {p.image ? (
                            <Image
                              src={p.image}
                              alt={p.name}
                              width={56}
                              height={56}
                              className="rounded-xl object-cover shadow-md hover:shadow-lg transition-shadow duration-300"
                            />
                          ) : (
                            <div className="w-14 h-14 bg-gradient-to-br from-orange-200 to-orange-300 rounded-xl flex items-center justify-center text-orange-600 font-bold text-xl shadow-md">
                              {p.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <p className="text-gray-800 font-semibold hover:text-orange-600 transition-colors">
                              {p.name}
                            </p>
                            <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                              {p.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-5">
                        <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-700 rounded-full text-sm font-mono font-bold shadow-sm">
                          SP{p._id.slice(-4)}
                        </span>
                      </td>
                      <td className="p-5">
                        <span className="text-green-600 font-bold text-lg">
                          {p.price.toLocaleString("vi-VN")}₫
                        </span>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center justify-center gap-3">
                          <Link
                            href={`/edit/${p._id}`}
                            className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition text-sm font-medium shadow-md hover:shadow-lg hover:scale-105 duration-300"
                          >
                            ✏️ Sửa
                          </Link>
                          <button
                            onClick={() => handleDelete(p._id)}
                            className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition text-sm font-medium shadow-md hover:shadow-lg hover:scale-105 duration-300"
                          >
                            🗑️ Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentProducts.map((p) => (
              <div
                key={p._id}
                className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-100 group hover:-translate-y-2"
              >
                <div className="relative h-48 bg-gradient-to-br from-orange-100 via-orange-50 to-yellow-50 overflow-hidden">
                  {p.image ? (
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-7xl text-orange-300 group-hover:scale-110 transition-transform duration-500">
                      📦
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span className="inline-block px-3 py-1.5 bg-white/95 backdrop-blur-sm text-orange-600 rounded-full text-xs font-mono font-bold shadow-lg">
                      SP{p._id.slice(-4)}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-800 mb-2 line-clamp-1 group-hover:text-orange-600 transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-green-600 font-bold text-xl">
                      {p.price.toLocaleString("vi-VN")}₫
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/edit/${p._id}`}
                      className="flex-1 px-4 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition text-sm font-medium text-center shadow-md hover:shadow-lg hover:scale-105 duration-300"
                    >
                      ✏️ Sửa
                    </Link>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition text-sm font-medium shadow-md hover:shadow-lg hover:scale-105 duration-300"
                    >
                      🗑️ Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ✅ Phân trang */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-4 py-2 bg-white/90 border rounded-xl shadow hover:shadow-lg disabled:opacity-50 hover:bg-orange-50 transition"
            >
              ← Trước
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded-xl font-semibold transition ${
                  currentPage === i + 1
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg scale-105"
                    : "bg-white/90 border text-gray-600 hover:bg-orange-50 hover:scale-105"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-4 py-2 bg-white/90 border rounded-xl shadow hover:shadow-lg disabled:opacity-50 hover:bg-orange-50 transition"
            >
              Sau →
            </button>
          </div>
        )}
      </div>

      {/* Hiệu ứng fade */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
