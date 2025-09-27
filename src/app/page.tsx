"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Fetch products error:", err));
  }, []);

  // Lọc sản phẩm theo từ khóa
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // Hàm xóa sản phẩm
  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setProducts(products.filter((p) => p._id !== id));
      } else {
        console.error("Xóa sản phẩm thất bại");
      }
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 bg-orange-500 text-white p-4 rounded-lg shadow">
        <h1 className="text-xl font-semibold">
          🛒 Sản phẩm / Danh sách sản phẩm
        </h1>

        <div className="flex flex-col md:flex-row gap-3 mt-4 md:mt-0">
          {/* Ô tìm kiếm */}
          <div className="flex border border-orange-300 rounded-lg overflow-hidden bg-white">
            <input
              type="text"
              placeholder="Nhập từ khóa tìm kiếm"
              className="px-3 py-2 outline-none text-gray-700"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="px-4 bg-orange-100 hover:bg-orange-200 text-orange-600">
              🔍
            </button>
          </div>

          {/* Nút lọc nâng cao */}
          <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
            Lọc nâng cao
          </button>

          {/* Nút thêm sản phẩm */}
          <Link
            href="/create"
            className="px-4 py-2 bg-white text-orange-600 font-semibold rounded-lg hover:bg-orange-100"
          >
            + Cập nhật danh mục
          </Link>
        </div>
      </div>

      {/* Bảng sản phẩm */}
      <div className="border rounded-lg overflow-hidden shadow bg-white">
        <table className="w-full border-collapse">
          <thead className="bg-orange-100 text-left text-orange-700">
            <tr>
              <th className="p-3 w-12">
              </th>
              <th className="p-3">Tên sản phẩm</th>
              <th className="p-3">Mã sản phẩm</th>
              <th className="p-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => (
              <tr
                key={p._id}
                className="border-t hover:bg-orange-50 transition"
              >
                <td className="p-3">
                  <input type="checkbox" />
                </td>
                <td className="p-3 flex items-center gap-3">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-10 h-10 object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-orange-100 rounded-full" />
                  )}
                  <span className="text-gray-800">{p.name}</span>
                </td>
                <td className="p-3 text-orange-600 font-medium">
                  SP{p._id.slice(-4)}
                </td>
                <td className="p-3 text-center space-x-2">
                  <Link
                    href={`/edit/${p._id}`}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Sửa
                  </Link>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
