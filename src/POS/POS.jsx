import "../POS/Styles/POS.css";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";

// this array will collect all sale totals for reports
export const salesReports = [];

function POS({ entries }) {
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [selectedBook, setSelectedBook] = useState(null);
  const [basket, setBasket] = useState([]);
  const qtyInputRef = useRef(null);

  // react-hook-form setup
  const { register, handleSubmit, reset } = useForm();

  // handle search typing
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value.trim() === "") {
      setFiltered([]);
      setHighlightIndex(-1);
      return;
    }

    const results = entries.filter(
      (book) =>
        book.title.toLowerCase().includes(value.toLowerCase()) ||
        book.author.toLowerCase().includes(value.toLowerCase())
    );
    setFiltered(results);
    setHighlightIndex(-1);
  };

  // handle keyboard navigation
  const handleKeyDown = (e) => {
    if (filtered.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev < filtered.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter" && highlightIndex >= 0) {
      e.preventDefault();
      const chosen = filtered[highlightIndex];
      setSelectedBook(chosen);
      setFiltered([]);
      setSearch(chosen.title);
      setHighlightIndex(-1);

      // focus on quantity input
      setTimeout(() => {
        qtyInputRef.current?.focus();
      }, 0);
    }
  };

  // handle adding to basket (via RHF)
  const handleAddToBasket = (data) => {
    const qty = Number(data.quantity);

    if (!selectedBook || !qty || qty <= 0) return;

    // simply add a new item every time, no merging
    setBasket((prev) => [
      ...prev,
      {
        ...selectedBook,
        qty,
        subtotal: Number(selectedBook.price) * qty,
      },
    ]);

    // reset form and search
    setSelectedBook(null);
    setSearch("");
    reset();
  };

  // handle delete from basket
  const handleDelete = (id) => {
    setBasket((prev) => prev.filter((item) => item.id !== id));
  };

  // calculate total
  const total = basket.reduce((sum, item) => sum + item.subtotal, 0);

  // finalize sale and push total into salesReports
  const handleCheckout = () => {
    if (basket.length === 0) return;

    // 1️⃣ Decrease stock for each item in basket
    basket.forEach((item) => {
      const book = entries.find((b) => b.id === item.id);
      if (book) {
        book.quantity = Math.max(0, Number(book.quantity) - item.qty);
      }
    });

    // 2️⃣ Save the sale total into reports
    salesReports.push(total);
    console.log("Updated salesReports:", salesReports);

    // 3️⃣ Alert & reset
    alert("Sale recorded! Total: " + total);
    setBasket([]);
  };

  return (
    <div className="pos">
      <h2>Point of Sale</h2>

      {/* Search */}
      <input
        className="input"
        placeholder="Search by title or author"
        value={search}
        onChange={handleSearch}
        onKeyDown={handleKeyDown}
      />

      {/* Filtered results */}
      {filtered.length > 0 && (
        <ul className="results">
          {filtered.map((book, index) => (
            <li
              key={book.id}
              className={index === highlightIndex ? "highlight" : ""}
            >
              {book.title} – {book.author} ({book.category}) | Stock:{" "}
              {book.quantity}
            </li>
          ))}
        </ul>
      )}

      {/* Quantity input (react-hook-form) */}
      {selectedBook && (
        <form onSubmit={handleSubmit(handleAddToBasket)} className="qty-form">
          <p>
            Selected: <b>{selectedBook.title}</b> by {selectedBook.author}
          </p>
          <input
            ref={qtyInputRef}
            type="number"
            placeholder="Enter quantity"
            {...register("quantity", { required: true, min: 1 })}
          />
          <button type="submit">Add to Basket</button>
        </form>
      )}

      {/* Basket */}
      <h3>Basket</h3>
      {basket.length === 0 ? (
        <p>No items yet</p>
      ) : (
        <table className="basket">
          <thead>
            <tr>
              <th>Title</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Subtotal</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {basket.map((item) => (
              <tr key={item.id}>
                <td>{item.title}</td>
                <td>{item.qty}</td>
                <td>{item.price}</td>
                <td>{item.subtotal}</td>
                <td>
                  <button onClick={() => handleDelete(item.id)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Total */}
      <div className="total">
        <p>
          <b>Total:</b> {total}
        </p>
        <button onClick={handleCheckout} disabled={basket.length === 0}>
          Checkout
        </button>
      </div>
    </div>
  );
}

export default POS;
