import { Route, Routes, BrowserRouter } from "react-router";
import Home from "./Home/Home";
import Insert from "./Insert/Insert";
import POS from "./POS/POS";
import Books from "./Books/Books";
import BookInfo from "./BookInfo/BookInfo";
import Reports from "./Reports/Reports";
import books from "./Books/utils/books";
import { useState } from "react";

function RouterIndex() {
  const [entries, setEntries] = useState(books);
  console.log(entries);

  const handleFormSubmit = (data) => {
    setEntries((prev) => [...prev, data]);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/Insert"
          element={<Insert entries={entries} onSubmitForm={handleFormSubmit} />}
        />

        <Route path="/pos" element={<POS />} />
        <Route path="/books" element={<Books entries={entries} />} />
        <Route path="/book/:id" element={<BookInfo entries={entries} />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </BrowserRouter>
  );
}

export default RouterIndex;
