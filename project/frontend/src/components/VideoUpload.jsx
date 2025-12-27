import { useState } from "react";
import client from "../api/client";

export default function VideoUpload({ onUploading, onUploaded, onError }) {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      onUploading();

      const res = await client.post("/video/upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onUploaded(res.data.task_id);
    } catch (e) {
      onError("视频上传失败");
    }
  };

  return (
    <div className="border p-4 rounded flex flex-col gap-4 max-w-md">
      <input
        type="file"
        accept="video/*"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={handleUpload}
      >
        上传并开始检测
      </button>
    </div>
  );
}
