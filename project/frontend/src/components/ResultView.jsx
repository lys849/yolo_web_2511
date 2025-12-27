import client from "../api/client";

export default function ResultView({ result }) {
    if (!result) return null;

    const imgUrl = client.defaults.baseURL + result.result_img;

    return (
        <div className="mt-4">
            <h2 className="text-xl font-bold mb-2">识别结果</h2>

            {/* 显示服务器生成的推理结果图 */}
            <img
                src={imgUrl}
                className="border rounded max-w-full"
            />

            {/* <h3 className="text-lg font-semibold mt-4">Detections</h3>
            <pre className="bg-gray-100 p-4 rounded text-sm">
                {JSON.stringify(result.detections, null, 2)}
            </pre> */}
        </div>
    );
}

