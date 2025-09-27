"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewProduct() {
  const [form, setForm] = useState({ name: "", description: "", price: "", image: "" });
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, price: Number(form.price) }),
    });
    router.push("/");
  };

  return (
    <main className="bg-white p-6">
      <h1 className="text-2xl font-bold mb-4">Thêm sản phẩm</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="Tên sản phẩm" onChange={handleChange} className="border p-2 w-full" />
        <input name="description" placeholder="Mô tả" onChange={handleChange} className="border p-2 w-full" />
        <input name="price" type="number" placeholder="Giá" onChange={handleChange} className="border p-2 w-full" />
        <input name="image" placeholder="URL ảnh" onChange={handleChange} className="border p-2 w-full" />
        <button type="submit" className="bg-blue-500 px-4 py-2 text-white rounded">Lưu</button>
      </form>
    </main>
  );
}
