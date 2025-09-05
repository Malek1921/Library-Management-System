import { useParams, useNavigate } from "react-router";
import "../BookInfo/Styles/BookInfo.css";

function BookInfo({ entries }) {
  const { id } = useParams();
  const navigate = useNavigate();

  // Look inside entries, not static books
  const book = entries.find((book) => String(book.id) === String(id));

  if (!book) {
    return (
      <div className="not-found">
        Book not found. Check the id and books import.
      </div>
    );
  }

  return (
    <div className="book-info">
      {/* Book Cover */}
      <div className="book-cover">
        <img
          src={book.cover}
          alt={book.title}
          className="book-cover-img"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>

      {/* Book Details */}
      <div className="book-details">
        <h1 className="book-title">{book.title}</h1>
        <div className="book-meta">
          <p>
            <span className="label">Author:</span> {book.author}
          </p>
          <p>
            <span className="label">Language:</span>{" "}
            {book.language || "Unknown"}
          </p>
          <p>
            <span className="label">Year Published:</span> {book.year}
          </p>
          <p>
            <span className="label">Price:</span>{" "}
            <span className="price">{book.price} AFN</span>
          </p>
          <p className="address">
            <span className="label">Address in Library:</span>{" "}
            {book.address || "Not available"}
          </p>
        </div>
        <div className="book-description">
          <h2 className="desc-title">Description</h2>
          <p className="desc-text">{book.description}</p>
        </div>

        <div className="back-btn-wrapper">
          <button onClick={() => navigate(-1)} className="back-btn">
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookInfo;
