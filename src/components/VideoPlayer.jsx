import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Hls from "hls.js";

function VideoPlayer() {
  const navigate = useNavigate();
  const { id } = useParams();
  const videoRef = useRef(null);

  const [videoData, setVideoData] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [localComments, setLocalComments] = useState([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    const fetchVideoAndBookmark = async () => {
      try {
        const [videoRes, bookmarkRes] = await Promise.all([
          axios.get(`http://localhost:5000/videos/${id}`, {
            withCredentials: true,
          }),
          axios.get("http://localhost:5000/bookmarks", {
            withCredentials: true,
          }),
        ]);

        const video = videoRes.data.data.video;
        const ratingLoggedUser = videoRes.data.data.video.yourRating;
        const bookmarks = bookmarkRes.data.data.bookmarks;

        setVideoData(video);
        setLocalComments(video.comments || []);
        setUserRating(ratingLoggedUser);

        const bookmarked = bookmarks.some((b) => b.videoId === id);
        setIsBookmarked(bookmarked);
      } catch (err) {
        console.error("Gagal memuat data video/bookmark:", err);
        navigate("/login");
      }
    };

    fetchVideoAndBookmark();
  }, [id, navigate]);

  useEffect(() => {
    if (videoData && videoRef.current) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(videoData.url);
        hls.attachMedia(videoRef.current);
      } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
        videoRef.current.src = videoData.url;
      }
    }
  }, [videoData]);

  useEffect(() => {
    let hasViewed = false;

    const handlePlay = async () => {
      if (!hasViewed) {
        try {
          await axios.post(
            `http://localhost:5000/videos/${id}/view`,
            {},
            { withCredentials: true }
          );
          hasViewed = true;
          console.log("✅ View dikirim");
        } catch (err) {
          console.error("Gagal mengirim view:", err);
        }
      }
    };

    const videoEl = videoRef.current;
    if (videoEl) {
      videoEl.addEventListener("play", handlePlay);
    }

    return () => {
      if (videoEl) {
        videoEl.removeEventListener("play", handlePlay);
      }
    };
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await axios.post(
        `http://localhost:5000/videos/${id}/comment`,
        { content: newComment },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      const newEntry = {
        content: newComment,
        createdAt: new Date().toISOString(),
        userId: "Anda",
      };
      setLocalComments([...localComments, newEntry]);
      setNewComment("");
    } catch (err) {
      console.error("Gagal mengirim komentar:", err);
      alert("Komentar gagal dikirim.");
    }
  };

  const toggleBookmark = async () => {
    try {
      if (isBookmarked) {
        await axios.delete(`http://localhost:5000/videos/${id}/bookmark`, {
          withCredentials: true,
        });
        setIsBookmarked(false);
        setVideoData((prev) => ({
          ...prev,
          totalBookmark: prev.totalBookmark - 1,
        }));
      } else {
        await axios.post(
          `http://localhost:5000/videos/${id}/bookmark`,
          {},
          { withCredentials: true }
        );
        setIsBookmarked(true);
        setVideoData((prev) => ({
          ...prev,
          totalBookmark: prev.totalBookmark + 1,
        }));
      }
    } catch (err) {
      console.error("Gagal toggle bookmark:", err);
    }
  };

  const handleRating = async (score) => {
    try {
      await axios.post(
        `http://localhost:5000/videos/${id}/rating`,
        { score },
        { withCredentials: true }
      );
      // setUserRating(score);

      // setVideoData((prev) => ({
      //   ...prev,
      //   totalRating: score, // Atau logika lain jika kamu tahu cara hitung rata-rata
      // }));
      // console.log(`✅ Rating ${score} dikirim (POST)`);

      navigate(0);
    } catch (err) {
      console.warn("POST rating gagal, mencoba PUT sebagai fallback...");

      try {
        await axios.put(
          `http://localhost:5000/videos/${id}/rating`,
          { score },
          { withCredentials: true }
        );
        setUserRating(score);
        navigate(0);

        // setVideoData((prev) => ({
        //   ...prev,
        //   totalRating: score, // Atau logika lain jika kamu tahu cara hitung rata-rata
        // }));
        // console.log(`✅ Rating ${score} diperbarui (PUT)`);

        navigate(0);
      } catch (putErr) {
        console.error("Gagal mengirim atau memperbarui rating:", putErr);
        alert("Gagal mengirim rating. Silakan coba lagi.");
      }
    }
  };

  if (!videoData) return <p style={{ padding: "20px" }}>Memuat video...</p>;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>{videoData.title || "Judul Video"}</h2>

      <video
        ref={videoRef}
        controls
        width="640"
        height="360"
        style={{ borderRadius: "10px", border: "1px solid #ccc" }}
      />

      <p style={{ marginTop: "10px", fontStyle: "italic" }}>
        Diunggah oleh: <strong>{videoData.uploader.username}</strong>
      </p>

      <p>
        👁️ {videoData.totalView} views | ⭐ {videoData.totalRating} rating | 🔖{" "}
        {videoData.totalBookmark} bookmark
        <button
          onClick={toggleBookmark}
          style={{
            marginLeft: "10px",
            padding: "4px 10px",
            backgroundColor: isBookmarked ? "#dc3545" : "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {isBookmarked ? "Hapus Bookmark" : "Bookmark"}
        </button>
      </p>

      {/* ⭐ RATING SECTION */}
      <div style={{ margin: "15px 0" }}>
        <p>Beri Rating:</p>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => handleRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            style={{
              fontSize: "28px",
              cursor: "pointer",
              color:
                star <= (hoverRating || userRating)
                  ? "#ffc107"
                  : "#e4e5e9",
              transition: "color 0.2s",
              marginRight: "4px",
            }}
          >
            ★
          </span>
        ))}
      </div>

      <hr style={{ margin: "20px 0" }} />

      <h3>Komentar</h3>
      <form onSubmit={handleAddComment}>
        <textarea
          rows="3"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Tulis komentar..."
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
        <br />
        <button
          type="submit"
          style={{
            padding: "8px 16px",
            backgroundColor: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Kirim Komentar
        </button>
      </form>

      <ul style={{ marginTop: "20px", paddingLeft: 0, listStyle: "none" }}>
        {localComments.map((comment, i) => (
          <li
            key={i}
            style={{
              backgroundColor: "#f9f9f9",
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "12px 16px",
              marginBottom: "12px",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            }}
          >
            <div style={{ marginBottom: "6px" }}>
              <strong style={{ color: "#333" }}>
                {comment.user?.username || comment.userId}
              </strong>
            </div>
            <div style={{ marginBottom: "8px", lineHeight: "1.5" }}>
              {comment.content}
            </div>
            <div>
              <small style={{ color: "#777", fontSize: "12px" }}>
                {new Date(comment.createdAt).toLocaleString()}
              </small>
            </div>
          </li>
        ))}
      </ul>

    </div>
  );
}

export default VideoPlayer;
