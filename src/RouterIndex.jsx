import { Route, Routes, BrowserRouter } from "react-router";
import Home from "./Home/Home";
import Insert from "./Insert/Insert";
import POS from "./POS/POS";
import Books from "./Books/Books";
import BookInfo from "./BookInfo/BookInfo";
import Reports from "./Reports/Reports";
function RouterIndex() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/insert" element={<Insert />} />
        <Route path="/pos" element={<POS />} />
        <Route path="/books" element={<Books />} />
        <Route path="/book/:id" element={<BookInfo />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </BrowserRouter>
  );
}

export default RouterIndex;
