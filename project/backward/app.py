# A Demo
# 提供 predict接口
# 接受图片
# 调用模型接口
# 返回图片
# 启动服务
# python -m uvicorn project.backward.app:app --reload

from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse, FileResponse
from PIL import Image
import io, os, uuid
from project.model.model_loader import get_model
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.mount("/static", StaticFiles(directory="./project/static"), name="static")
# 从 project/model 模块加载 YOLO 模型
model = get_model()
# 中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],    # 你也可以换成具体来源，例如 http://localhost:8000
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "yolo image recognition API running."}


@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()
    img = Image.open(io.BytesIO(contents))

    try:
        results = model(img)
    except Exception as e:
        return JSONResponse({"error": f"model inference failed: {e}"}, status_code=500)

    save_dir = "./project/static/results"
    os.makedirs(save_dir, exist_ok=True)
    filename = f"{uuid.uuid4().hex}.jpg"
    result_path = f"{save_dir}/{filename}"
    try:
        results[0].save(filename=result_path)
    except Exception as e:
        return JSONResponse(
            {"error": f"save result image failed: {e}"}, status_code=500
        )

    # 返回可被静态路由访问的 URL（FastAPI 挂载了 /static 指向 ./project/static）
    result_url = f"/static/results/{filename}"

    detections = []
    for box in results[0].boxes:
        detections.append(
            {
                "label": model.names[int(box.cls)],
                "confidence": float(box.conf),
                "bbox": box.xyxy[0].tolist(),
            }
        )

    return JSONResponse(
        {
            "detections": detections,
            "result_img": result_url,
        }
    )
