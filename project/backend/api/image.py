# backend/api/image.py

import io
import os
import uuid
from fastapi import APIRouter, File, UploadFile
from fastapi.responses import JSONResponse
from PIL import Image

from project.backend.services.yolo import get_yolo_model
from project.model.model_loader import get_model

router = APIRouter(prefix="/image", tags=["image"])


@router.post("/predict/")
async def predict_image(file: UploadFile = File(...)):
    model = get_yolo_model()
    # model = get_model()

    contents = await file.read()
    img = Image.open(io.BytesIO(contents))

    try:
        results = model(img)
    except Exception as e:
        return JSONResponse(
            {"error": f"model inference failed: {e}"},
            status_code=500
        )

    save_dir = "./project/backend/static/results/img"
    os.makedirs(save_dir, exist_ok=True)

    filename = f"{uuid.uuid4().hex}.jpg"
    result_path = os.path.join(save_dir, filename)

    try:
        results[0].save(filename=result_path)
    except Exception as e:
        return JSONResponse(
            {"error": f"save result image failed: {e}"},
            status_code=500
        )

    result_url = f"/static/results/img/{filename}"

    detections = []
    for box in results[0].boxes:
        detections.append({
            "label": model.names[int(box.cls)],
            "confidence": float(box.conf),
            "bbox": box.xyxy[0].tolist(),
        })

    return {
        "detections": detections,
        "result_img": result_url,
    }

