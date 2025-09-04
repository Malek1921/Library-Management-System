import { useParams, useNavigate } from "react-router";
import books from "../Books/utils/books";

function BookInfo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const book = books.find((book) => String(book.id) === String(id));

  if (!book) {
    return (
      <div className="p-6 text-center text-gray-600 dark:text-gray-300">
        Book not found. Check the id and books import.
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-gray-100 dark:bg-gray-900 flex box-border p-10">
      {/* Book Cover */}
      <div className="w-[300px] h-[450px] flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded-lg shadow-md overflow-hidden">
        <img
          src={book.cover}
          alt={book.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>

      {/* Book Details */}
      <div className="ml-12 flex flex-col justify-between w-full">
        {/* Top Info Section */}
        <div>
          <h1 className="text-3xl font-bold mb-6">{book.title}</h1>

          <div className="grid grid-cols-2 gap-y-4 gap-x-16 text-lg">
            <p>
              <span className="font-semibold">Author:</span> {book.author}
            </p>
            <p>
              <span className="font-semibold">Language:</span>{" "}
              {book.language || "Unknown"}
            </p>

            <p>
              <span className="font-semibold">Year Published:</span> {book.year}
            </p>
            <p>
              <span className="font-semibold">Price:</span>{" "}
              <span className="text-blue-600 dark:text-blue-400 font-bold">
                {book.price} AFN
              </span>
            </p>

            <p className="col-span-2">
              <span className="font-semibold">Address in Library:</span>{" "}
              {book.address || "Not available"}
            </p>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {book.description}
            </p>
          </div>
        </div>

        {/* Bottom Back Button */}
        <div className="mt-10">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookInfo;
