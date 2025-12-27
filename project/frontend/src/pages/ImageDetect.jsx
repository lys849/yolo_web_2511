import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UploadArea from "../components/UploadArea";
import ResultView from "../components/ResultView";

export default function ImageDetect() {
  const [result, setResult] = useState(null);
  const navigate = useNavigate();
  document.body.classList.remove('home-page');
  
  return (
    // 使用 h-screen 确保容器占满全屏，flex-col 使其垂直分布
    <div className="flex flex-col h-screen bg-gray-50">
      
      {/* 区域一：固定顶部栏 (Header) */}
      <header className="bg-white shadow-sm p-4 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex gap-3">
            <button
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 transition-colors rounded text-gray-700"
              onClick={() => navigate("/")}
            >
              返回首页
            </button>
            <button
              className="px-4 py-2 bg-green-600 hover:bg-green-700 transition-colors text-white rounded shadow"
              onClick={() => navigate("/video")}
            >
              视频物品检测
            </button>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">图片物品检测</h1>
        </div>
      </header>

      {/* 区域二：内容展示区 (Content Area) */}
      {/* flex-1 会自动填满剩余空间，overflow-y-auto 允许在内容过多时内部滚动 */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="container mx-auto max-w-5xl">
          <div className="bg-white rounded-xl shadow-md p-6 space-y-8">
            {/* 上传区域 */}
            <section>
              <h2 className="text-lg font-semibold mb-4 text-gray-600">上传图片</h2>
              <UploadArea onResult={setResult} />
            </section>

            <hr className="border-gray-100" />

            {/* 结果显示区域 */}
            <section>
              <div className="flex justify-center border-2 border-dashed border-gray-100 rounded-lg p-4 min-h-[300px] items-center">
                {result ? (
                  <ResultView result={result} />
                ) : (
                  <p className="text-gray-400">暂无检测结果，请先上传图片</p>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
      
    </div>
  );
}
