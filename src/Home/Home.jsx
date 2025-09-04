import { useNavigate } from "react-router";

function Home() {
  const navigate = useNavigate();

  return (
    <>
      <div
        onClick={() => {
          navigate("/insert");
        }}
        className="cursor-pointer text-blue-600 hover:underline"
      >
        insert
      </div>

      <div
        onClick={() => {
          navigate("/pos");
        }}
        className="cursor-pointer text-blue-600 hover:underline"
      >
        Sell
      </div>
      <div
        onClick={() => {
          navigate("/reports");
        }}
        className="cursor-pointer text-blue-600 hover:underline"
      >
        Reports
      </div>
      <div
        onClick={() => {
          navigate("/books");
        }}
        className="cursor-pointer text-blue-600 hover:underline"
      >
        Books
      </div>
    </>
  );
}

export default Home;
