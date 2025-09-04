import { useState, useMemo } from "react";
import booksData from "../Books/utils/books"; // adjust path if needed

export default function POS() {
  // Local copy of inventory so we can change stock on checkout
  const [inventory, setInventory] = useState(
    booksData.map((b) => ({ ...b })) // shallow clone
  );

  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null); // selected book object from inventory
  const [qty, setQty] = useState(1);
  const [cart, setCart] = useState([]); // { id, title, price, qty, cover }
  const [error, setError] = useState("");

  // filtered results (simple contains match on title or author)
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return inventory.filter(
      (b) =>
        (b.title && b.title.toLowerCase().includes(q)) ||
        (b.author && b.author.toLowerCase().includes(q))
    );
  }, [query, inventory]);

  // compute totals
  const subtotal = useMemo(
    () => cart.reduce((s, it) => s + it.price * it.qty, 0),
    [cart]
  );

  // handlers
  function handleSelectBook(book) {
    setSelected(book);
    setQty(1);
    setError("");
  }

  function handleQtyChange(e) {
    const value = Number(e.target.value);
    if (Number.isNaN(value) || value < 1) {
      setQty("");
      return;
    }
    setQty(value);
    setError("");
  }

  function handleAddToCart() {
    if (!selected) return setError("Select a book first.");
    if (!Number.isInteger(Number(qty)) || qty < 1)
      return setError("Enter a valid quantity.");
    const invBook = inventory.find((b) => String(b.id) === String(selected.id));
    const available = invBook?.qty ?? 0;

    // already in cart?
    const inCart = cart.find((c) => String(c.id) === String(selected.id));
    const alreadyQty = inCart ? inCart.qty : 0;

    if (qty + alreadyQty > available)
      return setError(
        `Only ${available - alreadyQty} more available in stock.`
      );

    setCart((prev) => {
      if (inCart) {
        // update existing line
        return prev.map((c) =>
          String(c.id) === String(selected.id) ? { ...c, qty: c.qty + qty } : c
        );
      }
      return [
        ...prev,
        {
          id: selected.id,
          title: selected.title,
          price: Number(selected.price) || 0,
          qty,
          cover: selected.cover,
        },
      ];
    });

    setError("");
    setQty(1);
  }

  function handleRemoveLine(id) {
    setCart((prev) => prev.filter((i) => String(i.id) !== String(id)));
  }

  function handleUpdateCartQty(id, newQty) {
    if (!Number.isInteger(Number(newQty)) || newQty < 1) return;
    const invBook = inventory.find((b) => String(b.id) === String(id));
    if (!invBook) return;
    if (newQty > invBook.qty) {
      setError(`Only ${invBook.qty} available in stock.`);
      return;
    }
    setCart((prev) =>
      prev.map((c) => (String(c.id) === String(id) ? { ...c, qty: newQty } : c))
    );
    setError("");
  }

  function handleCheckout() {
    if (cart.length === 0) return setError("Cart is empty.");
    // reduce local inventory
    setInventory((prevInv) =>
      prevInv.map((b) => {
        const line = cart.find((c) => String(c.id) === String(b.id));
        if (!line) return b;
        return { ...b, qty: b.qty - line.qty };
      })
    );

    // simple receipt/logging
    console.log("=== RECEIPT ===");
    cart.forEach((c) =>
      console.log(`${c.title} x ${c.qty} = ${c.price * c.qty}`)
    );
    console.log("TOTAL:", subtotal);

    // clear cart & selection
    setCart([]);
    setSelected(null);
    setQty(1);
    setError("");
    alert("Checkout complete. Inventory updated (local only).");
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Point of Sale (POS)</h2>

      {/* Search */}
      <div className="mb-4">
        <label className="block text-sm font-medium">
          Search book by title or author
        </label>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type to search..."
          className="mt-1 w-full border rounded px-3 py-2"
        />
        {/* results */}
        {results.length > 0 && (
          <div className="mt-2 bg-white rounded shadow max-h-60 overflow-auto">
            {results.map((r) => (
              <button
                key={r.id}
                onClick={() => handleSelectBook(r)}
                className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-3"
              >
                <img
                  src={r.cover}
                  alt={r.title}
                  className="w-12 h-16 object-cover rounded"
                />
                <div>
                  <div className="font-medium">{r.title}</div>
                  <div className="text-xs text-gray-500">{r.author}</div>
                  <div className="text-xs text-gray-500">Stock: {r.qty}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected book card */}
      {selected && (
        <div className="mb-4 p-3 bg-white rounded shadow flex gap-4">
          <img
            src={selected.cover}
            alt={selected.title}
            className="w-28 h-36 object-cover rounded"
          />
          <div className="flex-1">
            <h3 className="font-semibold">{selected.title}</h3>
            <p className="text-sm text-gray-600">{selected.author}</p>
            <p className="text-sm text-gray-600">Price: ${selected.price}</p>
            <p className="text-sm text-gray-600">Available: {selected.qty}</p>

            <div className="mt-3 flex items-center gap-2">
              <label className="text-sm">Quantity</label>
              <input
                type="number"
                min="1"
                value={qty}
                onChange={handleQtyChange}
                className="w-20 px-2 py-1 border rounded"
              />
              <button
                onClick={handleAddToCart}
                className="ml-2 px-3 py-1 bg-blue-600 text-white rounded"
              >
                Add to cart
              </button>
            </div>
            {error && <div className="text-sm text-red-600 mt-2">{error}</div>}
          </div>
        </div>
      )}

      {/* Cart */}
      <div className="mb-4">
        <h4 className="font-semibold mb-2">Cart</h4>
        {cart.length === 0 ? (
          <div className="text-sm text-gray-500">Cart is empty.</div>
        ) : (
          <div className="space-y-2">
            {cart.map((line) => (
              <div
                key={line.id}
                className="flex items-center gap-3 p-2 bg-white rounded shadow-sm"
              >
                <img
                  src={line.cover}
                  alt={line.title}
                  className="w-14 h-18 object-cover rounded"
                />
                <div className="flex-1">
                  <div className="font-medium">{line.title}</div>
                  <div className="text-xs text-gray-600">
                    Unit: ${line.price}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    value={line.qty}
                    onChange={(e) =>
                      handleUpdateCartQty(line.id, Number(e.target.value))
                    }
                    className="w-20 px-2 py-1 border rounded"
                  />
                  <div className="font-semibold">
                    ${(line.price * line.qty).toFixed(2)}
                  </div>
                  <button
                    onClick={() => handleRemoveLine(line.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center mt-2">
              <div className="font-semibold">Total:</div>
              <div className="text-xl font-bold">${subtotal.toFixed(2)}</div>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={handleCheckout}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Checkout
              </button>
              <button
                onClick={() => setCart([])}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Clear cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
