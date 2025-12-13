import { useState } from "react";
import client from "../api/client";

export default function UploadArea({ onResult }) {
    const [image, setImage] = useState(null);

    const handleUpload = async () => {
        if (!image) return;

        const formData = new FormData();
        formData.append("file", image);

        try {
            const res = await client.post("/predict/", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            onResult(res.data);

        } catch (e) {
            alert("上传或推理失败：" + e);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4 p-4 border rounded">
            <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
            />
            <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={handleUpload}
            >
                上传并识别
            </button>
        </div>
    );
}