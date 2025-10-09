"use client";
import Link from "next/link";
import Image from "next/image";

export default function ProductCard({ product, isAuth = false, onDelete }) {
  const priceStr = new Intl.NumberFormat("vi-VN").format(product.price ?? 0);

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="relative h-48 bg-gray-100">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 33vw"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-6xl text-gray-300">📦</div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{product.description}</p>

        <div className="flex items-center justify-between">
          <div className="text-indigo-600 font-bold text-lg">{priceStr}₫</div>

          {isAuth ? (
            <div className="flex gap-2">
              <Link
                href={`/edit/${product._id}`}
                className="px-3 py-1 text-sm bg-yellow-400 text-white rounded-md hover:opacity-90"
              >
                ✏️ Sửa
              </Link>
              <button
                onClick={() => onDelete && onDelete(product._id)}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:opacity-90"
              >
                🗑️ Xóa
              </button>
            </div>
          ) : (
            <Link
              href={`/products/${product._id}`}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:opacity-90"
            >
              Xem chi tiết
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
