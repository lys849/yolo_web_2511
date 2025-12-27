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
  document.body.classList.remove('home-page');
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

  // 重置状态函数
  const handleReset = () => {
    setStatus("idle");
    setTaskId(null);
    setResultUrl(null);
    setError(null);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* 区域一：固定顶部栏 */}
      <header className="bg-white shadow-sm p-4 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            {status === "processing" && (
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded animate-pulse">
                处理中...
              </span>
            )}
          </div>
          
          <div className="flex gap-3">
            <button
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 transition-colors rounded text-gray-700"
              onClick={() => navigate("/")}
            >
              返回首页
            </button>
            <button
              className="px-4 py-2 bg-green-600 hover:bg-green-700 transition-colors text-white rounded shadow"
              onClick={() => navigate("/image")}
            >
              图片物品检测
            </button>
            {status === "done" && (
              <button
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow"
              onClick={handleReset}
              >
                重新上传
              </button>
            )}
            <h1 className="text-2xl font-bold text-gray-800">🎥 视频物品检测</h1>
          </div>
        </div>
      </header>

      {/* 区域二：内容展示区 */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="container mx-auto max-w-5xl">
          <div className="bg-white rounded-xl shadow-md p-6 min-h-[400px] flex flex-col">
            
            {/* 状态逻辑分发 */}
            <div className="flex-1 flex flex-col justify-center">
              {status === "idle" && (
                <section className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-600 text-center">上传视频开始检测</h2>
                  <VideoUpload
                    onUploading={() => setStatus("uploading")}
                    onUploaded={(tid) => {
                      setTaskId(tid);
                      setStatus("processing");
                    }}
                  
                    onError={(msg) => {
                      setError(msg);
                      setStatus("error");
                    }}
                  />
                  <footer className="mt-6 text-center text-gray-400 text-sm">
                    建议视频时长不超过 30 秒以获得最佳处理速度。
                  </footer>
            
                  <hr className="border-gray-100" />
                </section>
              )}

              {(status === "uploading" || status === "processing") && (
                <div className="py-12">
                  <Loading text={status === "uploading" ? "视频上传中..." : "AI 正在逐帧分析视频，请耐心等待..."} />
                  <hr className="border-gray-100" />
                </div>
              )}

              {status === "done" && (
                <section className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-600">检测完成</h2>
                    <span className="text-sm text-green-600 font-medium">结果已生成</span>
                    <hr className="border-gray-100" />
                  </div>
                  <div className="rounded-lg overflow-hidden border border-gray-100 bg-black">
                    <VideoResult videoUrl={resultUrl} />
                  </div>
                </section>
              )}

              {status === "error" && (
                <div className="text-center py-12">
                  <div className="text-red-500 text-5xl mb-4">⚠️</div>
                  <div className="text-red-600 font-medium text-lg">出错了：{error}</div>
                  <button 
                    onClick={handleReset}
                    className="mt-6 text-blue-600 underline"
                  >
                    重试上传
                  </button>
                </div>
              )}
            </div>

          </div>
            
        </div>
      </main>
    </div>
  );
}