import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function BookmarkPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await axios.get("http://localhost:5000/bookmarks", {
          withCredentials: true,
        });

        setBookmarks(res.data.data.bookmarks || []);
      } catch (err) {
        console.error("Gagal mengambil bookmark:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

//   const handleDeleteBookmark = async (videoId) => {
//     try {
//       await axios.delete(`http://localhost:5000/videos/${videoId}/bookmark`, {
//         withCredentials: true,
//       });

//       setBookmarks((prev) =>
//         prev.filter((video) => video.videoId !== videoId)
//       );
//     } catch (err) {
//       console.error("Gagal menghapus bookmark:", err);
//       alert("Gagal menghapus bookmark. Silakan coba lagi.");
//     }
//   };

  if (loading) {
    return <div style={{ padding: "20px" }}>Memuat bookmark...</div>;
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Daftar Bookmark Video</h2>

      {bookmarks.length === 0 ? (
        <p>Tidak ada video yang dibookmark.</p>
      ) : (
        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
          {bookmarks.map((video) => (
            <li
              key={video.videoId}
              style={{
                border: "1px solid #ddd",
                padding: "15px",
                marginBottom: "10px",
                borderRadius: "8px",
              }}
            >
              <h3>{video.title}</h3>
              <p>
                Diunggah oleh: <strong>{video.uploadBy}</strong>
              </p>
              <p>
                Ditambahkan ke bookmark pada:{" "}
                <small>
                  {new Date(video.createdAt).toLocaleString("id-ID")}
                </small>
              </p>

              <div style={{ marginTop: "10px" }}>
                <Link
                  to={`/video/${video.videoId}`}
                  style={{
                    display: "inline-block",
                    padding: "6px 12px",
                    backgroundColor: "#1976d2",
                    color: "white",
                    borderRadius: "4px",
                    textDecoration: "none",
                    marginRight: "10px",
                  }}
                >
                  🎬 Tonton Video
                </Link>

                {/* <button
                  onClick={() => handleDeleteBookmark(video.videoId)}
                  style={{
                    padding: "6px 12px",
                    backgroundColor: "#dc3545",
                    color: "white",
                    borderRadius: "4px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  ❌ Hapus Bookmark
                </button> */}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default BookmarkPage;
