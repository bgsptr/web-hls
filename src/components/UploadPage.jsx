import React from "react";

function UploadPage() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Upload Video</h1>
      <form>
        <div>
          <label>Judul Video:</label><br />
          <input type="text" placeholder="Masukkan judul" />
        </div>
        <br />
        <div>
          <label>Deskripsi:</label><br />
          <textarea placeholder="Masukkan deskripsi"></textarea>
        </div>
        <br />
        <div>
          <label>File Video:</label><br />
          <input type="file" />
        </div>
        <br />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

export default UploadPage;