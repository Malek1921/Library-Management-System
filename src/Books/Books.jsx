import { useNavigate } from "react-router";
import books from "./utils/books";

function Books() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
      {books.map((book) => (
        <div
          key={book.id}
          className="bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-md p-4 flex flex-col hover:shadow-lg transition"
        >
          <div className="w-[370px] h-[500px] bg-gray-200 rounded-xl flex items-center justify-center overflow-hidden">
            {book.cover ? (
              <img
                src={book.cover}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-400">No Image</span>
            )}
          </div>

          <div className="flex flex-col mt-4 flex-1">
            <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1 min-h-[2rem]">
              {book.title}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 min-h-[1rem]">
              {book.author}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 min-h-[1rem]">
              {book.year}
            </p>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200 min-h-[1rem]">
              ${book.price}
            </p>

            <button
              onClick={() => navigate(`/book/${book.id}`)}
              className="mt-auto px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
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
