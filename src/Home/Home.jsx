import { useNavigate } from "react-router";
import "../Home/Styles/Home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="home-link" onClick={() => navigate("/insert")}>
        Insert
      </div>

      <div className="home-link" onClick={() => navigate("/pos")}>
        Sell
      </div>

      <div className="home-link" onClick={() => navigate("/reports")}>
        Reports
      </div>

      <div className="home-link" onClick={() => navigate("/books")}>
        Books
      </div>
    </div>
  );
}

export default Home;
