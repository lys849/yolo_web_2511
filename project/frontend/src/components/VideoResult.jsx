import client from "../api/client";

export default function VideoResult({ videoUrl }) {
  const fullUrl = client.defaults.baseURL + videoUrl;

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-4">检测结果</h2>

      <video
        src={fullUrl}
        controls
        className="w-full max-w-3xl border rounded"
      />
    </div>
  );
}
