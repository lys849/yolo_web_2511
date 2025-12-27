# backend/api/video.py

import os
import uuid
import shutil

from fastapi import APIRouter, File, UploadFile, BackgroundTasks
from fastapi.responses import JSONResponse

from project.backend.services.video_process import process_video

router = APIRouter(prefix="/video", tags=["video"])

UPLOAD_DIR = "./project/backend/temp/uploads"
RESULT_DIR = "./project/backend/static/results/video"

# 内存任务表（MVP 阶段足够）
video_tasks = {}


@router.post("/upload")
async def upload_video(
    file: UploadFile = File(...),
    background_tasks: BackgroundTasks = None
):
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    task_id = uuid.uuid4().hex
    input_path = os.path.join(UPLOAD_DIR, f"{task_id}_{file.filename}")

    with open(input_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    video_tasks[task_id] = {
        "status": "processing",
        "result": None,
        "error": None,
    }

    background_tasks.add_task(
        process_video,
        input_path,
        RESULT_DIR,
        task_id,
        video_tasks
    )

    return {
        "task_id": task_id,
        "status": "processing",
    }


@router.get("/status/{task_id}")
def get_video_status(task_id: str):
    task = video_tasks.get(task_id)

    if not task:
        return JSONResponse(
            {"error": "task not found"},
            status_code=404
        )

    return task
