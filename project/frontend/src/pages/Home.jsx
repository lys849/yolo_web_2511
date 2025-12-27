// import { useState } from "react";
// import UploadArea from "../components/UploadArea";
// import ResultView from "../components/ResultView";

// export default function Home() {
//     const [result, setResult] = useState(null);

//     return (
//         <div className="container mx-auto p-6">
//             <h1 className="text-3xl font-bold mb-6">YOLO 图像识别 Demo</h1>
//             <UploadArea onResult={setResult} />
//             <ResultView result={result} />
//         </div>
//     );
// }
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">YOLO 推理平台</h1>
      <p className="text-gray-600">请选择推理模式</p>

      <button
        className="px-6 py-3 bg-blue-600 text-white rounded-lg"
        onClick={() => navigate("/image")}
      >
        图片物品检测
      </button>
     <br />
      <button
        className="px-6 py-3 bg-green-600 text-white rounded-lg"
        onClick={() => navigate("/video")}
      >
        视频物品检测
      </button>
    </div>
  );
}
