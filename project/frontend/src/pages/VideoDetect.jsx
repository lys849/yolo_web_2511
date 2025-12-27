import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";
import VideoUpload from "../components/VideoUpload";
import VideoResult from "../components/VideoResult";
import Loading from "../components/Loading";

export default function VideoDetect() {
  const [status, setStatus] = useState("idle");
  const [taskId, setTaskId] = useState(null);
  const [resultUrl, setResultUrl] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  /** 轮询任务状态 */
  useEffect(() => {
    if (status !== "processing" || !taskId) return;

    const timer = setInterval(async () => {
      try {
        const res = await client.get(`/video/status/${taskId}`);

        if (res.data.status === "done") {
          setResultUrl(res.data.result);
          setStatus("done");
          clearInterval(timer);
        }

        if (res.data.status === "error") {
          setError(res.data.error);
          setStatus("error");
          clearInterval(timer);
        }
      } catch (e) {
        setError("无法获取任务状态");
        setStatus("error");
        clearInterval(timer);
      }
    }, 2000);

    return () => clearInterval(timer);
  }, [status, taskId]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">🎥 视频物品检测</h1>

      {status === "idle" && (
        <VideoUpload
          onUploading={() => setStatus("uploading")}
          onUploaded={(taskId) => {
            setTaskId(taskId);
            setStatus("processing");
          }}
          onError={(msg) => {
            setError(msg);
            setStatus("error");
          }}
        />
      )}

      {(status === "uploading" || status === "processing") && (
        <Loading text="视频分析中，请耐心等待（可能需要 1~2 分钟）" />
      )}

      {status === "done" && (
        <VideoResult videoUrl={resultUrl} />
      )}

      {status === "error" && (
        <div className="text-red-600 mt-4">
          ❌ 出错了：{error}
        </div>
      )}

      <div className="mt-6 flex gap-4">
        <button
          className="px-4 py-2 border rounded"
          onClick={() => navigate("/")}
        >
          返回首页
        </button>

        <button
            className="px-4 py-2 bg-green-600 text-white rounded"
            onClick={() => navigate("/image")}
          >
            图片物品检测
        </button>
        {status === "done" && (
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() => {
              setStatus("idle");
              setTaskId(null);
              setResultUrl(null);
              setError(null);
            }}
          >
            重新上传
          </button>
        )}
      </div>
    </div>
  );
}

