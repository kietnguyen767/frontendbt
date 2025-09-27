"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditProduct() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
  });

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:5000/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setForm({
          name: data.name || "",
          description: data.description || "",
          price: data.price || "",
          image: data.image || "",
        });
      })
      .catch((err) => console.error("Fetch product for edit error:", err));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: Number(form.price),
          image: form.image,
        }),
      });
      router.push(`/`);
    } catch (err) {
      console.error("Update product error:", err);
    }
  };

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

  return (
    <main className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-orange-500 mb-6">
        ✏️ Sửa sản phẩm
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow space-y-4"
      >
        <input
          name="name"
          placeholder="Tên sản phẩm"
          value={form.name}
          onChange={handleChange}
          className="w-full text-black border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
        />
        <input
          name="description"
          placeholder="Mô tả"
          value={form.description}
          onChange={handleChange}
          className="w-full text-black border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
        />
        <input
          name="price"
          type="number"
          placeholder="Giá"
          value={form.price}
          onChange={handleChange}
          className="w-full text-black border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
        />
        <input
          name="image"
          placeholder="URL ảnh"
          value={form.image}
          onChange={handleChange}
          className="w-full text-black border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
        />

        {/* Preview ảnh */}
        {form.image && (
          <div className="flex justify-center">
            <img
              src={form.image}
              alt="preview"
              className="w-32 h-32 object-cover rounded-lg border"
            />
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600"
          >
            Cập nhật
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
          >
            Xóa sản phẩm
          </button>
        </div>
      </form>
    </main>
  );
}
