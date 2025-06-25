import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from './components/HomePage';
import VideoPlayer from './components/VideoPlayer';
import UploadPage from './components/UploadPage'; // kalau ada upload
import LoginPage from './pages/LoginPage';
import BookmarkPage from './pages/BookmarkPage';
import History from './pages/History';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/video/:id" element={<VideoPlayer />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/bookmarks" element={<BookmarkPage />} />
        <Route path="/history" element={<History />} />
        <Route path="/upload" element={<UploadPage />} /> {/* opsional */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
