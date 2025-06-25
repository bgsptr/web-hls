import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function HomePage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    // Ambil data dari API
    axios.get("http://localhost:5000/videos/", {
      withCredentials: true
    })
      .then((response) => {
        setMovies(response.data.results);
      })
      .catch((error) => {
        console.error("Error fetching videos:", error);
      });
  }, []);

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: "20px" }}>
      <h1>Daftar Film</h1>

      {/* SEARCH BAR */}
      <input
        type="text"
        placeholder="Cari film..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: "20px", padding: "8px", width: "300px" }}
      />

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {filteredMovies.map((movie) => (
          <div
            key={movie.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "10px",
              width: "300px",
            }}
          >
            <img
              src={movie.thumbnail}
              alt={movie.title}
              style={{ width: "100%" }}
            />
            <h3>{movie.title}</h3>
            <p>{movie.description}</p>
            <button
              onClick={() => navigate(`/video/${movie.videoId}`)}
              style={{
                padding: "8px 12px",
                borderRadius: "5px",
                backgroundColor: "#1976d2",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Tonton
            </button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "40px" }}>
        <Link to="/upload">
          <button
            style={{
              padding: "10px 20px",
              borderRadius: "5px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            ➕ Upload Video
          </button>
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
