// src/QuickEntryRHF.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import books from "../Books/utils/books";
export default function QuickEntryRHF() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      quantity: 1,
      price: "",
      company: "",
      author: "",
    },
  });

  const [message, setMessage] = useState("");
  const [, setTick] = useState(0); // force rerender after mutating array

  // live calculated total
  const watchedQuantity = watch("quantity");
  const watchedPrice = watch("price");
  const total = (Number(watchedQuantity) || 0) * (Number(watchedPrice) || 0);

  function onSubmit(data) {
    const title = (data.title || "").trim();
    if (!title) {
      setMessage("Title is required.");
      return;
    }

    const q = Number(data.quantity) || 0;
    const p = data.price === "" ? undefined : Number(data.price);

    // find existing by exact title (case-insensitive)
    const existing = books.find(
      (b) => String(b.title || "").toLowerCase() === title.toLowerCase()
    );

    if (existing) {
      existing.quantity = (Number(existing.quantity) || 0) + q;
      if (p !== undefined) existing.price = p;
      if (data.company) existing.company = data.company;
      if (data.author) existing.author = data.author;
      setMessage(
        `Updated "${existing.title}" — new quantity: ${existing.quantity}`
      );
    } else {
      const id =
        title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "") || `book-${Date.now()}`;

      const newBook = {
        id,
        title,
        author: data.author || "",
        company: data.company || "",
        price: p !== undefined ? p : 0,
        quantity: q,
      };

      books.push(newBook);
      setMessage(`Added new book "${title}" (qty: ${q})`);
    }

    setTick((n) => n + 1); // update UI
    // clear form but keep helpful defaults
    reset({ title: "", quantity: 1, price: "", company: "", author: "" });
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-xl font-semibold mb-4">
        Quick Entry (react-hook-form)
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 bg-white p-4 rounded shadow"
      >
        {/* Title */}
        <div className="flex items-center gap-3">
          <label className="min-w-[110px]">Book Title:</label>
          <input
            {...register("title", { required: true })}
            className="flex-1 px-3 py-2 rounded border"
            placeholder="Exact title = update, otherwise add new"
          />
        </div>
        {errors.title && (
          <div className="text-sm text-red-600">Title is required</div>
        )}

        {/* Quantity */}
        <div className="flex items-center gap-3">
          <label className="min-w-[110px]">Quantity:</label>
          <input
            type="number"
            {...register("quantity", { valueAsNumber: true, min: 0 })}
            className="w-28 px-3 py-2 rounded border"
          />
        </div>

        {/* Price */}
        <div className="flex items-center gap-3">
          <label className="min-w-[110px]">Price:</label>
          <input
            type="number"
            step="0.01"
            {...register("price")}
            className="w-36 px-3 py-2 rounded border"
            placeholder="optional"
          />
        </div>

        {/* Company */}
        <div className="flex items-center gap-3">
          <label className="min-w-[110px]">Company:</label>
          <input
            {...register("company")}
            className="flex-1 px-3 py-2 rounded border"
            placeholder="optional"
          />
        </div>

        {/* Author */}
        <div className="flex items-center gap-3">
          <label className="min-w-[110px]">Author:</label>
          <input
            {...register("author")}
            className="flex-1 px-3 py-2 rounded border"
            placeholder="optional"
          />
        </div>

        {/* Total (computed) */}
        <div className="flex items-center gap-3">
          <label className="min-w-[110px]">Total:</label>
          <div className="px-3 py-2 rounded border bg-gray-50">{total}</div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="submit"
            className="px-4 py-2 rounded bg-blue-600 text-white"
          >
            Save
          </button>
        </div>

        {message && <div className="text-sm text-gray-700 mt-1">{message}</div>}
      </form>

      {/* Optional: quick in-memory list for debugging */}
      <div className="mt-6 bg-white p-4 rounded shadow">
        <h3 className="font-medium mb-2">Books (in-memory)</h3>
        <ul className="text-sm space-y-1 max-h-48 overflow-auto">
          {books.map((b) => (
            <li key={b.id} className="flex justify-between">
              <span>
                {b.title}
                {b.author ? ` — ${b.author}` : ""}
              </span>
              <span className="font-medium">{b.quantity}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
