import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get("http://localhost:5000/history", {
          withCredentials: true,
        });
        setHistory(res.data.history || []);
      } catch (err) {
        console.error("Gagal mengambil riwayat:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) return <p style={{ padding: "20px" }}>Memuat riwayat...</p>;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Riwayat Tontonan</h2>
      {history.length === 0 ? (
        <p>Belum ada riwayat tontonan.</p>
      ) : (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {history.map((item) => (
            <li
              key={item.videoId}
              style={{
                marginBottom: "16px",
                padding: "12px",
                border: "1px solid #ccc",
                borderRadius: "8px",
              }}
            >
              <h3 style={{ margin: "0 0 8px" }}>{item.title}</h3>
              <p style={{ margin: "0 0 4px", fontSize: "0.9em", color: "#666" }}>
                Ditonton pada:{" "}
                {new Date(item.updatedAt).toLocaleString("id-ID")}
              </p>
              <p style={{ margin: 0, fontSize: "0.9em" }}>
                Diunggah oleh: <strong>{item.uploadBy}</strong>
              </p>
              <Link
                to={`/video/${item.videoId}`}
                style={{
                  marginTop: "8px",
                  display: "inline-block",
                  padding: "6px 12px",
                  backgroundColor: "#1976d2",
                  color: "#fff",
                  borderRadius: "4px",
                  textDecoration: "none",
                }}
              >
                Tonton Ulang
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default History;
