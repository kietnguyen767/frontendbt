"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:5000/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) => console.error("Fetch product detail error:", err));
  }, [id]);

  const handleDelete = async () => {
    try {
      await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
      });
      router.push("/");
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  if (!product) return <p>Đang tải...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>💵 {product.price}₫</p>
      {product.image && (
        <img src={product.image} alt={product.name} width="200" />
      )}
      <div style={{ marginTop: 20 }}>
        <Link href={`/edit/${id}`} style={{ marginRight: 10 }}>
          Sửa
        </Link>
        <button onClick={handleDelete} style={{ color: "red" }}>
          Xóa
        </button>
      </div>
    </div>
  );
}
