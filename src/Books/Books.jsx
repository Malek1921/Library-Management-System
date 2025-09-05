import { useNavigate } from "react-router";
import "../Books/Styles/Books.css";

function Books({ entries }) {
  const navigate = useNavigate();

  return (
    <div className="books-grid">
      {entries.map((book) => (
        <div key={book.id} className="book-card">
          <div className="book-card-cover">
            {book.cover ? (
              <img
                src={book.cover}
                alt={book.title}
                className="book-cover-img"
              />
            ) : (
              <span className="no-image">No Image</span>
            )}
          </div>

          <div className="book-card-body">
            <h1 className="book-title">{book.title}</h1>
            <p className="book-author">{book.author}</p>
            <p className="book-year">{book.year}</p>
            <p className="book-price">${book.price}</p>

            <button
              onClick={() => navigate(`/book/${book.id}`)}
              className="book-btn"
            >
              Click for more description
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Books;
