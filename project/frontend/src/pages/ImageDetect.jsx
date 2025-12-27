import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UploadArea from "../components/UploadArea";
import ResultView from "../components/ResultView";

export default function ImageDetect() {
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6">
      {/* 顶部栏 */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">图片物品检测</h1>

        <div className="flex gap-2">
          <button
            className="px-4 py-2 bg-gray-300 rounded"
            onClick={() => navigate("/")}
          >
            返回首页
          </button>

          <button
            className="px-4 py-2 bg-green-600 text-white rounded"
            onClick={() => navigate("/video")}
          >
            视频物品检测
          </button>
        </div>
      </div>

      {/* 原有逻辑，完全不动 */}
      <UploadArea onResult={setResult} />
      <ResultView result={result} />
    </div>
  );
}
