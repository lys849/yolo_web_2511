import { useState } from "react";
import UploadArea from "../components/UploadArea";
import ResultView from "../components/ResultView";

export default function Home() {
    const [result, setResult] = useState(null);

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">YOLO 图像识别 Demo</h1>
            <UploadArea onResult={setResult} />
            <ResultView result={result} />
        </div>
    );
}
